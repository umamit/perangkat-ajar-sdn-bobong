import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const path = formData.get('path') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 });
    }

    if (!path) {
      return NextResponse.json({ success: false, error: 'Path tujuan tidak ditemukan' }, { status: 400 });
    }

    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'Ukuran file dokumen maksimal 15MB' }, { status: 400 });
    }

    const supabase = getSupabase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });

    if (uploadError) {
      console.error('[Document Upload Error]', uploadError);
      return NextResponse.json({ success: false, error: 'Gagal mengunggah file ke cloud storage' }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(path);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    console.error('[Document Upload API Error]', err);
    return NextResponse.json({ success: false, error: err.message || 'Terjadi kesalahan internal' }, { status: 500 });
  }
}
