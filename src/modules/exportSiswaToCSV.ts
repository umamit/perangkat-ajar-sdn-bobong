// Export Siswa to CSV
import { appData } from '../helpers';

export function exportSiswaToCSV(): void {
  let csv = 'No,Nama Siswa,Kelas,Jenis Kelamin,Nilai Formatif,Nilai Sumatif\n';
  appData.students.forEach((s, idx) => {
    csv += `${idx + 1},"${s.name}","${s.classId}","${s.gender}",${s.scoreFormatif ?? 0},${s.scoreSumatif ?? 0}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Data_Siswa_SDN_Bobong_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
