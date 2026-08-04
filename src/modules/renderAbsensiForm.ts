import { appData } from '../helpers';

export const statusMap: Record<string, string> = {};

export function renderAbsensiForm(): void {
  const classId = (document.getElementById('absensiClassSelect') as HTMLSelectElement)?.value;
  const date = (document.getElementById('absensiDate') as HTMLInputElement)?.value;
  const tbody = document.getElementById('absensiInputTableBody');
  const card = document.getElementById('absensiInputCard');

  if (!classId || !date) {
    alert('Pilih kelas dan tanggal terlebih dahulu!');
    return;
  }

  const students = (appData.students || []).filter((s: any) => s.classId === classId);
  if (!tbody || !card) return;

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:16px; color:var(--text-muted);">Tidak ada data siswa di kelas ${classId}.</td></tr>`;
  } else {
    tbody.innerHTML = students.map((s: any, idx: number) => {
      const sId = s.id;
      if (!statusMap[sId]) statusMap[sId] = 'Hadir';

      return `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${s.name}</strong></td>
          <td>
            <div class="btn-group-status" data-student="${sId}">
              <button class="btn-status ${statusMap[sId] === 'Hadir' ? 'active-hadir' : ''}" onclick="setAbsensiStatus('${sId}', 'Hadir')">Hadir</button>
              <button class="btn-status ${statusMap[sId] === 'Izin' ? 'active-izin' : ''}" onclick="setAbsensiStatus('${sId}', 'Izin')">Izin</button>
              <button class="btn-status ${statusMap[sId] === 'Sakit' ? 'active-sakit' : ''}" onclick="setAbsensiStatus('${sId}', 'Sakit')">Sakit</button>
              <button class="btn-status ${statusMap[sId] === 'Alpa' ? 'active-alpa' : ''}" onclick="setAbsensiStatus('${sId}', 'Alpa')">Alpa</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth' });
}
