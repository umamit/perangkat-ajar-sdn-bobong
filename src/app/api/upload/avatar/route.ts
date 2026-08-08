import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const nip = formData.get('nip') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 });
    }

    // Validasi tipe file gambar
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File harus berupa gambar' }, { status: 400 });
    }

    // Validasi ukuran file (maksimal 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'Ukuran file gambar maksimal 5MB' }, { status: 400 });
    }

    const supabase = getSupabase();
    
    // Siapkan buffer array
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanNip = nip ? nip.replace(/[^a-zA-Z0-9]/g, '') : Date.now().toString();
    const fileName = `avatar_${cleanNip}_${Date.now()}.${fileExt}`;

    // Upload file ke Supabase Storage bucket 'avatars'
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('[Avatar Upload Error]', uploadError);
      return NextResponse.json({ success: false, error: 'Gagal mengunggah file ke cloud storage' }, { status: 500 });
    }

    // Dapatkan public URL
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    console.error('[Avatar Upload API Error]', err);
    return NextResponse.json({ success: false, error: err.message || 'Terjadi kesalahan internal' }, { status: 500 });
  }
}
