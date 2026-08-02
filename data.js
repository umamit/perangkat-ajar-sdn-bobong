// Data Seed Perangkat Ajar Bahasa Inggris SD Negeri Bobong (Kurikulum Merdeka)

const INITIAL_DATA = {
  teacher: {
    name: "Husnita Usman, M.Pd.",
    role: "Guru Mata Pelajaran",
    school: "SD Negeri Bobong",
    kecamatan: "Kecamatan Taliabu Barat",
    nip: "199610272019032006",
    password: "kepseksdnbobong",
    semester: "Ganjil 2025/2026",
    avatar: "assets/logo-sdn-bobong.png"
  },

  teachers: [
    { nip: "199610272019032006", name: "Husnita Usman, M.Pd.", role: "Guru Mata Pelajaran", subject: "Bahasa Inggris", password: "kepseksdnbobong", avatar: "assets/logo-sdn-bobong.png" },
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
    { id: "1A", name: "Kelas 1 - A", count: 24, room: "Ruang 01", phase: "Fase A" },
    { id: "2A", name: "Kelas 2 - A", count: 22, room: "Ruang 02", phase: "Fase A" },
    { id: "3A", name: "Kelas 3 - A", count: 25, room: "Ruang 03", phase: "Fase B" },
    { id: "4A", name: "Kelas 4 - A", count: 26, room: "Ruang 04", phase: "Fase B" },
    { id: "5A", name: "Kelas 5 - A", count: 28, room: "Ruang 05", phase: "Fase C" },
    { id: "6A", name: "Kelas 6 - A", count: 25, room: "Ruang 06", phase: "Fase C" }
  ],

  students: [
    { id: "S001", nis: "1001", name: "Ahmad Fauzi", classId: "4A", gender: "L", scoreFormatif: 85, scoreSumatif: 88 },
    { id: "S002", nis: "1002", name: "Anisa Rahma", classId: "4A", gender: "P", scoreFormatif: 90, scoreSumatif: 92 },
    { id: "S003", nis: "1003", name: "Bagus Pratama", classId: "4A", gender: "L", scoreFormatif: 78, scoreSumatif: 80 },
    { id: "S004", nis: "1004", name: "Citra Dewi", classId: "4A", gender: "P", scoreFormatif: 95, scoreSumatif: 96 },
    { id: "S005", nis: "1005", name: "Dion Prasetyo", classId: "4A", gender: "L", scoreFormatif: 82, scoreSumatif: 84 },
    { id: "S006", nis: "1006", name: "Eka Fitriani", classId: "4A", gender: "P", scoreFormatif: 88, scoreSumatif: 85 },
    { id: "S007", nis: "1007", name: "Fajar Hidayat", classId: "1A", gender: "L", scoreFormatif: 80, scoreSumatif: 83 },
    { id: "S008", nis: "1008", name: "Gita Gutawa", classId: "1A", gender: "P", scoreFormatif: 92, scoreSumatif: 90 },
    { id: "S009", nis: "1009", name: "Hafiz Maulana", classId: "5A", gender: "L", scoreFormatif: 87, scoreSumatif: 89 },
    { id: "S010", nis: "1010", name: "Indah Permata", classId: "5A", gender: "P", scoreFormatif: 94, scoreSumatif: 95 }
  ],

  attendance: [
    { date: "2025-08-01", classId: "4A", hadir: 24, izin: 1, sakit: 1, alpa: 0 },
    { date: "2025-08-02", classId: "1A", hadir: 23, izin: 0, sakit: 1, alpa: 0 },
    { date: "2025-08-02", classId: "5A", hadir: 27, izin: 1, sakit: 0, alpa: 0 }
  ],

  journals: [
    {
      id: "J01",
      date: "2025-08-01",
      classId: "4A",
      topic: "Unit 1: What Are You Doing?",
      activity: "Siswa berlatih percakapan Present Continuous Tense menggunakan gambar aksi kegiatan sehari-hari di SDN Bobong.",
      notes: "Siswa antusias mengucapkan 'I am reading' dan 'She is writing'.",
      status: "Selesai"
    },
    {
      id: "J02",
      date: "2025-08-02",
      classId: "1A",
      topic: "Unit 1: How are you?",
      activity: "Menyanyikan lagu 'Hello, How Are You?' dan bermain peran menyapa teman sekelas.",
      notes: "Siswa sangat aktif mengikuti gerak lagu.",
      status: "Selesai"
    }
  ],

  modules: [
    {
      id: "MOD-ENG-BOBONG-4",
      title: "Unit 1: What Are You Doing? (Present Continuous Tense)",
      grade: "Kelas 4 SD",
      phase: "Fase B",
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
    { word: "Reading", translate: "Membaca", category: "Action Verbs", icon: "ri-book-open-line", example: "She is reading a book." },
    { word: "Writing", translate: "Menulis", category: "Action Verbs", icon: "ri-pencil-line", example: "He is writing a letter." },
    { word: "Eating", translate: "Makan", category: "Action Verbs", icon: "ri-restaurant-line", example: "They are eating pizza." },
    { word: "Drinking", translate: "Minum", category: "Action Verbs", icon: "ri-cup-line", example: "I am drinking juice." },
    { word: "Sleeping", translate: "Tidur", category: "Action Verbs", icon: "ri-moon-line", example: "The baby is sleeping." },
    { word: "Happy", translate: "Senang / Bahagia", category: "Feelings", icon: "ri-emotion-happy-line", example: "I feel happy today." },
    { word: "Elephant", translate: "Gajah", category: "Animals", icon: "ri-bear-smile-line", example: "The elephant is big." },
    { word: "Teacher", translate: "Guru", category: "Professions", icon: "ri-user-voice-line", example: "Welcome to SD Negeri Bobong!" }
  ],

  quizQuestions: [
    { question: "What is the meaning of 'Reading'?", options: ["Membaca", "Menulis", "Makan", "Minum"], answer: "Membaca" },
    { question: "Complete the sentence: 'She is ____ a pizza.'", options: ["sleeping", "eating", "writing", "running"], answer: "eating" },
    { question: "What is 'Elephant' in Indonesian?", options: ["Kucing", "Gajah", "Kuda", "Jerapah"], answer: "Gajah" },
    { question: "How do you say 'Selamat Pagi' in English?", options: ["Good Night", "Good Afternoon", "Good Morning", "Good Bye"], answer: "Good Morning" }
  ],

  assignments: [
    {
      id: "TUG-01",
      title: "Kuis Kosakata Action Verbs",
      classId: "4A",
      dueDate: "2025-08-10",
      type: "Formatik",
      status: "Aktif",
      instructions: "Jodohkan gambar aksi dengan kata bahasa Inggris yang tepat di lembar kerja."
    },
    {
      id: "TUG-02",
      title: "Penilaian Sumatif Bab 1 (Greetings & Feelings)",
      classId: "1A",
      dueDate: "2025-08-15",
      type: "Sumatif",
      status: "Draft",
      instructions: "Praktik percakapan lisan 2 orang di depan kelas."
    }
  ]
};
