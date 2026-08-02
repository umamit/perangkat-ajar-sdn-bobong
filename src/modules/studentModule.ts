// Student & Class Management Module
import { appData, saveStorage, saveStudentToSupabase } from '../helpers';
import { getTeacherClasses } from './teacherModule';

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

export function searchStudent(query: string): void {
  filterSiswa(query);
}

export function filterSiswa(queryVal?: string): void {
  const query = (queryVal !== undefined ? queryVal : ((document.getElementById('searchSiswaInput') as HTMLInputElement)?.value || '')).toLowerCase().trim();
  const selectElem = document.getElementById('filterClassSelect') as HTMLSelectElement | null;
  const classFilter = selectElem ? selectElem.value : 'ALL';

  let filtered = appData.students || [];

  if (classFilter !== 'ALL') {
    filtered = filtered.filter(s => s.classId === classFilter);
  } else {
    const availClasses = getTeacherClasses();
    const availIds = availClasses.map(c => c.id);
    filtered = filtered.filter(s => availIds.includes(s.classId));
  }

  if (query) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(query) || (s.nis && s.nis.toLowerCase().includes(query)));
  }

  const container = document.getElementById('siswaTableBody');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">Tidak ada data siswa yang cocok dengan pencarian.</td></tr>`;
    return;
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

export function renderDataKelas(): void {
  const grid = document.getElementById('kelasGrid');
  if (!grid) return;
  const targetClasses = getTeacherClasses();
  grid.innerHTML = targetClasses.map(c => {
    delete c.count;
    const realStudentCount = appData.students.filter(s => s.classId === c.id).length;
    return `
      <div class="class-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="font-size:18px; font-weight:700;">${c.name}</h3>
          <span class="badge badge-info">${c.phase}</span>
        </div>
        <p style="margin:8px 0; font-size:13px; color:var(--text-muted);">Wali Kelas: <strong>${c.homeroom}</strong></p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
          <span style="font-size:12px; color:var(--text-muted);"><i class="ri-user-line"></i> ${realStudentCount} Siswa</span>
          <button class="btn btn-secondary" onclick="filterSiswaByClass('${c.id}')" style="padding:4px 8px; font-size:12px;">
            Lihat Kelas
          </button>
        </div>
      </div>
    `;
  }).join('');
}
