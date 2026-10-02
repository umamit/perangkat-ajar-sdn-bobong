import { SupervisionScores, SupervisionPredicate } from "@/types/supervision";

export const SUPERVISION_ASPECTS: { key: keyof SupervisionScores; title: string; desc: string }[] = [
  { key: "pendahuluan", title: "Apersepsi & Kesiapan Murid", desc: "Membangun suasana kondusif & mengaitkan materi" },
  { key: "tujuan", title: "Penyampaian Tujuan & Motivasi", desc: "Menjelaskan tujuan capaian & manfaat pembelajaran" },
  { key: "diferensiasi", title: "Pembelajaran Berdiferensiasi", desc: "Menyesuaikan proses/konten dengan kebutuhan siswa" },
  { key: "keaktifan", title: "Pelibatan Aktif Siswa", desc: "Pertanyaan pemantik & diskusi interaktif" },
  { key: "media", title: "Pemanfaatan Media & Perangkat Ajar", desc: "Penggunaan modul/media ajar kontekstual" },
  { key: "asesmen", title: "Asesmen Formatif", desc: "Mengecek pemahaman siswa selama proses belajar" },
  { key: "penutup", title: "Refleksi & Penguatan Kesimpulan", desc: "Menyimpulkan bersama & tindak lanjut" },
];

export function computeSupervisionScore(scores: SupervisionScores): {
  totalScore: number;
  percentage: number;
  predicate: SupervisionPredicate;
} {
  const values = Object.values(scores);
  const totalScore = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  const maxScore = values.length * 4;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let predicate: SupervisionPredicate = "Perlu Pembinaan";
  if (percentage >= 90) predicate = "Sangat Baik";
  else if (percentage >= 80) predicate = "Baik";
  else if (percentage >= 70) predicate = "Cukup";

  return { totalScore, percentage, predicate };
}
