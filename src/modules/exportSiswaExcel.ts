import * as XLSX from 'xlsx';
import { Student } from '@/types';

export function exportSiswaExcel(students: Student[], className: string): void {
  const headers = [
    ['PEMERINTAH KABUPATEN PULAU TALIABU'],
    ['DINAS PENDIDIKAN - SD NEGERI BOBONG'],
    ['Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791'],
    [],
    [`DATA INDUK SISWA KELAS: ${className === 'ALL' ? 'SEMUA KELAS' : className}`],
    [`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`],
    [],
    ['No', 'NIS / NISN', 'Nama Lengkap', 'Jenis Kelamin', 'Kelas']
  ];

  const rows = students.map((s, idx) => [
    idx + 1,
    s.nis || '-',
    s.name,
    s.gender || 'L',
    s.classId || '-'
  ]);

  const worksheetData = [...headers, ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  worksheet['!cols'] = [
    { wch: 8 },  // No
    { wch: 20 }, // NIS / NISN
    { wch: 40 }, // Nama Lengkap
    { wch: 15 }, // Jenis Kelamin
    { wch: 12 }, // Kelas
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
  XLSX.writeFile(workbook, `Data_Siswa_SDN_Bobong_${className}_${Date.now()}.xlsx`);
}
