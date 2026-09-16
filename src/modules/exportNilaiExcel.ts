import * as XLSX from 'xlsx';
import { Student } from '@/types';
import { StudentCurriculumGrade } from '@/components/views/nilai/gradeCurriculumTypes';

export function exportNilaiExcel(students: Student[], className: string, gradesData?: StudentCurriculumGrade[]): void {
  // Susun Multi-Level Header
  const headerRow1 = [
    'No', 'Nama Siswa',
    'Penilaian Formatif', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'Sumatif', '', '', '', '',
    'Rata-Rata', 'UH', 'STS', 'SAS', 'Nilai Akhir'
  ];

  const headerRow2 = [
    '', '',
    'L. Materi 1', '', '',
    'L. Materi 2', '', '',
    'L. Materi 3', '', '',
    'L. Materi 4', '',
    'L. Materi 5', '', '',
    'LM 1', 'LM 2', 'LM 3', 'LM 4', 'LM 5',
    '', '', '', '', ''
  ];

  const headerRow3 = [
    '', '',
    'TP1', 'TP2', 'TP3',
    'TP1', 'TP2', 'TP3',
    'TP1', 'TP2', 'TP3',
    'TP1', 'TP2',
    'TP1', 'TP2', 'TP3',
    '', '', '', '', '',
    '', '', '', '', ''
  ];

  const rows = (gradesData || []).map((row, idx) => [
    idx + 1,
    row.name,
    row.f_lm1?.tp1 ?? '', row.f_lm1?.tp2 ?? '', row.f_lm1?.tp3 ?? '',
    row.f_lm2?.tp1 ?? '', row.f_lm2?.tp2 ?? '', row.f_lm2?.tp3 ?? '',
    row.f_lm3?.tp1 ?? '', row.f_lm3?.tp2 ?? '', row.f_lm3?.tp3 ?? '',
    row.f_lm4?.tp1 ?? '', row.f_lm4?.tp2 ?? '',
    row.f_lm5?.tp1 ?? '', row.f_lm5?.tp2 ?? '', row.f_lm5?.tp3 ?? '',
    row.s_lm1 ?? '', row.s_lm2 ?? '', row.s_lm3 ?? '', row.s_lm4 ?? '', row.s_lm5 ?? '',
    row.rataRata ?? '', row.uh ?? '', row.sts ?? '', row.sas ?? '', row.nilaiAkhir ?? ''
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, headerRow3, ...rows]);

  // Merge Header Cells
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } }, // No
    { s: { r: 0, c: 1 }, e: { r: 2, c: 1 } }, // Nama Siswa
    { s: { r: 0, c: 2 }, e: { r: 0, c: 15 } }, // Penilaian Formatif
    { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } }, // LM1
    { s: { r: 1, c: 5 }, e: { r: 1, c: 7 } }, // LM2
    { s: { r: 1, c: 8 }, e: { r: 1, c: 10 } }, // LM3
    { s: { r: 1, c: 11 }, e: { r: 1, c: 12 } }, // LM4
    { s: { r: 1, c: 13 }, e: { r: 1, c: 15 } }, // LM5
    { s: { r: 0, c: 16 }, e: { r: 0, c: 20 } }, // Sumatif
    { s: { r: 0, c: 21 }, e: { r: 2, c: 21 } }, // Rata-Rata
    { s: { r: 0, c: 22 }, e: { r: 2, c: 22 } }, // UH
    { s: { r: 0, c: 23 }, e: { r: 2, c: 23 } }, // STS
    { s: { r: 0, c: 24 }, e: { r: 2, c: 24 } }, // SAS
    { s: { r: 0, c: 25 }, e: { r: 2, c: 25 } }, // Nilai Akhir
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Nilai');
  XLSX.writeFile(workbook, `Daftar_Nilai_Kurikulum_Merdeka_${className}_${Date.now()}.xlsx`);
}
