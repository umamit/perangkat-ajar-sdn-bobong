import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, mode, grade, subject } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    const systemInstructions = `Anda adalah AI Asisten Kurikulum Merdeka SD Negeri Bobong (Kabupaten Pulau Taliabu).
Tugas Anda adalah membantu guru menyusun Perangkat Ajar berkualitas tinggi, santun, terstruktur, dan sesuai panduan Kurikulum Merdeka Kemdikbudristek.
Gunakan Bahasa Indonesia yang baku, profesional, dan mudah dipahami.
Format hasil keluaran dalam GitHub-flavored Markdown yang rapi dengan sub-judul, poin-poin, dan tabel jika diperlukan.`;

    let userMessage = prompt || '';
    if (mode === 'modul_ajar') {
      userMessage = `Buatkan Draft Modul Ajar (RPP) Kurikulum Merdeka yang lengkap dan detail:
- Kelas: ${grade || 'Kelas 6'}
- Mata Pelajaran: ${subject || 'Bahasa Inggris'}
- Topik/Materi: ${prompt}

Struktur Wajib:
1. INFORMASI UMUM (Identitas, Fase, Alokasi Waktu, Profil Pelajar Pancasila, Sarana & Prasarana)
2. KOMPONEN INTI (Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Pemahaman Bermakna, Pertanyaan Pemantik)
3. KEGIATAN PEMBELAJARAN (Pendahuluan, Kegiatan Inti, Penutup)
4. ASESMEN & PENILAIAN (Asesmen Formatif & Sumatif)`;
    } else if (mode === 'soal_asesmen') {
      userMessage = `Buatkan Bank Soal Asesmen Kurikulum Merdeka:
- Kelas: ${grade || 'Kelas 6'}
- Mata Pelajaran: ${subject || 'Bahasa Inggris'}
- Topik/Materi: ${prompt}

Struktur Wajib:
1. 5 Soal Pilihan Ganda (beserta Opsi A, B, C, D)
2. 3 Soal Isian Singkat
3. 2 Soal Uraian/HOTS
4. Kunci Jawaban Lengkap dan Rubrik Penilaian`;
    }

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GROQ_API_KEY belum dikonfigurasi di lingkungan server (.env)',
        fallbackResponse: `### ⚠️ Perhatian: Groq API Key Belum Dikonfigurasi\n\nSilakan tambahkan \`GROQ_API_KEY=gsk_...\` di file \`.env\` atau di Vercel Environment Variables untuk mengaktifkan AI secara langsung.\n\n---\n\n### 📝 Contoh Draft ${mode === 'soal_asesmen' ? 'Bank Soal' : 'Modul Ajar'}: ${prompt}\n\n**Mata Pelajaran**: ${subject || 'Bahasa Inggris'} (${grade || 'Kelas 6'})\n\n**1. Tujuan Pembelajaran (TP)**:\nSiswa mampu memahami dan mempraktikkan materi **${prompt}** secara aktif dalam kehidupan sehari-hari.\n\n**2. Langkah Pembelajaran**:\n- **Pendahuluan (10 menit)**: Salam, doa, apresepsi & pertanyaan pemantik.\n- **Kegiatan Inti (50 menit)**: Eksplorasi materi ${prompt}, diskusi kelompok, dan latihan terbimbing.\n- **Penutup (10 menit)**: Refleksi pembelajaran, umpan balik, dan doa penutup.`
      }, { status: 200 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: errorData.error?.message || `Groq API Error HTTP ${response.status}`,
      }, { status: 500 });
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content || 'Tidak ada tanggapan dari AI.';

    return NextResponse.json({
      success: true,
      result: aiText,
      model: data.model || 'llama-3.3-70b-versatile',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Terjadi kesalahan pada server AI',
    }, { status: 500 });
  }
}
