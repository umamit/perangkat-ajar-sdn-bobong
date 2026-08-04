import { appData, saveStorage, getSupabase } from '../helpers';
import { closeModal } from './closeModal';
import { renderJurnal } from './renderJurnal';
import { renderDashboard } from './renderDashboard';
import { showToast } from './showToast';

export async function saveEditJournal(e: Event, id: string): Promise<void> {
  e.preventDefault();
  const j = (appData.journals || []).find((item: any) => item.id === id);
  if (!j) return;
  j.date = (document.getElementById('editJurnalDate') as HTMLInputElement).value;
  j.classId = (document.getElementById('editJurnalClass') as HTMLSelectElement).value;
  j.topic = (document.getElementById('editJurnalTopic') as HTMLInputElement).value.trim();
  j.notes = (document.getElementById('editJurnalNotes') as HTMLInputElement).value.trim() || '-';
  saveStorage();
  const client = getSupabase();
  if (client) {
    try { await client.from('journals').update({ date: j.date, class_id: j.classId, topic: j.topic, notes: j.notes }).eq('id', id); }
    catch (err) { console.warn('[Supabase Journal Update Exception]', err); }
  }
  renderJurnal(); renderDashboard(); closeModal();
  showToast('Jurnal mengajar berhasil diperbarui!', 'success');
}
