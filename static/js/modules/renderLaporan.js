import { appData } from '../helpers.js';
export function renderLaporan() {
    const total = appData.students.length || 1;
    const avgFormatif = Math.round(appData.students.reduce((acc, curr) => acc + (curr.scoreFormatif || 80), 0) / total);
    const avgSumatif = Math.round(appData.students.reduce((acc, curr) => acc + (curr.scoreSumatif || 80), 0) / total);
    if (document.getElementById('laporanAvgFormatif'))
        document.getElementById('laporanAvgFormatif').innerText = String(avgFormatif);
    if (document.getElementById('laporanAvgSumatif'))
        document.getElementById('laporanAvgSumatif').innerText = String(avgSumatif);
}
