export function buildAiPrompt(body: any): string {
  const { prompt, mode, grade, subject } = body;
  if (mode === "modul_ajar") {
    return `Buatkan Draft Modul Ajar (RPP) Kurikulum Merdeka yang lengkap dan detail:
- Kelas: ${grade || "Kelas 6"}
- Mata Pelajaran: ${subject || "Bahasa Inggris"}
- Topik/Materi: ${prompt}

Struktur Wajib:
1. INFORMASI UMUM (Identitas, Fase, Alokasi Waktu, Profil Pelajar Pancasila, Sarana & Prasarana)
2. KOMPONEN INTI (Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Pemahaman Bermakna, Pertanyaan Pemantik)
3. KEGIATAN PEMBELAJARAN (Pendahuluan, Kegiatan Inti, Penutup)
4. ASESMEN & PENILAIAN (Asesmen Formatif & Sumatif)`;
  }
  if (mode === "soal_asesmen") {
    return `Buatkan Bank Soal Asesmen Kurikulum Merdeka:
- Kelas: ${grade || "Kelas 6"}
- Mata Pelajaran: ${subject || "Bahasa Inggris"}
- Topik/Materi: ${prompt}

Struktur Wajib:
1. 5 Soal Pilihan Ganda (beserta Opsi A, B, C, D)
2. 3 Soal Isian Singkat
3. 2 Soal Uraian/HOTS
4. Kunci Jawaban Lengkap dan Rubrik Penilaian`;
  }
  if (mode === "alur_tujuan") {
    return `Buatkan Alur Tujuan Pembelajaran (ATP) Kurikulum Merdeka yang sistematis:
- Kelas: ${grade || "Kelas 6"}
- Mata Pelajaran: ${subject || "Bahasa Inggris"}
- Topik/Materi Utama: ${prompt}

Struktur Wajib:
1. Analisis Capaian Pembelajaran (CP) terkait topik
2. Tujuan Pembelajaran (TP) yang diturunkan (minimal 3 TP)
3. Alur Runtutan Pembelajaran (Langkah 1, Langkah 2, Langkah 3)
4. Perkiraan Alokasi Jam Pelajaran (JP) dan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)`;
  }
  if (mode === "lkpd_interaktif") {
    return `Buatkan Lembar Kerja Peserta Didik (LKPD) Kurikulum Merdeka yang menarik dan siap pakai:
- Kelas: ${grade || "Kelas 6"}
- Mata Pelajaran: ${subject || "Bahasa Inggris"}
- Topik/Materi: ${prompt}

Struktur Wajib:
1. Judul LKPD, Kelas, Mata Pelajaran
2. Tujuan Aktivitas
3. Petunjuk Pengerjaan
4. Langkah Kerja / Instruksi Kerja Tugas (Tugas Mandiri/Kelompok)
5. Lembar Jawaban Siswa & Instrumen Penilaian Sederhana`;
  }
  if (mode === "projek_p5") {
    const p5Phase = grade?.includes("1") || grade?.includes("2") ? "A" : (grade?.includes("3") || grade?.includes("4") ? "B" : "C");
    return `Buatkan Rancangan Ringkas Modul Projek Penguatan Profil Pelajar Pancasila (P5) yang kreatif untuk Sekolah Dasar:
- Sasaran Kelas/Fase: ${grade || "Kelas 6"} (Fase ${p5Phase})
- Tema P5 Pilihan: ${prompt || "Gaya Hidup Berkelanjutan"}

Struktur Wajib:
1. Identitas Projek (Tema, Topik Spesifik, Alokasi Waktu)
2. Dimensi, Elemen, dan Sub-elemen Profil Pelajar Pancasila yang disasar
3. Alur Kegiatan Projek (Tahap Pengenalan, Kontekstualisasi, Aksi, Refleksi, Tindak Lanjut)
4. Rubrik Asesmen Projek P5`;
  }
  if (mode === "deskripsi_rapor") {
    return `Tuliskan rekomendasi narasi Deskripsi Capaian Kompetensi Rapor Kurikulum Merdeka yang profesional, santun, dan objektif untuk siswa:
- Nama Siswa: ${prompt}
- Kelas: ${grade || "Kelas 6"}
- Mata Pelajaran: ${subject || "Bahasa Inggris"}
- Nilai Akhir: ${body.score || 80}

Aturan Penulisan:
1. Jika Nilai >= 85: Tuliskan capaian sangat baik dalam menguasai materi pokok dan menyarankan pengembangan berkelanjutan.
2. Jika Nilai 75 - 84: Tuliskan capaian baik dalam menguasai materi pokok dan berikan sedikit bimbingan pada area pemahaman.
3. Jika Nilai < 75: Tuliskan area kompetensi yang perlu bimbingan intensif dan rekomendasi tindakan remedial terukur.
4. Gunakan nama siswa secara langsung dalam narasi (contoh: "Ananda [Nama Siswa] menunjukkan...").
5. Hasil maksimal 3 kalimat padat, to-the-point, dan ramah.`;
  }
  if (mode === "generate_flashcards") {
    return `Buatkan 5 kartu kosakata/istilah interaktif (flashcard) untuk materi sekolah dasar:
- Topik: ${prompt}
- Fase/Tingkat: ${grade || "Fase A"}
- Mata Pelajaran: ${subject || "Bahasa Inggris"}

Keluaran WAJIB berupa JSON array mentah tanpa format Markdown lain (JANGAN ada bungkus \`\`\`json atau teks pembuka/penutup lainnya). Setiap objek kartu dalam array harus memiliki properti berikut secara presisi:
{
  "word": "Kata atau istilah utama sesuai topik dan mata pelajaran",
  "meaning": "Definisi, arti, atau penjelasan singkat mengenai kata/istilah tersebut dalam Bahasa Indonesia",
  "category": "Kategori spesifik (misal: Benda Kelas, Istilah Olahraga, Nilai Akhlak, dll.)",
  "phase": "${grade || "Fase A"}",
  "example": "Contoh kalimat penggunaan kata/istilah tersebut sesuai konteks sekolah dasar"
}`;
  }
  if (mode === "sempurnakan_jurnal") {
    return `Tolong sempurnakan draft catatan harian jurnal mengajar berikut agar menjadi laporan resmi, formal, dan profesional yang sesuai untuk administrasi sekolah:
- Draft Kasar Guru: "${prompt}"
- Mata Pelajaran: ${subject || "Bahasa Inggris"}
- Kelas: ${grade || "Kelas 6"}

Format hasil akhir langsung berupa narasi paragraf jurnal yang siap dipakai (tanpa pembuka/penutup seperti "Tentu, ini hasilnya:"). Buat teks menjadi formal, rapi, menyertakan langkah tindak lanjut evaluasi pembelajaran secara akademis.`;
  }
  if (mode === "rekomendasi_absensi") {
    return `Tuliskan rekomendasi tindakan dan draft surat pemanggilan orang tua / bimbingan konseling resmi untuk kasus ketidakhadiran siswa:
- Nama Siswa: ${prompt}
- Kelas: ${grade || "Kelas 6"}
- Detail Ketidakhadiran: ${body.details || "Tidak hadir tanpa keterangan 3 kali berturut-turut"}

Struktur Keluaran:
1. Analisis Singkat Kasus (1-2 kalimat)
2. Rekomendasi Tindakan untuk Guru (poin-poin pendek)
3. Draft Surat Panggilan Orang Tua resmi dari SD Negeri Bobong yang sopan, rapi, dan formal (siap disalin)`;
  }
  return prompt || "";
}
