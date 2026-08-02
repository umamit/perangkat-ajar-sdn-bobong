import { appData } from '../helpers';
import { getTeacherClasses } from './getTeacherClasses';

export function renderDaftarNilai(filterClass: string = 'ALL'): void {
  const container = document.getElementById('nilaiTableBody');
  if (!container) return;

  const selectElem = document.getElementById('nilaiClassSelect') as HTMLSelectElement | null;
  if (selectElem && selectElem.children.length === 1) {
    const teacherClasses = getTeacherClasses();
    selectElem.innerHTML = '<option value="ALL">Semua Kelas Terampu</option>' +
      teacherClasses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    selectElem.value = filterClass;
  }

  let filtered = appData.students || [];
  if (filterClass !== 'ALL') {
    filtered = filtered.filter((s: any) => s.classId === filterClass);
  } else {
    const availIds = getTeacherClasses().map(c => c.id);
    filtered = filtered.filter((s: any) => availIds.includes(s.classId));
  }

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:16px; color:var(--text-muted);">Tidak ada data siswa untuk kelas yang dipilih.</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map((s: any, idx: number) => {
    const sId = s.nis || s.id;
    const formatif = s.scoreFormatif ?? 80;
    const sts = s.scoreSts ?? 80;
    const sas = s.scoreSas ?? 80;
    const akhir = Math.round((formatif * 0.4) + (sts * 0.3) + (sas * 0.3));
    const predikat = akhir >= 85 ? 'A' : akhir >= 75 ? 'B' : akhir >= 65 ? 'C' : 'D';
    const badgeCls = predikat === 'A' ? 'badge-success' : predikat === 'B' ? 'badge-info' : predikat === 'C' ? 'badge-warning' : 'badge-danger';

    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${s.name}</strong></td>
        <td><span class="badge badge-info">${s.classId}</span></td>
        <td>
          <div class="grade-input-group">
            <button class="btn-grade-step" onclick="adjustGrade('${sId}', 'formatif', -5)">-</button>
            <input type="number" class="grade-input" value="${formatif}" min="0" max="100" onchange="updateStudentGrade('${sId}', 'formatif', this.value)">
            <button class="btn-grade-step" onclick="adjustGrade('${sId}', 'formatif', 5)">+</button>
          </div>
        </td>
        <td>
          <div class="grade-input-group">
            <button class="btn-grade-step" onclick="adjustGrade('${sId}', 'sts', -5)">-</button>
            <input type="number" class="grade-input" value="${sts}" min="0" max="100" onchange="updateStudentGrade('${sId}', 'sts', this.value)">
            <button class="btn-grade-step" onclick="adjustGrade('${sId}', 'sts', 5)">+</button>
          </div>
        </td>
        <td>
          <div class="grade-input-group">
            <button class="btn-grade-step" onclick="adjustGrade('${sId}', 'sas', -5)">-</button>
            <input type="number" class="grade-input" value="${sas}" min="0" max="100" onchange="updateStudentGrade('${sId}', 'sas', this.value)">
            <button class="btn-grade-step" onclick="adjustGrade('${sId}', 'sas', 5)">+</button>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <strong style="font-size:15px; color:var(--primary-dark);">${akhir}</strong>
            <span class="badge ${badgeCls}">${predikat}</span>
          </div>
        </td>
      </tr>`;
  }).join('');
}
