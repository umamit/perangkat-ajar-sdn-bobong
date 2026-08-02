// Data Seed Perangkat Ajar Bahasa Inggris SD Negeri Bobong (Kurikulum Merdeka)
import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  teacher: {
    name: "Guru Bahasa Inggris",
    role: "Guru Mata Pelajaran",
    school: "SD Negeri Bobong",
    kecamatan: "Kecamatan Taliabu Barat",
    nip: "199610272019032006",
    password: "kepseksdnbobong",
    semester: "Ganjil 2025/2026",
    avatar: "assets/logo-sdn-bobong.png",
    subject: "Bahasa Inggris"
  },

  teachers: [
    { nip: "199610272019032006", name: "Guru Bahasa Inggris", role: "Guru Mata Pelajaran", subject: "Bahasa Inggris", password: "kepseksdnbobong", avatar: "assets/logo-sdn-bobong.png" },
    { nip: "197508201999031002", name: "Kepala Sekolah SDN Bobong", role: "Kepala Sekolah / Admin", subject: "Manajemen Sekolah", password: "kepseksdnbobong", avatar: "assets/logo-sdn-bobong.png" },
    { nip: "199105122018021001", name: "Nurhalisa, S.Pd.", role: "Guru Kelas", subject: "Guru Kelas 1A", password: "sdnbobong", avatar: "assets/logo-sdn-bobong.png" },
    { nip: "198803152014032003", name: "Rahmat Hidayat, S.Pd.", role: "Guru Kelas", subject: "Guru Kelas 4A", password: "sdnbobong", avatar: "assets/logo-sdn-bobong.png" }
  ],

  timetable: [
    { day: "Senin", time: "07.30 - 08.40", classId: "1A", topic: "Unit 1: Greetings" },
    { day: "Senin", time: "09.00 - 10.10", classId: "4A", topic: "Unit 1: What Are You Doing?" },
    { day: "Selasa", time: "07.30 - 08.40", classId: "2A", topic: "Unit 1: My Family" },
    { day: "Rabu", time: "08.40 - 09.50", classId: "5A", topic: "Unit 2: Tastes & Foods" },
    { day: "Kamis", time: "09.00 - 10.10", classId: "6A", topic: "Unit 2: Past Events" },
    { day: "Jumat", time: "08.00 - 09.10", classId: "3A", topic: "Unit 1: Animals Around Us" }
  ],

  classes: [
    { id: "1A", name: "Kelas 1 - A", room: "Ruang 01A", phase: "Fase A" },
    { id: "1B", name: "Kelas 1 - B", room: "Ruang 01B", phase: "Fase A" },
    { id: "2A", name: "Kelas 2 - A", room: "Ruang 02A", phase: "Fase A" },
    { id: "2B", name: "Kelas 2 - B", room: "Ruang 02B", phase: "Fase A" },
    { id: "3A", name: "Kelas 3 - A", room: "Ruang 03A", phase: "Fase B" },
    { id: "3B", name: "Kelas 3 - B", room: "Ruang 03B", phase: "Fase B" },
    { id: "4A", name: "Kelas 4 - A", room: "Ruang 04A", phase: "Fase B" },
    { id: "4B", name: "Kelas 4 - B", room: "Ruang 04B", phase: "Fase B" },
    { id: "5A", name: "Kelas 5 - A", room: "Ruang 05A", phase: "Fase C" },
    { id: "5B", name: "Kelas 5 - B", room: "Ruang 05B", phase: "Fase C" },
    { id: "6A", name: "Kelas 6 - A", room: "Ruang 06A", phase: "Fase C" },
    { id: "6B", name: "Kelas 6 - B", room: "Ruang 06B", phase: "Fase C" }
  ],

  students: [
    { id: "S3A01", nis: "3182096289", name: "Farah Ayesha DG Lila", classId: "3A", gender: "P", scoreFormatif: 88, scoreSumatif: 90 },
    { id: "S3A02", nis: "3A-002", name: "Wa Delia", classId: "3A", gender: "P", scoreFormatif: 82, scoreSumatif: 84 },
    { id: "S3A03", nis: "3A-003", name: "Shilvi Darson", classId: "3A", gender: "P", scoreFormatif: 85, scoreSumatif: 86 },
    { id: "S3A04", nis: "3A-004", name: "Abd Rajap Taudo", classId: "3A", gender: "L", scoreFormatif: 80, scoreSumatif: 82 },
    { id: "S3A05", nis: "3181555901", name: "Addar Quthni Izzatul Ibrahim", classId: "3A", gender: "L", scoreFormatif: 90, scoreSumatif: 92 },
    { id: "S3A06", nis: "3180570369", name: "Muhammad Athar Iskandar", classId: "3A", gender: "L", scoreFormatif: 92, scoreSumatif: 94 },
    { id: "S3A07", nis: "3171690218", name: "Alisa", classId: "3A", gender: "P", scoreFormatif: 86, scoreSumatif: 88 },
    { id: "S3A08", nis: "382311803", name: "Ayrin R. La rumi", classId: "3A", gender: "P", scoreFormatif: 89, scoreSumatif: 91 },
    { id: "S3A09", nis: "3179033952", name: "Rowzana", classId: "3A", gender: "P", scoreFormatif: 87, scoreSumatif: 85 },
    { id: "S3A10", nis: "3183594392", name: "Jabar Rahim La Kari", classId: "3A", gender: "L", scoreFormatif: 84, scoreSumatif: 86 },
    { id: "S3A11", nis: "3173473056", name: "Herawati Rauf", classId: "3A", gender: "P", scoreFormatif: 91, scoreSumatif: 93 },
    { id: "S3A12", nis: "3157180903", name: "Nur Inaya Sangadji", classId: "3A", gender: "P", scoreFormatif: 93, scoreSumatif: 95 },
    { id: "S3A13", nis: "3170421285", name: "Eniarti", classId: "3A", gender: "P", scoreFormatif: 85, scoreSumatif: 87 },
    { id: "S3A14", nis: "3189194080", name: "Muhamad Raden Dahlan", classId: "3A", gender: "P", scoreFormatif: 88, scoreSumatif: 89 },
    { id: "S3A15", nis: "3180543497", name: "Nurasifa Azzahra Rusman", classId: "3A", gender: "P", scoreFormatif: 90, scoreSumatif: 92 },
    { id: "S3A16", nis: "3186171311", name: "Fauzia Rafifa Ibrahim", classId: "3A", gender: "P", scoreFormatif: 94, scoreSumatif: 96 },
    { id: "S3A17", nis: "318550673", name: "Ayra Kalestina", classId: "3A", gender: "P", scoreFormatif: 87, scoreSumatif: 88 },
    { id: "S3A18", nis: "3186238565", name: "Faisal Adrin", classId: "3A", gender: "L", scoreFormatif: 83, scoreSumatif: 85 },
    { id: "S3A19", nis: "3A-019", name: "Leon S.", classId: "3A", gender: "L", scoreFormatif: 81, scoreSumatif: 83 },
    { id: "S3A20", nis: "3A-020", name: "Algifara", classId: "3A", gender: "L", scoreFormatif: 82, scoreSumatif: 84 },
    { id: "S3A21", nis: "3175736336", name: "Rahmat Ramadan Sarto", classId: "3A", gender: "L", scoreFormatif: 89, scoreSumatif: 90 },
    { id: "S3A22", nis: "3186832473", name: "Aditia Kamarudin", classId: "3A", gender: "L", scoreFormatif: 86, scoreSumatif: 88 }
  ],

  journals: [
    {
      id: "J01",
      date: "2025-08-01",
      time: "07.30 - 08.40",
      classId: "3A",
      topic: "Unit 1: Animals Around Us",
      notes: "22 Siswa Kelas 3A hadir lengkap dan sangat antusias.",
      attendance: "Hadir 22"
    }
  ],

  modules: [
    {
      id: "MOD-ENG-BOBONG-4",
      title: "Unit 1: What Are You Doing? (Present Continuous Tense)",
      grade: "Kelas 4 SD",
      phase: "Fase B",
      tp: "TP-01",
      atp: "ATP-01",
      duration: "4 JP (2 x Pertemuan)",
      target: "Peserta didik SD Negeri Bobong mampu merespons dan mengucapkan kalimat kegiatan yang sedang berlangsung secara lisan dan tertulis.",
      cp: "Menyimak - Berbicara: Peserta didik menggunakan bahasa Inggris sederhana untuk berinteraksi dalam situasi sosial di kelas seperti merespons instruksi dan menyapa.",
      materials: [
        "Flashcard Verbs (Reading, Writing, Eating, Drinking, Playing)",
        "Video lagu pendek Present Continuous",
        "Lembar Kerja Siswa (LKS) Matching Pairs"
      ],
      steps: [
        "Pendahuluan (10 Menit): Salam, berdoa, apersepsi menyanyikan lagu 'What Are You Doing?'",
        "Kegiatan Inti (50 Menit): Guru menunjukkan flashcards aksi, siswa menirukan gerakan dan mengucapkan 'He is running'. Siswa bermain roleplay berpasangan.",
        "Penutup (10 Menit): Refleksi pembelajaran, memberikan umpan balik dan tugas singkat."
      ],
      assessment: "Formatik (Observasi Unjuk Kerja Lisan & Lembar Jurnal Refleksi)"
    },
    {
      id: "MOD-ENG-BOBONG-1",
      title: "Unit 1: Hello! How Are You?",
      grade: "Kelas 1 SD",
      phase: "Fase A",
      tp: "TP-02",
      atp: "ATP-02",
      duration: "2 JP (1 x Pertemuan)",
      target: "Peserta didik dapat menyapa guru dan teman menggunakan ungkapan 'Hello', 'Good Morning', dan 'How are you?'.",
      cp: "Peserta didik dapat menyebutkan sapaan dasar dan merespons ungkapan sederhana.",
      materials: ["Boneka Tangan (Puppet)", "Flashcard Ekspresi Perasaan", "Audio Song 'Hello Hello'"],
      steps: [
        "Apersepsi: Guru menyapa dengan boneka tangan 'Hello Kids!'",
        "Inti: Menirukan sapaan, bernyanyi bersama, dan berkenalan antar siswa.",
        "Penutup: Kesimpulan dan tepuk tangan apresiasi."
      ],
      assessment: "Observasi sikap & kelancaran ucapan salam"
    },
    {
      id: "MOD-ENG-BOBONG-5",
      title: "Unit 2: Delicious Foods & Drinks",
      grade: "Kelas 5 SD",
      phase: "Fase C",
      tp: "TP-03",
      atp: "ATP-03",
      duration: "4 JP (2 x Pertemuan)",
      target: "Peserta didik dapat mengidentifikasi dan menyebutkan rasa makanan (sweet, salty, sour, bitter) dalam Bahasa Inggris.",
      cp: "Membaca - Memirsa & Menulis: Peserta didik memahami teks pendek sederhana mengenai makanan dan minuman kesukaan.",
      materials: ["Gambar Makanan & Rasa", "Menu Card Simulation", "LKS Kuis Kosakata"],
      steps: [
        "Apersepsi: Tanya jawab makanan favorit siswa.",
        "Inti: Diskusi kosakata rasa (tastes), membaca dialog restoran sederhana.",
        "Penutup: Games tebak rasa makanan."
      ],
      assessment: "Tes Tertulis Kuis & Roleplay Memesan Makanan"
    }
  ],

  flashcards: [
    { id: 1, word: "Reading", translate: "Membaca", category: "Action Verbs", icon: "ri-book-open-line", example: "She is reading a book." },
    { id: 2, word: "Writing", translate: "Menulis", category: "Action Verbs", icon: "ri-pencil-line", example: "He is writing a letter." },
    { id: 3, word: "Eating", translate: "Makan", category: "Action Verbs", icon: "ri-restaurant-line", example: "They are eating pizza." },
    { id: 4, word: "Drinking", translate: "Minum", category: "Action Verbs", icon: "ri-cup-line", example: "I am drinking juice." },
    { id: 5, word: "Sleeping", translate: "Tidur", category: "Action Verbs", icon: "ri-moon-line", example: "The baby is sleeping." },
    { id: 6, word: "Happy", translate: "Senang / Bahagia", category: "Feelings", icon: "ri-emotion-happy-line", example: "I feel happy today." },
    { id: 7, word: "Elephant", translate: "Gajah", category: "Animals", icon: "ri-bear-smile-line", example: "The elephant is big." },
    { id: 8, word: "Teacher", translate: "Guru", category: "Professions", icon: "ri-user-voice-line", example: "Welcome to SD Negeri Bobong!" }
  ],

  quizQuestions: [
    { id: 1, question: "What is the meaning of 'Reading'?", options: ["Membaca", "Menulis", "Makan", "Minum"], answer: "Membaca" },
    { id: 2, question: "Complete the sentence: 'She is ____ a pizza.'", options: ["sleeping", "eating", "writing", "running"], answer: "eating" },
    { id: 3, question: "What is 'Elephant' in Indonesian?", options: ["Kucing", "Gajah", "Kuda", "Jerapah"], answer: "Gajah" },
    { id: 4, question: "How do you say 'Selamat Pagi' in English?", options: ["Good Night", "Good Afternoon", "Good Morning", "Good Bye"], answer: "Good Morning" }
  ]
};

// Global Browser Window State Attachment
if (typeof window !== 'undefined') {
  (window as any).INITIAL_DATA = INITIAL_DATA;
}
