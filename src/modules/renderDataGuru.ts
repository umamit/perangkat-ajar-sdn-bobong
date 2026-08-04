import { appData } from '../helpers';

export function renderDataGuru() {
  const container = document.getElementById('guruListContainer');
  if (!container) return;

  const teachers = appData.teachers || [];
  if (teachers.length === 0) {
    container.innerHTML = `<tr><td colspan="6" className="text-center py-6 text-slate-400">Belum ada data guru</td></tr>`;
    return;
  }

  container.innerHTML = teachers.map((t, idx) => `
    <tr>
      <td><img src="${t.avatar || '/assets/logo-sdn-bobong.png'}" className="w-8 h-8 rounded-full" /></td>
      <td>${t.nip}</td>
      <td>${t.name}</td>
      <td>${t.role || 'Guru'}</td>
      <td>${t.subject || '-'}</td>
      <td><button onclick="deleteTeacher('${t.nip}')" className="text-rose-500">Hapus</button></td>
    </tr>
  `).join('');
}
