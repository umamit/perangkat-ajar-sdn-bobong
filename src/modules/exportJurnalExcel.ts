import * as XLSX from 'xlsx';
import { JournalItem } from './generateJurnalPDF';

export function exportJurnalExcel(journals: JournalItem[]): void {
  const worksheetData = journals.map((j, idx) => ({
    No: idx + 1,
    Tanggal: j.date,
    Jam: j.time || '-',
    Kelas: j.classId,
    'Materi / Topik Pembelajaran': j.topic,
    Kehadiran: j.attendance || '-',
    Catatan: j.notes || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 14 }, // Tanggal
    { wch: 10 }, // Jam
    { wch: 10 }, // Kelas
    { wch: 45 }, // Materi/Topik
    { wch: 20 }, // Kehadiran
    { wch: 30 }, // Catatan
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Jurnal Mengajar');
  XLSX.writeFile(workbook, `Jurnal_Mengajar_SDN_Bobong_${Date.now()}.xlsx`);
}
