import { appData, saveStorage } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderModulAjar } from './modulAjarView.js';
export function saveModul(e) {
    e.preventDefault();
    const title = document.getElementById('modulTitle').value.trim();
    const grade = document.getElementById('modulGrade').value;
    const duration = document.getElementById('modulDuration').value.trim();
    const target = document.getElementById('modulTarget').value.trim();
    const cp = document.getElementById('modulCP').value.trim();
    const newModul = {
        id: `MOD-0${(appData.modules || []).length + 1}`,
        title,
        grade,
        phase: 'Fase A',
        duration,
        target,
        tp: target,
        atp: target,
        cp,
        materials: ['Buku Teks', 'PPT'],
        steps: ['Kegiatan Pembuka (10 menit)', 'Kegiatan Inti (50 menit)', 'Penutup (10 menit)'],
        assessment: 'Formatif & Sumatif'
    };
    appData.modules.unshift(newModul);
    saveStorage();
    renderModulAjar();
    closeModal();
    alert(`✅ Modul Ajar "${title}" berhasil ditambahkan!`);
}
