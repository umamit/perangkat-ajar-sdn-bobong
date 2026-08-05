import * as XLSX from 'xlsx';

export interface StudentAttendanceExcel {
  name: string;
  nis?: string;
  status?: string;
}

export interface ExportAbsensiExcelData {
  className: string;
  date: string;
  students: StudentAttendanceExcel[];
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
}

export function exportAbsensiExcel(data: ExportAbsensiExcelData): void {
  const summaryRows = [
    { No: '', NIS: '', 'Nama Siswa': '--- REKAPITULASI PRESENSI ---', Status: '' },
    { No: '', NIS: '', 'Nama Siswa': `Kelas: ${data.className}`, Status: `Tanggal: ${data.date}` },
    { No: '', NIS: '', 'Nama Siswa': `Hadir: ${data.hadir} | Izin: ${data.izin} | Sakit: ${data.sakit} | Alpa: ${data.alpa}`, Status: '' },
    { No: '', NIS: '', 'Nama Siswa': '', Status: '' }, // empty separator
  ];

  const studentRows = data.students.map((s, idx) => ({
    No: idx + 1,
    NIS: s.nis || '-',
    'Nama Siswa': s.name,
    Status: s.status || 'Belum Diisi',
  }));

  const worksheetData = [...summaryRows, ...studentRows];

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Column width configuration
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 16 }, // NIS
    { wch: 35 }, // Nama Siswa
    { wch: 18 }, // Status
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, `Absensi_${data.className}`);
  XLSX.writeFile(workbook, `Rekap_Absensi_Kelas${data.className}_${data.date}.xlsx`);
}
