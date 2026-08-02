// Academic & Learning Modules (Timetable, Attendance, Grades, Journal, Flashcards, Homework, Reports)
import { appData, saveStorage, saveJournalToSupabase } from '../helpers';
import { JournalEntry } from '../types';
import { openModal, closeModal } from './uiModule';

export function renderDashboard(): void {
  const totalStudents = appData.students.length;
  const totalClasses = appData.classes.length;
  const totalModules = appData.modules.length;
  const totalJournals = appData.journals.length;

  if (document.getElementById('statTotalStudents')) document.getElementById('statTotalStudents')!.innerText = String(totalStudents);
  if (document.getElementById('statTotalClasses')) document.getElementById('statTotalClasses')!.innerText = String(totalClasses);
  if (document.getElementById('statTotalModules')) document.getElementById('statTotalModules')!.innerText = String(totalModules);
  if (document.getElementById('statTotalJournals')) document.getElementById('statTotalJournals')!.innerText = String(totalJournals);

  const tbody = document.getElementById('recentJournalsBody');
  if (tbody) {
    tbody.innerHTML = appData.journals.slice(0, 3).map(j => `
      <tr>
        <td>${j.date}</td>
        <td><span class="badge badge-info">${j.classId}</span></td>
        <td><strong>${j.topic}</strong></td>
        <td>${j.notes}</td>
        <td><span class="badge badge-success">Selesai</span></td>
      </tr>
    `).join('');
  }
}

export function renderAbsensi(): void {
  const tbody = document.getElementById('absensiTableBody');
  if (!tbody) return;
  tbody.innerHTML = (appData.attendance || []).map((a: any) => `
    <tr>
      <td><strong>${a.date}</strong></td>
      <td><span class="badge badge-info">${a.classId}</span></td>
      <td><span class="badge badge-success">${a.hadir} Siswa</span></td>
      <td><span class="badge badge-warning">${a.izin} Siswa</span></td>
      <td><span class="badge badge-warning">${a.sakit} Siswa</span></td>
      <td><span class="badge badge-danger">${a.alpa} Siswa</span></td>
      <td>
        <button class="btn btn-secondary" onclick="alert('Edit Absensi')" style="padding: 4px 8px; font-size:12px;">
          <i class="ri-edit-line"></i> Edit
        </button>
      </td>
    </tr>
  `).join('');
}

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

export function renderJurnal(): void {
  const tbody = document.getElementById('jurnalTableBody');
  if (!tbody) return;
  tbody.innerHTML = appData.journals.map(j => `
    <tr>
      <td>${j.date}</td>
      <td><span class="badge badge-info">${j.classId}</span></td>
      <td><strong>${j.topic}</strong></td>
      <td>${j.notes}</td>
      <td><em>${j.attendance || '-'}</em></td>
      <td><span class="badge badge-success">Selesai</span></td>
    </tr>
  `).join('');
}

export function renderTimetable(): void {
  const tbody = document.getElementById('timetableBody');
  if (!tbody) return;
  tbody.innerHTML = appData.timetable.map(t => `
    <tr>
      <td><strong>${t.day}</strong></td>
      <td>${t.time}</td>
      <td><span class="badge badge-info">${t.classId}</span></td>
      <td>${t.topic}</td>
    </tr>
  `).join('');
}

export function renderMateriFlashcards(): void {
  const container = document.getElementById('flashcardsGrid');
  if (!container) return;
  container.innerHTML = appData.flashcards.map(f => `
    <div class="flashcard" onclick="flipCard(this)">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="flashcard-emoji"><i class="${f.icon || 'ri-book-open-line'}"></i></div>
          <div class="flashcard-word">${f.word}</div>
          <span class="badge badge-info" style="margin-top:8px;">${f.category}</span>
          <button class="audio-btn" onclick="speakText(event, '${f.word}')" title="Dengarkan Pengucapan">
            <i class="ri-volume-up-line"></i>
          </button>
        </div>
        <div class="flashcard-back">
          <h3 style="font-size:18px; margin-bottom:6px;">${f.translate}</h3>
          <p style="font-size:13px; font-style:italic;">"${f.example}"</p>
          <small style="margin-top:10px; opacity:0.8;">Klik untuk kembali</small>
        </div>
      </div>
    </div>
  `).join('');
}

export function renderTugas(): void {
  const container = document.getElementById('tugasGrid');
  if (!container) return;
  container.innerHTML = `
    <div class="card" style="padding:20px; border-left:4px solid var(--primary);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="badge badge-info">Formatik</span>
        <span class="badge badge-success">Aktif</span>
      </div>
      <h3 style="font-size:16px; margin-bottom:6px;">Kuis Kosakata Action Verbs</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Kelas: 4A | Tenggat: 2025-08-10</p>
      <p style="font-size:13.5px; color:#334155; background:#f8fafc; padding:10px; border-radius:6px;">Jodohkan gambar aksi dengan kata bahasa Inggris yang tepat di lembar kerja.</p>
    </div>
  `;
}

export function renderLaporan(): void {
  const total = appData.students.length || 1;
  const avgFormatif = Math.round(appData.students.reduce((acc, curr) => acc + (curr.scoreFormatif || 80), 0) / total);
  const avgSumatif = Math.round(appData.students.reduce((acc, curr) => acc + (curr.scoreSumatif || 80), 0) / total);

  if (document.getElementById('laporanAvgFormatif')) document.getElementById('laporanAvgFormatif')!.innerText = String(avgFormatif);
  if (document.getElementById('laporanAvgSumatif')) document.getElementById('laporanAvgSumatif')!.innerText = String(avgSumatif);
}

export function showAddJournalModal(): void {
  const form = `
    <form onsubmit="saveJournal(event)">
      <div class="form-group">
        <label>Tanggal Mengajar</label>
        <input type="date" id="jurnalDate" required value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label>Kelas</label>
        <select id="jurnalClass">
          ${appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Materi / Topik Pembelajaran</label>
        <input type="text" id="jurnalTopic" placeholder="Contoh: Unit 2 - Family Members" required>
      </div>
      <div class="form-group">
        <label>Kegiatan Pembelajaran</label>
        <textarea id="jurnalActivity" rows="3" placeholder="Deskripsikan aktivitas belajar siswa..." required></textarea>
      </div>
      <div class="form-group">
        <label>Catatan / Refleksi Guru</label>
        <textarea id="jurnalNotes" rows="2" placeholder="Catatan perkembangan atau kendala..."></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Simpan Jurnal</button>
    </form>
  `;
  openModal('Tambah Jurnal Mengajar Harian', form);
}

export function saveJournal(e: Event): void {
  e.preventDefault();
  const newJ: JournalEntry = {
    id: `J0${appData.journals.length + 1}`,
    date: (document.getElementById('jurnalDate') as HTMLInputElement).value,
    time: '07.30 - 08.40',
    classId: (document.getElementById('jurnalClass') as HTMLSelectElement).value,
    topic: (document.getElementById('jurnalTopic') as HTMLInputElement).value,
    notes: (document.getElementById('jurnalNotes') as HTMLInputElement).value || '-',
    attendance: 'Hadir Seluruh Siswa'
  };

  appData.journals.unshift(newJ);
  saveStorage();
  saveJournalToSupabase(newJ);
  renderJurnal();
  renderDashboard();
  closeModal();
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
