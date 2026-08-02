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
    </tr>
  `).join('');
}
