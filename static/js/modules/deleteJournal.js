import { appData, saveStorage, getSupabase } from '../helpers.js';
import { renderJurnal } from './renderJurnal.js';
import { showToast } from './showToast.js';
export async function deleteJournal(id) {
    const journal = (appData.journals || []).find((j) => j.id === id);
    const topic = journal ? journal.topic : 'ini';
    if (!confirm(`Apakah Anda yakin ingin menghapus jurnal mengajar: "${topic}"?`)) {
        return;
    }
    appData.journals = (appData.journals || []).filter((j) => j.id !== id);
    saveStorage();
    try {
        await fetch(`/api/journals?id=${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });
    }
    catch (err) {
        console.warn('[Flask Journal Delete Exception]', err);
    }
    renderJurnal();
    showToast(`Jurnal mengajar "${topic}" berhasil dihapus.`, 'info');
}
