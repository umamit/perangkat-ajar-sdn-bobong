import * as XLSX from 'xlsx';
import { Student } from '@/types';

export function exportNilaiExcel(students: Student[], className: string): void {
  const worksheetData = students.map((s, idx) => {
    const formatif = s.scoreFormatif || 0;
    const sts = (s as any).scoreSts || s.scoreSumatif || 0;
    const sas = (s as any).scoreSas || s.scoreSumatif || 0;
    const finalGrade = Math.round((formatif * 0.4) + (sts * 0.3) + (sas * 0.3));
    const isTuntas = finalGrade >= 75;

    return {
      No: idx + 1,
      NIS: s.nis || '-',
      'Nama Siswa': s.name,
      Kelas: s.classId || '-',
      'Formatif (40%)': formatif,
      'STS (30%)': sts,
      'SAS (30%)': sas,
      'Nilai Akhir Rapor': finalGrade,
      Ketuntasan: isTuntas ? 'Tuntas' : 'Perlu Bimbingan',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 16 }, // NIS
    { wch: 32 }, // Nama Siswa
    { wch: 10 }, // Kelas
    { wch: 15 }, // Formatif
    { wch: 12 }, // STS
    { wch: 12 }, // SAS
    { wch: 18 }, // Nilai Akhir
    { wch: 18 }, // Ketuntasan
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Nilai');
  XLSX.writeFile(workbook, `Daftar_Nilai_SDN_Bobong_${className}_${Date.now()}.xlsx`);
}
