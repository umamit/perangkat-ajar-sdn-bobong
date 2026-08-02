import { appData } from '../helpers';
import { INITIAL_DATA } from '../data';

export function renderDataGuru(): void {
  const tbody = document.getElementById('teacherTableBody');
  if (!tbody) return;

  const teachers = (appData.teachers && appData.teachers.length > 0) ? appData.teachers : [...(INITIAL_DATA as any).teachers];
  tbody.innerHTML = teachers.map((t: any) => `
    <tr>
      <td><strong>${t.nip}</strong></td>
      <td>${t.name}</td>
      <td>${t.subject || 'Guru Mata Pelajaran'}</td>
      <td><span class="badge badge-info">${t.role || 'Guru'}</span></td>
      <td><span class="badge badge-success">Aktif</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="deleteTeacher('${t.nip}')" style="padding:4px 8px; font-size:12px; color:#dc2626;" title="Hapus Guru">
          <i class="ri-delete-bin-line"></i> Hapus
        </button>
      </td>
    </tr>
  `).join('');
}
