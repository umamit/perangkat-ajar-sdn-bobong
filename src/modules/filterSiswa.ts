import { appData } from '../helpers';
import { getTeacherClasses } from './getTeacherClasses';

export function filterSiswa(queryVal?: string): void {
  const query = (queryVal !== undefined
    ? queryVal
    : ((document.getElementById('searchSiswaInput') as HTMLInputElement)?.value || '')
  ).toLowerCase().trim();

  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  const classFilter = selectElem ? selectElem.value : 'ALL';

  let filtered = appData.students || [];

  if (classFilter !== 'ALL') {
    filtered = filtered.filter(s => s.classId === classFilter);
  }

  if (query) {
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(query) ||
      (s.nis && s.nis.toLowerCase().includes(query))
    );
  }

  const container = document.getElementById('siswaTableBody');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">Tidak ada data siswa yang cocok dengan pencarian.</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map((s, index) => {
    return `
    <tr>
      <td>${index + 1}</td>
      <td>${s.name}</td>
      <td><span class="badge badge-info">${s.classId}</span></td>
      <td>${s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
      <td>${s.scoreFormatif || 80}</td>
      <td>${s.scoreSumatif || 80}</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-secondary" onclick="showEditStudentModal('${s.id}')" style="padding: 4px 8px; font-size:12px;">
            <i class="ri-edit-line"></i> Edit
          </button>
          <button class="btn btn-secondary" onclick="deleteStudent('${s.id}')" style="padding: 4px 8px; font-size:12px; color:#dc2626; border-color:#fca5a5;" title="Hapus Siswa">
            <i class="ri-delete-bin-line"></i> Hapus
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}
