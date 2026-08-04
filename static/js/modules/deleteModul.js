import { appData, saveStorage } from '../helpers.js';
import { renderModulAjar } from './modulAjarView.js';
import { showToast } from './showToast.js';
export function deleteModul(id) {
    const modul = (appData.modules || []).find((m) => m.id === id);
    const title = modul ? modul.title : 'ini';
    if (!confirm(`Apakah Anda yakin ingin menghapus modul ajar: "${title}"?`)) {
        return;
    }
    appData.modules = (appData.modules || []).filter((m) => m.id !== id);
    saveStorage();
    renderModulAjar();
    showToast(`Modul ajar "${title}" berhasil dihapus.`, 'info');
}
