import { appData } from '../helpers.js';
import { getTeacherClasses } from './getTeacherClasses.js';
export function renderDataSiswa(filterClass) {
    const container = document.getElementById('siswaTableBody');
    if (!container)
        return;
    const selectElem = document.getElementById('siswaClassSelect');
    let activeFilter = filterClass;
    if (selectElem) {
        if (selectElem.options.length <= 1) {
            const availClasses = getTeacherClasses();
            selectElem.innerHTML = `<option value="ALL">Semua Kelas</option>` +
                availClasses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
        if (activeFilter !== undefined) {
            selectElem.value = activeFilter;
        }
        activeFilter = selectElem.value;
    }
    if (activeFilter === undefined)
        activeFilter = 'ALL';
    let filtered = appData.students || [];
    if (activeFilter !== 'ALL') {
        filtered = filtered.filter(s => s.classId === activeFilter);
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
