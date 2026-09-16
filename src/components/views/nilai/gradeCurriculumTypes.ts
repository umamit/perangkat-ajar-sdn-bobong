export interface FormatifLmScores {
  tp1?: number;
  tp2?: number;
  tp3?: number;
}

export interface StudentCurriculumGrade {
  studentId: string;
  name: string;
  nis: string;
  classId: string;
  // Formatif per LM
  f_lm1: FormatifLmScores;
  f_lm2: FormatifLmScores;
  f_lm3: FormatifLmScores;
  f_lm4: { tp1?: number; tp2?: number };
  f_lm5: FormatifLmScores;
  // Sumatif per LM
  s_lm1?: number;
  s_lm2?: number;
  s_lm3?: number;
  s_lm4?: number;
  s_lm5?: number;
  // Komponen Akhir
  rataRata?: number;
  uh?: number;
  sts?: number;
  sas?: number;
  nilaiAkhir?: number;
}

export type GradeFieldPath = 
  | 'f_lm1.tp1' | 'f_lm1.tp2' | 'f_lm1.tp3'
  | 'f_lm2.tp1' | 'f_lm2.tp2' | 'f_lm2.tp3'
  | 'f_lm3.tp1' | 'f_lm3.tp2' | 'f_lm3.tp3'
  | 'f_lm4.tp1' | 'f_lm4.tp2'
  | 'f_lm5.tp1' | 'f_lm5.tp2' | 'f_lm5.tp3'
  | 's_lm1' | 's_lm2' | 's_lm3' | 's_lm4' | 's_lm5'
  | 'uh' | 'sts' | 'sas';
