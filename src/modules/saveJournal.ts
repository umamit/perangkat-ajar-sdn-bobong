import { appData, saveStorage, saveJournalToSupabase } from '../helpers';
import { JournalEntry } from '../types';
import { closeModal } from './closeModal';
import { renderJurnal } from './renderJurnal';
import { renderDashboard } from './renderDashboard';

export function saveJournal(e: Event): void {
  e.preventDefault();
  const newJ: JournalEntry = {
    id: `J0${appData.journals.length + 1}`,
    date: (document.getElementById('jurnalDate') as HTMLInputElement).value,
    time: '07.30 - 08.40',
    classId: (document.getElementById('jurnalClass') as HTMLSelectElement).value,
    topic: (document.getElementById('jurnalTopic') as HTMLInputElement).value,
    notes: (document.getElementById('jurnalNotes') as HTMLInputElement).value || '-',
    attendance: 'Hadir Seluruh Siswa'
  };

  appData.journals.unshift(newJ);
  saveStorage();
  saveJournalToSupabase(newJ);
  renderJurnal();
  renderDashboard();
  closeModal();
}
