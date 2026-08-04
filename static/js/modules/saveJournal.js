import { appData, saveStorage, saveJournalToSupabase } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderJurnal } from './renderJurnal.js';
import { renderDashboard } from './renderDashboard.js';
export function saveJournal(e) {
    e.preventDefault();
    const newJ = {
        id: `J0${appData.journals.length + 1}`,
        date: document.getElementById('jurnalDate').value,
        time: '07.30 - 08.40',
        classId: document.getElementById('jurnalClass').value,
        topic: document.getElementById('jurnalTopic').value,
        notes: document.getElementById('jurnalNotes').value || '-',
        attendance: 'Hadir Seluruh Siswa'
    };
    appData.journals.unshift(newJ);
    saveStorage();
    saveJournalToSupabase(newJ);
    renderJurnal();
    renderDashboard();
    closeModal();
}
