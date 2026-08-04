// Export Nilai to CSV
import { appData } from '../helpers.js';
export function exportNilaiToCSV() {
    let csv = 'No,Nama Siswa,Kelas,Rata-rata Formatif,Nilai Sumatif,Nilai Akhir,Predikat\n';
    appData.students.forEach((s, idx) => {
        const formatif = s.scoreFormatif || 80;
        const sumatif = s.scoreSumatif || 80;
        const finalScore = Math.round((formatif * 0.4) + (sumatif * 0.6));
        const grade = finalScore >= 90 ? 'A (Sangat Baik)' : finalScore >= 80 ? 'B (Baik)' : 'C (Cukup)';
        csv += `${idx + 1},"${s.name}","${s.classId}",${formatif},${sumatif},${finalScore},"${grade}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Daftar_Nilai_SDN_Bobong_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
