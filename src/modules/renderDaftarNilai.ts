import { appData, saveStorage } from '../helpers';
import { getTeacherClasses } from './getTeacherClasses';

// Fungsi pembantu untuk render baris nilai
function buildNilaiRows(students: any[]): string {
  if (students.length === 0) {
    return `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted); font-size:13px;">
      <i class="ri-inbox-line" style="font-size:24px; display:block; margin-bottom:6px; opacity:0.4;"></i>
      Tidak ada data nilai untuk kelas yang dipilih.
    </td></tr>`;
  }
  return students.map((s, index) => {
    const formatif = s.scoreFormatif !== undefined ? s.scoreFormatif : 85;
    const sts = (s as any).scoreSts !== undefined ? (s as any).scoreSts : 88;
    const sas = (s as any).scoreSas !== undefined ? (s as any).scoreSas : (s.scoreSumatif || 86);
    const finalScore = Math.round((formatif * 0.5) + (sts * 0.25) + (sas * 0.25));

    let gradeLabel = 'C (Cukup)';
    let badgeClass = 'badge-warning';
    if (finalScore >= 85) { gradeLabel = 'A (Sangat Baik)'; badgeClass = 'badge-success'; }
    else if (finalScore >= 75) { gradeLabel = 'B (Baik)'; badgeClass = 'badge-info'; }
    else if (finalScore >= 65) { gradeLabel = 'C (Cukup)'; badgeClass = 'badge-warning'; }
    else { gradeLabel = 'D (Perlu Bimbingan)'; badgeClass = 'badge-danger'; }

    return `
      <tr>
        <td style="text-align:center;">${index + 1}</td>
        <td><strong>${s.name}</strong></td>
        <td style="text-align:center;"><span class="badge badge-info">${s.classId}</span></td>
        <td style="text-align:center;">
          <div class="grade-counter-pill">
            <button class="grade-btn-step" onclick="adjustGrade('${s.id}', 'formatif', -1)" title="Kurangi 1">-</button>
            <input type="number" class="grade-input-num" min="0" max="100" value="${formatif}" onchange="updateStudentGrade('${s.id}', 'formatif', this.value)">
            <button class="grade-btn-step" onclick="adjustGrade('${s.id}', 'formatif', 1)" title="Tambah 1">+</button>
          </div>
        </td>
        <td style="text-align:center;">
          <div class="grade-counter-pill">
            <button class="grade-btn-step" onclick="adjustGrade('${s.id}', 'sts', -1)" title="Kurangi 1">-</button>
            <input type="number" class="grade-input-num" min="0" max="100" value="${sts}" onchange="updateStudentGrade('${s.id}', 'sts', this.value)">
            <button class="grade-btn-step" onclick="adjustGrade('${s.id}', 'sts', 1)" title="Tambah 1">+</button>
          </div>
        </td>
        <td style="text-align:center;">
          <div class="grade-counter-pill">
            <button class="grade-btn-step" onclick="adjustGrade('${s.id}', 'sas', -1)" title="Kurangi 1">-</button>
            <input type="number" class="grade-input-num" min="0" max="100" value="${sas}" onchange="updateStudentGrade('${s.id}', 'sas', this.value)">
            <button class="grade-btn-step" onclick="adjustGrade('${s.id}', 'sas', 1)" title="Tambah 1">+</button>
          </div>
        </td>
        <td style="text-align:center;"><span class="na-pill">${finalScore}</span></td>
        <td style="text-align:center;"><span class="kktp-badge ${badgeClass}">${gradeLabel}</span></td>
      </tr>
    `;
  }).join('');
}

export function renderDaftarNilai(): void {
  // Isi dropdown kelas secara dinamis
  const nilaiSelect = document.getElementById('nilaiClassSelect') as HTMLSelectElement | null;
  if (nilaiSelect && nilaiSelect.options.length <= 1) {
    const availClasses = getTeacherClasses();
    availClasses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      nilaiSelect.appendChild(opt);
    });
  }

  const tbody = document.getElementById('nilaiTableBody');
  if (!tbody) return;

  const filterClass = nilaiSelect ? nilaiSelect.value : 'ALL';
  let students = appData.students || [];
  if (filterClass !== 'ALL') {
    students = students.filter(s => s.classId === filterClass);
  } else {
    const availIds = getTeacherClasses().map(c => c.id);
    students = students.filter(s => availIds.includes(s.classId));
  }

  // Update label jumlah siswa
  const countLabel = document.getElementById('nilaiCountLabel');
  if (countLabel) {
    countLabel.textContent = `Menampilkan ${students.length} siswa`;
  }

  tbody.innerHTML = buildNilaiRows(students);
}

// Filter nilai berdasarkan dropdown pilihan kelas
export function filterNilaiByClass(classId: string): void {
  const tbody = document.getElementById('nilaiTableBody');
  if (!tbody) return;

  let students = appData.students || [];
  if (classId !== 'ALL') {
    students = students.filter(s => s.classId === classId);
  } else {
    const availIds = getTeacherClasses().map(c => c.id);
    students = students.filter(s => availIds.includes(s.classId));
  }

  const countLabel = document.getElementById('nilaiCountLabel');
  if (countLabel) countLabel.textContent = `Menampilkan ${students.length} siswa`;

  tbody.innerHTML = buildNilaiRows(students);
}

export function adjustGrade(studentId: string, field: 'formatif' | 'sts' | 'sas', delta: number): void {
  const student = appData.students.find(s => s.id === studentId || s.nis === studentId);
  if (!student) return;

  if (field === 'formatif') {
    student.scoreFormatif = Math.max(0, Math.min(100, (student.scoreFormatif || 80) + delta));
  } else if (field === 'sts') {
    (student as any).scoreSts = Math.max(0, Math.min(100, ((student as any).scoreSts || 80) + delta));
  } else if (field === 'sas') {
    (student as any).scoreSas = Math.max(0, Math.min(100, ((student as any).scoreSas || student.scoreSumatif || 80) + delta));
  }

  saveStorage();
  renderDaftarNilai();
}

export function updateStudentGrade(studentId: string, field: 'formatif' | 'sts' | 'sas', value: string): void {
  const student = appData.students.find(s => s.id === studentId || s.nis === studentId);
  if (!student) return;

  const num = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
  if (field === 'formatif') student.scoreFormatif = num;
  else if (field === 'sts') (student as any).scoreSts = num;
  else if (field === 'sas') (student as any).scoreSas = num;

  saveStorage();
  renderDaftarNilai();
}
