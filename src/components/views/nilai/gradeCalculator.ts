import { StudentCurriculumGrade, FormatifLmScores } from './gradeCurriculumTypes';

export function calculateLmAverage(scores?: FormatifLmScores | { tp1?: number; tp2?: number }): number {
  if (!scores) return 0;
  const vals: number[] = [];
  if (typeof scores.tp1 === 'number' && scores.tp1 > 0) vals.push(scores.tp1);
  if (typeof scores.tp2 === 'number' && scores.tp2 > 0) vals.push(scores.tp2);
  if ('tp3' in scores && typeof scores.tp3 === 'number' && scores.tp3 > 0) vals.push(scores.tp3);
  if (vals.length === 0) return 0;
  return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
}

export function computeCompleteGrade(row: StudentCurriculumGrade): StudentCurriculumGrade {
  const s_lm1 = row.s_lm1 ?? calculateLmAverage(row.f_lm1);
  const s_lm2 = row.s_lm2 ?? calculateLmAverage(row.f_lm2);
  const s_lm3 = row.s_lm3 ?? calculateLmAverage(row.f_lm3);
  const s_lm4 = row.s_lm4 ?? calculateLmAverage(row.f_lm4);
  const s_lm5 = row.s_lm5 ?? calculateLmAverage(row.f_lm5);

  const activeSums = [s_lm1, s_lm2, s_lm3, s_lm4, s_lm5].filter(v => typeof v === 'number' && v > 0);
  const rataRata = activeSums.length > 0 
    ? Number((activeSums.reduce((a, b) => a + b, 0) / activeSums.length).toFixed(2))
    : 0;

  const uh = row.uh ?? rataRata;
  const sts = row.sts || 0;
  const sas = row.sas || 0;

  // Formula Nilai Akhir: UH/Sumatif (40%), STS (30%), SAS (30%)
  const komponenAktif: { bobot: number; nilai: number }[] = [];
  if (uh > 0) komponenAktif.push({ bobot: 0.4, nilai: uh });
  if (sts > 0) komponenAktif.push({ bobot: 0.3, nilai: sts });
  if (sas > 0) komponenAktif.push({ bobot: 0.3, nilai: sas });

  let nilaiAkhir = 0;
  if (komponenAktif.length > 0) {
    const totalBobot = komponenAktif.reduce((acc, k) => acc + k.bobot, 0);
    const sumNilai = komponenAktif.reduce((acc, k) => acc + (k.nilai * k.bobot), 0);
    nilaiAkhir = Math.round(sumNilai / totalBobot);
  }

  return {
    ...row,
    s_lm1,
    s_lm2,
    s_lm3,
    s_lm4,
    s_lm5,
    rataRata,
    uh,
    nilaiAkhir,
  };
}
