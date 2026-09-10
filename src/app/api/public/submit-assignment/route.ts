import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ADMIN_NIP = '199610272019032006';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const senderName = (formData.get('senderName') as string || '').trim();
    const senderContact = (formData.get('senderContact') as string || '').trim();
    const subject = (formData.get('subject') as string || '').trim();
    const title = (formData.get('title') as string || '').trim();
    const classId = (formData.get('classId') as string || '1A').trim();
    const type = (formData.get('type') as string || 'Formatif').trim();
    const dueDate = (formData.get('dueDate') as string || new Date().toISOString().split('T')[0]).trim();
    const description = (formData.get('description') as string || '').trim();
    const file = formData.get('file') as File | null;

    if (!senderName || !title) {
      return NextResponse.json(
        { success: false, error: 'Nama pengirim dan judul soal wajib diisi' },
        { status: 400 }
      );
    }

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file && file.size > 0) {
      const MAX_SIZE = 20 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Ukuran file dokumen maksimal 20MB' },
          { status: 400 }
        );
      }

      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `soal/publik/${Date.now()}_${cleanName}`;

      const supabase = getSupabase();
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: true,
        });

      if (uploadError) {
        console.error('[Public Soal Upload Storage Error]', uploadError);
        return NextResponse.json(
          { success: false, error: 'Gagal mengunggah berkas ke penyimpanan cloud' },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);

      fileUrl = publicUrlData.publicUrl;
      fileName = file.name;
    }

    // Bangun deskripsi dengan identitas pengirim publik
    const contactInfo = senderContact ? ` (${senderContact})` : '';
    const subjectInfo = subject ? ` [Mapel: ${subject}]` : '';
    const publicMetaHeader = `[PENGIRIM PUBLIK: ${senderName}${contactInfo}${subjectInfo}]`;
    const fullDescription = description ? `${publicMetaHeader}\n${description}` : publicMetaHeader;

    const newAssignment = {
      id: crypto.randomUUID(),
      title: title,
      class_id: classId,
      due_date: dueDate,
      status: 'Menunggu Verifikasi',
      teacher_nip: ADMIN_NIP,
      file_url: fileUrl,
      file_name: fileName,
      description: fullDescription,
      type: type,
    };

    const supabase = getSupabase();
    const { error: insertError } = await supabase.from('assignments').insert(newAssignment);

    if (insertError) {
      console.error('[Public Soal Insert Error]', insertError);
      return NextResponse.json(
        { success: false, error: 'Gagal mencatat data soal ke cloud database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Berkas soal berhasil dikirim ke SD Negeri Bobong',
      id: newAssignment.id,
      fileUrl: fileUrl,
    });
  } catch (err: any) {
    console.error('[Public Soal API Error]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Terjadi kesalahan sistem' },
      { status: 500 }
    );
  }
}
