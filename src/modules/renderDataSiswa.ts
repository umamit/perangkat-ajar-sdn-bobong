import { appData } from '../helpers';
import { getTeacherClasses } from './getTeacherClasses';

export function renderDataSiswa(filterClass?: string): void {
  const container = document.getElementById('siswaTableBody');
  if (!container) return;

  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  let activeFilter = filterClass;

  if (selectElem) {
    const availClasses = getTeacherClasses();
    const currentVal = activeFilter !== undefined ? activeFilter : selectElem.value;
    selectElem.innerHTML = `<option value="ALL">Semua Kelas</option>` +
      availClasses.map(c => `<option value="${c.id}" ${c.id === currentVal ? 'selected' : ''}>${c.name}</option>`).join('');
    activeFilter = selectElem.value;
  }

  if (activeFilter === undefined) activeFilter = 'ALL';

  let filtered = appData.students || [];
  if (activeFilter !== 'ALL') {
    filtered = filtered.filter(s => s.classId === activeFilter);
  }

  container.innerHTML = filtered.map((s, index) => {
    const hasNis = s.nis && s.nis.trim() !== '' && !s.nis.startsWith('AUTO-') && !s.nis.startsWith('ID-') && !s.nis.startsWith('SISWA-');
    const displayNis = hasNis ? s.nis : '<span style="color:#94a3b8; font-style:italic;">-</span>';
    return `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${displayNis}</strong></td>
      <td>${s.name}</td>
      <td><span class="badge badge-info">${s.classId}</span></td>
      <td>${s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
      <td>${s.scoreFormatif || 80}</td>
      <td>${s.scoreSumatif || 80}</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-secondary" onclick="showEditStudentModal('${s.nis || s.id}')" style="padding: 4px 8px; font-size:12px;">
            <i class="ri-edit-line"></i> Edit
          </button>
          <button class="btn btn-secondary" onclick="deleteStudent('${s.nis || s.id}')" style="padding: 4px 8px; font-size:12px; color:#dc2626; border-color:#fca5a5;" title="Hapus Siswa">
            <i class="ri-delete-bin-line"></i> Hapus
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}
