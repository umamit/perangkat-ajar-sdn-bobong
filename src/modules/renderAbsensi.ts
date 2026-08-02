import { appData } from '../helpers';

export function renderAbsensi(): void {
  const tbody = document.getElementById('absensiTableBody');
  if (!tbody) return;
  tbody.innerHTML = (appData.attendance || []).map((a: any) => `
    <tr>
      <td><strong>${a.date}</strong></td>
      <td><span class="badge badge-info">${a.classId}</span></td>
      <td><span class="badge badge-success">${a.hadir} Siswa</span></td>
      <td><span class="badge badge-warning">${a.izin} Siswa</span></td>
      <td><span class="badge badge-warning">${a.sakit} Siswa</span></td>
      <td><span class="badge badge-danger">${a.alpa} Siswa</span></td>
      <td>
        <button class="btn btn-secondary" onclick="alert('Edit Absensi')" style="padding: 4px 8px; font-size:12px;">
          <i class="ri-edit-line"></i> Edit
        </button>
      </td>
    </tr>
  `).join('');
}
