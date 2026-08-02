import { appData } from '../helpers';
import { getTeacherClasses } from './getTeacherClasses';

export function renderDataSiswa(filterClass: string = 'ALL'): void {
  const container = document.getElementById('siswaTableBody');
  if (!container) return;

  const selectElem = document.getElementById('filterClassSelect') as HTMLSelectElement | null;
  if (selectElem) {
    const availClasses = getTeacherClasses();
    const currentVal = selectElem.value;
    selectElem.innerHTML = `<option value="ALL">Semua Kelas</option>` + 
      availClasses.map(c => `<option value="${c.id}" ${c.id === currentVal ? 'selected' : ''}>${c.name}</option>`).join('');
  }

  let filtered = appData.students;
  if (filterClass !== 'ALL') {
    filtered = filtered.filter(s => s.classId === filterClass);
  } else {
    const availClasses = getTeacherClasses();
    const availIds = availClasses.map(c => c.id);
    filtered = filtered.filter(s => availIds.includes(s.classId));
  }

  container.innerHTML = filtered.map((s, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${s.nis}</strong></td>
      <td>${s.name}</td>
      <td><span class="badge badge-info">${s.classId}</span></td>
      <td>${s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
      <td>${s.scoreFormatif || 80}</td>
      <td>${s.scoreSumatif || 80}</td>
      <td>
        <button class="btn btn-secondary" onclick="alert('Edit Siswa: ${s.name}')" style="padding: 4px 8px; font-size:12px;">
          <i class="ri-edit-line"></i> Edit
        </button>
      </td>
    </tr>
  `).join('');
}
