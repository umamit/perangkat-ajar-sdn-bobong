import * as XLSX from 'xlsx';
import { Student } from '@/types';

export function exportSiswaExcel(students: Student[], className: string): void {
  const worksheetData = students.map((s, idx) => ({
    No: idx + 1,
    'NIS / NISN': s.nis || '-',
    'Nama Lengkap': s.name,
    'Jenis Kelamin': s.gender || 'L',
    Kelas: s.classId || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 18 }, // NIS
    { wch: 35 }, // Nama Lengkap
    { wch: 14 }, // JK
    { wch: 12 }, // Kelas
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
  XLSX.writeFile(workbook, `Data_Siswa_SDN_Bobong_${className}_${Date.now()}.xlsx`);
}
