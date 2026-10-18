import { ExtracurricularRapor } from "@/types/erapor";

export const SUBJECT_TOPICS: Record<string, { high: string; guidance: string }> = {
  "Pendidikan Agama Islam": {
    high: "memahami nilai-nilai keimanan, akhlak mulia, dan praktik ibadah sehari-hari",
    guidance: "kelancaran melafalkan bacaan doa serta penerapan adab secara konsisten"
  },
  "Pendidikan Agama Kristen": {
    high: "memahami kasih Tuhan dalam keluarga, gereja, dan lingkungan sekitar",
    guidance: "penerapan nilai pelayanan dan refleksi iman dalam keseharian"
  },
  "Pendidikan Pancasila": {
    high: "mengamalkan nilai-nilai sila Pancasila serta mematuhi aturan di sekolah dan rumah",
    guidance: "pemahaman keberagaman identitas dan kerja sama dalam kegiatan kelompok"
  },
  "Bahasa Indonesia": {
    high: "menyimak, memahami isi teks bacaan, dan menyampaikan gagasan secara lisan maupun tulisan",
    guidance: "penggunaan kosakata baku dan penulisan kalimat efektif sesuai kaidah"
  },
  "Matematika": {
    high: "mengenal konsep bilangan, operasi hitung dasar, dan pemecahan masalah sederhana",
    guidance: "ketelitian dalam menyelesaikan soal cerita dan penalaran geometri ruang"
  },
  "IPAS": {
    high: "mengamati fenomena alam sekitar serta mengenali interaksi sosial di lingkungan",
    guidance: "keterampilan menyimpulkan hasil pengamatan percobaan sains sederhana"
  },
  "PJOK": {
    high: "mempraktikkan gerak dasar lokomotor, non-lokomotor, dan menjaga kebugaran jasmani",
    guidance: "koordinasi gerak manipulatif dan sportivitas dalam permainan beregu"
  },
  "Seni Budaya": {
    high: "mengekspresikan kreativitas melalui karya seni rupa dan apresiasi estetika",
    guidance: "kerapian teknik pewarnaan dan penyelesaian detail karya seni"
  },
  "Bahasa Inggris": {
    high: "merespons instruksi sederhana dan menyebutkan kosakata bahasa Inggris kontekstual",
    guidance: "pelafalan (pronunciation) dan keberanian berbicara dalam percakapan pendek"
  },
  "Muatan Lokal": {
    high: "mengenal kearifan budaya lokal Kabupaten Pulau Taliabu dan pelestarian lingkungan",
    guidance: "pemahaman istilah adat daerah dan keterampilan praktik budaya setempat"
  }
};

export const DEFAULT_EXTRACURRICULARS: ExtracurricularRapor[] = [
  {
    no: 1,
    name: "Pendidikan Kepramukaan",
    predicate: "Baik",
    description: "Aktif mengikuti kegiatan kepramukaan, menunjukkan sikap disiplin, mandiri, serta mampu bekerja sama dalam regu."
  },
  {
    no: 2,
    name: "Olahraga & Senam Bugar",
    predicate: "Baik",
    description: "Antusias mengikuti latihan olahraga dan menjunjung tinggi sportivitas bersama teman sebaya."
  }
];
