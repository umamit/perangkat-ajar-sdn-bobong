import { appData, saveStorage } from '../helpers';

export function renderDaftarNilai(): void {
  const table = document.querySelector('#view-nilai table');
  if (table) {
    const thead = table.querySelector('thead');
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th style="width:40px; text-align:center;">No</th>
          <th style="min-width:180px;">Nama Lengkap Siswa</th>
          <th style="min-width:70px; text-align:center;">Kelas</th>
          <th style="min-width:130px; text-align:center;">Formatif (LM)</th>
          <th style="min-width:130px; text-align:center;">Sumatif (STS)</th>
          <th style="min-width:130px; text-align:center;">Sumatif (SAS)</th>
          <th style="min-width:90px; text-align:center;">NA Rapor</th>
          <th style="min-width:170px; text-align:center;">Predikat KKTP</th>
        </tr>
      `;
    }
  }

  const tbody = document.getElementById('nilaiTableBody');
  if (!tbody) return;
  tbody.innerHTML = appData.students.map((s, index) => {
    const formatif = s.scoreFormatif !== undefined ? s.scoreFormatif : 85;
    const sts = (s as any).scoreSts !== undefined ? (s as any).scoreSts : 88;
    const sas = (s as any).scoreSas !== undefined ? (s as any).scoreSas : (s.scoreSumatif || 86);
    const finalScore = Math.round((formatif * 0.5) + (sts * 0.25) + (sas * 0.25));

    let gradeLabel = 'C (Cukup)';
    let badgeClass = 'badge-warning';
    if (finalScore >= 85) {
      gradeLabel = 'A (Sangat Baik)';
      badgeClass = 'badge-success';
    } else if (finalScore >= 75) {
      gradeLabel = 'B (Baik)';
      badgeClass = 'badge-info';
    } else if (finalScore >= 65) {
      gradeLabel = 'C (Cukup)';
      badgeClass = 'badge-warning';
    } else {
      gradeLabel = 'D (Perlu Bimbingan)';
      badgeClass = 'badge-danger';
    }

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
  if (field === 'formatif') {
    student.scoreFormatif = num;
  } else if (field === 'sts') {
    (student as any).scoreSts = num;
  } else if (field === 'sas') {
    (student as any).scoreSas = num;
  }

  saveStorage();
  renderDaftarNilai();
}
