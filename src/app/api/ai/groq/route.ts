import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, mode, grade, subject } = body;

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
    } else if (mode === 'alur_tujuan') {
      userMessage = `Buatkan Alur Tujuan Pembelajaran (ATP) Kurikulum Merdeka yang sistematis:
- Kelas: ${grade || 'Kelas 6'}
- Mata Pelajaran: ${subject || 'Bahasa Inggris'}
- Topik/Materi Utama: ${prompt}

Struktur Wajib:
1. Analisis Capaian Pembelajaran (CP) terkait topik
2. Tujuan Pembelajaran (TP) yang diturunkan (minimal 3 TP)
3. Alur Runtutan Pembelajaran (Langkah 1, Langkah 2, Langkah 3)
4. Perkiraan Alokasi Jam Pelajaran (JP) dan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)`;
    } else if (mode === 'lkpd_interaktif') {
      userMessage = `Buatkan Lembar Kerja Peserta Didik (LKPD) Kurikulum Merdeka yang menarik dan siap pakai:
- Kelas: ${grade || 'Kelas 6'}
- Mata Pelajaran: ${subject || 'Bahasa Inggris'}
- Topik/Materi: ${prompt}

Struktur Wajib:
1. Judul LKPD, Kelas, Mata Pelajaran
2. Tujuan Aktivitas
3. Petunjuk Pengerjaan
4. Langkah Kerja / Instruksi Kerja Tugas (Tugas Mandiri/Kelompok)
5. Lembar Jawaban Siswa & Instrumen Penilaian Sederhana`;
    } else if (mode === 'projek_p5') {
      const p5Phase = grade?.includes('1') || grade?.includes('2') ? 'A' : (grade?.includes('3') || grade?.includes('4') ? 'B' : 'C');
      userMessage = `Buatkan Rancangan Ringkas Modul Projek Penguatan Profil Pelajar Pancasila (P5) yang kreatif untuk Sekolah Dasar:
- Sasaran Kelas/Fase: ${grade || 'Kelas 6'} (Fase ${p5Phase})
- Tema P5 Pilihan: ${prompt || 'Gaya Hidup Berkelanjutan'}

Struktur Wajib:
1. Identitas Projek (Tema, Topik Spesifik, Alokasi Waktu)
2. Dimensi, Elemen, dan Sub-elemen Profil Pelajar Pancasila yang disasar
3. Alur Kegiatan Projek (Tahap Pengenalan, Kontekstualisasi, Aksi, Refleksi, Tindak Lanjut)
4. Rubrik Asesmen Projek P5`;
    } else if (mode === 'deskripsi_rapor') {
      userMessage = `Tuliskan rekomendasi narasi Deskripsi Capaian Kompetensi Rapor Kurikulum Merdeka yang profesional, santun, dan objektif untuk siswa:
- Nama Siswa: ${prompt}
- Kelas: ${grade || 'Kelas 6'}
- Mata Pelajaran: ${subject || 'Bahasa Inggris'}
- Nilai Akhir: ${body.score || 80}

Aturan Penulisan:
1. Jika Nilai >= 85: Tuliskan capaian sangat baik dalam menguasai materi pokok dan menyarankan pengembangan berkelanjutan.
2. Jika Nilai 75 - 84: Tuliskan capaian baik dalam menguasai materi pokok dan berikan sedikit bimbingan pada area pemahaman.
3. Jika Nilai < 75: Tuliskan area kompetensi yang perlu bimbingan intensif dan rekomendasi tindakan remedial terukur.
4. Gunakan nama siswa secara langsung dalam narasi (contoh: "Ananda [Nama Siswa] menunjukkan...").
5. Hasil maksimal 3 kalimat padat, to-the-point, dan ramah.`;
    } else if (mode === 'generate_flashcards') {
      userMessage = `Buatkan 5 kartu kosakata interaktif (flashcard) untuk materi sekolah dasar:
- Topik: ${prompt}
- Fase/Tingkat: ${grade || 'Fase A'}
- Mata Pelajaran: ${subject || 'Bahasa Inggris'}

Keluaran WAJIB berupa JSON array mentah tanpa format Markdown lain (JANGAN ada bungkus \`\`\`json atau teks pembuka/penutup lainnya). Setiap objek kartu dalam array harus memiliki properti berikut secara presisi:
{
  "word": "Kata/istilah dalam Bahasa Inggris atau topik",
  "meaning": "Arti kata/terjemahan dalam Bahasa Indonesia",
  "category": "Kategori spesifik (misal: Benda Kelas, Tubuh manusia, dll.)",
  "phase": "${grade || 'Fase A'}",
  "example": "Contoh kalimat penggunaan kata tersebut"
}`;
    } else if (mode === 'sempurnakan_jurnal') {
      userMessage = `Tolong sempurnakan draft catatan harian jurnal mengajar berikut agar menjadi laporan resmi, formal, dan profesional yang sesuai untuk administrasi sekolah:
- Draft Kasar Guru: "${prompt}"
- Mata Pelajaran: ${subject || 'Bahasa Inggris'}
- Kelas: ${grade || 'Kelas 6'}

Format hasil akhir langsung berupa narasi paragraf jurnal yang siap dipakai (tanpa pembuka/penutup seperti "Tentu, ini hasilnya:"). Buat teks menjadi formal, rapi, menyertakan langkah tindak lanjut evaluasi pembelajaran secara akademis.`;
    } else if (mode === 'rekomendasi_absensi') {
      userMessage = `Tuliskan rekomendasi tindakan dan draft surat pemanggilan orang tua / bimbingan konseling resmi untuk kasus ketidakhadiran siswa:
- Nama Siswa: ${prompt}
- Kelas: ${grade || 'Kelas 6'}
- Detail Ketidakhadiran: ${body.details || 'Tidak hadir tanpa keterangan 3 kali berturut-turut'}

Struktur Keluaran:
1. Analisis Singkat Kasus (1-2 kalimat)
2. Rekomendasi Tindakan untuk Guru (poin-poin pendek)
3. Draft Surat Panggilan Orang Tua resmi dari SD Negeri Bobong yang sopan, rapi, dan formal (siap disalin)`;
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
    let aiText = data.choices?.[0]?.message?.content || 'Tidak ada tanggapan dari AI.';

    if (mode === 'generate_flashcards') {
      aiText = aiText.trim();
      if (aiText.startsWith('```')) {
        aiText = aiText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      }
    }

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
