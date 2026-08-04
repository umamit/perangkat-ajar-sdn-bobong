import { appData } from '../helpers';

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
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-secondary" onclick="showEditJournalModal('${j.id}')" style="padding: 4px 8px; font-size:12px; color:var(--primary-dark); border-color:var(--primary);" title="Edit Jurnal">
            <i class="ri-edit-line"></i> Edit
          </button>
          <button class="btn btn-secondary" onclick="deleteJournal('${j.id}')" style="padding: 4px 8px; font-size:12px; color:#dc2626; border-color:#fca5a5;" title="Hapus Jurnal">
            <i class="ri-delete-bin-line"></i> Hapus
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}
