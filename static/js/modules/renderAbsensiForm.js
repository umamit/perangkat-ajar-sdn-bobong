import { showToast } from './showToast.js';
import { appData } from '../helpers.js';
import { statusMap } from './statusMap.js';

export function renderAbsensiForm() {
  const classId = document.getElementById('absensiClassSelect')?.value;
  const date = document.getElementById('absensiDate')?.value;
  const tbody = document.getElementById('absensiInputBody');
  const card = document.getElementById('absensiFormContainer');
  const placeholder = document.getElementById('absensiFormPlaceholder');

  if (!classId || !date) {
    showToast('Pilih kelas dan tanggal terlebih dahulu!', 'info');
    return;
  }

  const students = (appData.students || []).filter((s) => s.classId === classId);
  if (!tbody || !card) return;

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:var(--text-muted);">Tidak ada data siswa di kelas ${classId}.</td></tr>`;
  } else {
    tbody.innerHTML = students.map((s, idx) => {
      const sId = s.id;
      if (!statusMap[sId]) statusMap[sId] = 'Hadir';
      const cur = statusMap[sId];
      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><strong>${s.name}</strong></td>
          <td style="text-align:center;">
            <button class="btn-status ${cur === 'Hadir' ? 'active-hadir' : ''}" onclick="setAbsensiStatus('${sId}', 'Hadir')">Hadir</button>
          </td>
          <td style="text-align:center;">
            <button class="btn-status ${cur === 'Izin' ? 'active-izin' : ''}" onclick="setAbsensiStatus('${sId}', 'Izin')">Izin</button>
          </td>
          <td style="text-align:center;">
            <button class="btn-status ${cur === 'Sakit' ? 'active-sakit' : ''}" onclick="setAbsensiStatus('${sId}', 'Sakit')">Sakit</button>
          </td>
          <td style="text-align:center;">
            <button class="btn-status ${cur === 'Alpa' ? 'active-alpa' : ''}" onclick="setAbsensiStatus('${sId}', 'Alpa')">Alpa</button>
          </td>
        </tr>`;
    }).join('');
  }

  card.style.display = 'block';
  if (placeholder) placeholder.style.display = 'none';
  card.scrollIntoView({ behavior: 'smooth' });
}
