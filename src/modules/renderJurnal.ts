import { appData, saveStorage, saveJournalToSupabase } from '../helpers';
import { JournalEntry } from '../types';
import { openModal, closeModal } from './openModal';
import { renderDashboard } from './renderDashboard';

export function renderJurnal(): void {
  const tbody = document.getElementById('jurnalTableBody');
  if (!tbody) return;
  tbody.innerHTML = appData.journals.map(j => `
    <tr>
      <td>${j.date}</td>
      <td><span class="badge badge-info">${j.classId}</span></td>
      <td><strong>${j.topic}</strong></td>
      <td>${j.notes}</td>
      <td><em>${j.attendance || '-'}</em></td>
      <td><span class="badge badge-success">Selesai</span></td>
    </tr>
  `).join('');
}

export function showAddJournalModal(): void {
  const form = `
    <form onsubmit="saveJournal(event)">
      <div class="form-group">
        <label>Tanggal Mengajar</label>
        <input type="date" id="jurnalDate" required value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label>Kelas</label>
        <select id="jurnalClass">
          ${appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Materi / Topik Pembelajaran</label>
        <input type="text" id="jurnalTopic" placeholder="Contoh: Unit 2 - Family Members" required>
      </div>
      <div class="form-group">
        <label>Kegiatan Pembelajaran</label>
        <textarea id="jurnalActivity" rows="3" placeholder="Deskripsikan aktivitas belajar siswa..." required></textarea>
      </div>
      <div class="form-group">
        <label>Catatan / Refleksi Guru</label>
        <textarea id="jurnalNotes" rows="2" placeholder="Catatan perkembangan atau kendala..."></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Simpan Jurnal</button>
    </form>
  `;
  openModal('Tambah Jurnal Mengajar Harian', form);
}

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
