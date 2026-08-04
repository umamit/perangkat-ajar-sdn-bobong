import { appData, saveStorage, getSupabase } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderJurnal } from './renderJurnal';
import { renderDashboard } from './renderDashboard.js';
import { showToast } from './showToast.js';

export async function saveEditJournal(e, id) {
  e.preventDefault();
  const j = (appData.journals || []).find((item) => item.id === id);
  if (!j) return;
  j.date = document.getElementById('editJurnalDate').value;
  j.classId = document.getElementById('editJurnalClass').value;
  j.topic = document.getElementById('editJurnalTopic').value.trim();
  j.notes = document.getElementById('editJurnalNotes').value.trim() || '-';
  saveStorage();
  const client = getSupabase();
  if (client) {
    try { await client.from('journals').update({ date: j.date, class_id: j.classId, topic: j.topic, notes: j.notes }).eq('id', id); }
    catch (err) { console.warn('[Supabase Journal Update Exception]', err); }
  }
  renderJurnal(); renderDashboard(); closeModal();
  showToast('Jurnal mengajar berhasil diperbarui!', 'success');
}
