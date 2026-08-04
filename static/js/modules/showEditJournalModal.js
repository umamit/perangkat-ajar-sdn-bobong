import { openModal } from './openModal.js';
import { appData } from '../helpers.js';
import { showToast } from './showToast.js';

export function showEditJournalModal(id) {
  const journal = (appData.journals || []).find((j) => j.id === id);
  if (!journal) { showToast('Jurnal tidak ditemukan', 'error'); return; }
  const classOpts = (appData.classes || []).map((c) =>
    `<option value="${c.id}" ${c.id === journal.classId ? 'selected' : ''}>${c.name}</option>`
  ).join('');
  const form = `
    <form onsubmit="saveEditJournal(event, '${journal.id}')">
      <div class="form-group"><label>Tanggal</label><input type="date" id="editJurnalDate" value="${journal.date}" required></div>
      <div class="form-group"><label>Kelas</label><select id="editJurnalClass" required>${classOpts}</select></div>
      <div class="form-group"><label>Materi / Topik Pembelajaran</label><input type="text" id="editJurnalTopic" value="${journal.topic}" required></div>
      <div class="form-group"><label>Catatan Pembelajaran</label><input type="text" id="editJurnalNotes" value="${journal.notes || ''}"></div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;"><i class="ri-save-line"></i> Simpan Perubahan Jurnal</button>
    </form>`;
  openModal('Edit Jurnal Mengajar', form);
}
