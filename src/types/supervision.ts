export interface SupervisionScores {
  pendahuluan: number;
  tujuan: number;
  diferensiasi: number;
  keaktifan: number;
  media: number;
  asesmen: number;
  penutup: number;
}

export type SupervisionPredicate = "Sangat Baik" | "Baik" | "Cukup" | "Perlu Pembinaan";

export interface SupervisionItem {
  id: string;
  teacherNip: string;
  teacherName: string;
  classId: string;
  subject: string;
  date: string;
  timeSlot?: string;
  topic: string;
  scores: SupervisionScores;
  totalScore: number;
  percentage: number;
  predicate: SupervisionPredicate;
  notesGood: string;
  notesImprove: string;
  recommendations: string;
  createdAt?: string;
}

export const initialSupervisionScores: SupervisionScores = {
  pendahuluan: 4,
  tujuan: 4,
  diferensiasi: 3,
  keaktifan: 4,
  media: 3,
  asesmen: 3,
  penutup: 3,
};
