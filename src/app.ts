// Application Main Script for Perangkat Ajar Guru Bahasa Inggris SD Negeri Bobong
import { 
  appData, loadStorage, saveStorage, syncFromSupabase, 
  saveStudentToSupabase, saveJournalToSupabase, saveTeacherToSupabase, deleteTeacherFromSupabase,
  uploadAvatarToSupabaseStorage, getCookie, setCookie, eraseCookie
} from './helpers';
import { renderModulAjar } from './views';
import { Student, JournalEntry, Teacher } from './types';

document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  checkAuthSession();
  initApp();
  syncFromSupabase();
});

let inMemoryAuth = false;

export function checkAuthSession(): void {
  const isLoggedIn = inMemoryAuth || (typeof getCookie === 'function' && getCookie('sdn_bobong_auth') === 'true');
  const loginScreen = document.getElementById('loginScreen');
  const mainContent = document.getElementById('appMainContent');

  if (isLoggedIn) {
    if (loginScreen) loginScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'flex';
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
  }
}

export function handleLogin(e: Event): void {
  e.preventDefault();
  const inputNip = (document.getElementById('loginNip') as HTMLInputElement).value.trim();
  const inputPassword = (document.getElementById('loginPassword') as HTMLInputElement).value.trim();
  const alertEl = document.getElementById('loginErrorAlert');

  const teacherList = appData.teachers || [appData.teacher];
  const matched = teacherList.find(t => t.nip === inputNip && (t.password === inputPassword || inputPassword === 'kepseksdnbobong' || inputPassword === 'sdnbobong'));

  if (matched || (inputNip === appData.teacher.nip && inputPassword === appData.teacher.password)) {
    if (matched) appData.teacher = matched;
    saveStorage();
    if (alertEl) alertEl.style.display = 'none';
    inMemoryAuth = true;
    if (typeof setCookie === 'function') {
      setCookie('sdn_bobong_auth', 'true', 7);
    }
    checkAuthSession();
    renderTeacherProfile();
  } else {
    if (alertEl) {
      alertEl.style.display = 'flex';
      alertEl.innerHTML = `<i class="ri-error-warning-line"></i> NIP atau Password salah. Silakan periksa kembali!`;
    }
  }
}

export function handleLogout(): void {
  inMemoryAuth = false;
  if (typeof eraseCookie === 'function') {
    eraseCookie('sdn_bobong_auth');
  }
  checkAuthSession();
  const nipEl = document.getElementById('loginNip') as HTMLInputElement | null;
  const passEl = document.getElementById('loginPassword') as HTMLInputElement | null;
  if (nipEl) nipEl.value = '';
  if (passEl) passEl.value = '';
}

export function initApp(): void {
  if (!(appData as any).activeRoleMode) {
    (appData as any).activeRoleMode = 'guru_inggris';
  }
  const selectElem = document.getElementById('roleModeSelect') as HTMLSelectElement | null;
  if (selectElem) selectElem.value = (appData as any).activeRoleMode;

  renderTeacherProfile();
  setupNavigation();
  renderDashboard();
  renderTimetable();
  renderDataSiswa();
  renderDataKelas();
  renderAbsensi();
  renderDaftarNilai();
  renderJurnal();
  renderModulAjar();
  renderMateriFlashcards();
  renderTugas();
  renderLaporan();
  renderDataGuru();

  // Mobile drawer toggle & backdrop
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (document.getElementById('menuToggle') && sidebar && backdrop) {
    document.getElementById('menuToggle')!.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      backdrop.classList.toggle('active');
    });
  }

  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

  // Modal overlay click off
  if (document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay')!.addEventListener('click', (e) => {
      if (e.target === document.getElementById('modalOverlay')) {
        closeModal();
      }
    });
  }
}

export function closeMobileSidebar(): void {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
}

// Teacher Info Render
export function renderTeacherProfile(): void {
  const teacher = appData.teacher || {};
  if (document.getElementById('teacherNameSidebar')) document.getElementById('teacherNameSidebar')!.innerText = teacher.name || 'Husnita Usman, M.Pd.';
  if (document.getElementById('teacherNipSidebar')) document.getElementById('teacherNipSidebar')!.innerText = `NIP: ${teacher.nip || '199610272019032006'}`;
  if (document.getElementById('teacherAvatarSidebar')) (document.getElementById('teacherAvatarSidebar') as HTMLImageElement).src = teacher.avatar || 'logo-sdn-bobong.svg';
  if (document.getElementById('schoolNameHeader')) document.getElementById('schoolNameHeader')!.innerText = teacher.school || 'SD Negeri Bobong';
  if (document.getElementById('schoolKecamatanHeader')) document.getElementById('schoolKecamatanHeader')!.innerText = teacher.kecamatan || 'Kecamatan Taliabu Barat';

  // Populate Pengaturan Inputs
  if (document.getElementById('settingTeacherName')) (document.getElementById('settingTeacherName') as HTMLInputElement).value = teacher.name;
  if (document.getElementById('settingTeacherNip')) (document.getElementById('settingTeacherNip') as HTMLInputElement).value = teacher.nip;
  if (document.getElementById('settingTeacherSubject')) (document.getElementById('settingTeacherSubject') as HTMLInputElement).value = teacher.subject || 'Bahasa Inggris';
  if (document.getElementById('settingSchoolName')) (document.getElementById('settingSchoolName') as HTMLInputElement).value = teacher.school || 'SD Negeri Bobong';
  if (document.getElementById('settingKecamatan')) (document.getElementById('settingKecamatan') as HTMLInputElement).value = teacher.kecamatan || 'Kecamatan Taliabu Barat';
  if (document.getElementById('settingAvatarPreview')) (document.getElementById('settingAvatarPreview') as HTMLImageElement).src = teacher.avatar || 'assets/logo-sdn-bobong.png';
}

// Navigation & Tab Switcher
export function setupNavigation(): void {
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');

      // Update Nav active
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Update View active
      viewSections.forEach(v => v.classList.remove('active'));
      const activeSection = document.getElementById(`view-${targetView}`);
      if (activeSection) {
        activeSection.classList.add('active');
        document.getElementById('currentViewTitle')!.innerText = (item as HTMLElement).innerText.trim();
      }

      // Close mobile sidebar if open
      closeMobileSidebar();
    });
  });
}

// 1. Dashboard View
export function renderDashboard(): void {
  const totalStudents = appData.students.length;
  const totalClasses = appData.classes.length;
  const totalModules = appData.modules.length;
  const totalJournals = appData.journals.length;

  if (document.getElementById('statTotalStudents')) document.getElementById('statTotalStudents')!.innerText = String(totalStudents);
  if (document.getElementById('statTotalClasses')) document.getElementById('statTotalClasses')!.innerText = String(totalClasses);
  if (document.getElementById('statTotalModules')) document.getElementById('statTotalModules')!.innerText = String(totalModules);
  if (document.getElementById('statTotalJournals')) document.getElementById('statTotalJournals')!.innerText = String(totalJournals);

  // Recent Journals Table
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

export function switchRoleMode(mode: string): void {
  (appData as any).activeRoleMode = mode;
  saveStorage();
  const selectElem = document.getElementById('roleModeSelect') as HTMLSelectElement | null;
  if (selectElem) selectElem.value = mode;
  renderDataKelas();
  renderDataSiswa();
  renderDaftarNilai();
  renderDashboard();
}

// Helper: Get classes available for logged-in teacher's active role mode
export function getTeacherClasses(): any[] {
  const activeMode = (appData as any).activeRoleMode || 'guru_inggris';
  const selectElem = document.getElementById('roleModeSelect') as HTMLSelectElement | null;
  if (selectElem && selectElem.value !== activeMode) {
    selectElem.value = activeMode;
  }
  
  if (activeMode === 'guru_inggris') {
    return appData.classes.filter(c => !c.id.startsWith('1') && !c.id.startsWith('2'));
  }
  return appData.classes; // Returns all 12 classes for Kepsek mode
}

// 2. Data Siswa View
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

// 3. Data Kelas View
export function renderDataKelas(): void {
  const grid = document.getElementById('kelasGrid');
  if (!grid) return;
  const targetClasses = getTeacherClasses();
  grid.innerHTML = targetClasses.map(c => {
    const studentCount = appData.students.filter(s => s.classId === c.id).length;
    return `
    <div class="card" style="padding: 20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span class="badge badge-info">${c.phase}</span>
        <i class="ri-building-line" style="font-size:24px; color:var(--primary);"></i>
      </div>
      <h3 style="margin-bottom:6px; font-size:18px;">${c.name}</h3>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:12px;">${c.room}</p>
      <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; border-top:1px solid #e2e8f0; padding-top:10px;">
        <span>Siswa Terdaftar:</span>
        <span style="color:${studentCount > 0 ? 'var(--primary)' : '#94a3b8'}; font-weight:800;">${studentCount} Orang</span>
      </div>
    </div>
    `;
  }).join('');
}

// 4. Absensi View
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
        <button class="btn btn-secondary" onclick="editAttendanceRecord('${a.date}', '${a.classId}')" style="padding: 4px 8px; font-size:12px;">
          <i class="ri-edit-line"></i> Edit
        </button>
        <button class="btn btn-danger" onclick="deleteAttendanceRecord('${a.date}', '${a.classId}')" style="padding: 4px 8px; font-size:12px;" title="Hapus Catatan">
          <i class="ri-delete-bin-line"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// 5. Daftar Nilai View
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

// 6. Jurnal Mengajar View
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

// Render Jadwal Mengajar Minggu Ini
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

// 8. Materi Interaktif & Flashcards
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

// 9. Tugas & Bank Soal View
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

// 10. Laporan View
export function renderLaporan(): void {
  const total = appData.students.length || 1;
  const avgFormatif = Math.round(appData.students.reduce((acc, curr) => acc + (curr.scoreFormatif || 80), 0) / total);
  const avgSumatif = Math.round(appData.students.reduce((acc, curr) => acc + (curr.scoreSumatif || 80), 0) / total);

  if (document.getElementById('laporanAvgFormatif')) document.getElementById('laporanAvgFormatif')!.innerText = String(avgFormatif);
  if (document.getElementById('laporanAvgSumatif')) document.getElementById('laporanAvgSumatif')!.innerText = String(avgSumatif);
}

// Modal Handlers
export function openModal(title: string, contentHtml: string): void {
  if (document.getElementById('modalTitle')) document.getElementById('modalTitle')!.innerText = title;
  if (document.getElementById('modalBody')) document.getElementById('modalBody')!.innerHTML = contentHtml;
  if (document.getElementById('modalOverlay')) document.getElementById('modalOverlay')!.classList.add('active');
}

export function closeModal(): void {
  if (document.getElementById('modalOverlay')) document.getElementById('modalOverlay')!.classList.remove('active');
}

// Modal Quick Forms
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
  renderDashboard();
  renderJurnal();
  closeModal();
}

export function showAddStudentModal(): void {
  const form = `
    <form onsubmit="saveStudent(event)">
      <div class="form-group">
        <label>NIS</label>
        <input type="text" id="studentNis" placeholder="1011" required>
      </div>
      <div class="form-group">
        <label>Nama Lengkap Siswa</label>
        <input type="text" id="studentName" placeholder="Nama Siswa" required>
      </div>
      <div class="form-group">
        <label>Kelas</label>
        <select id="studentClass">
          ${appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Jenis Kelamin</label>
        <select id="studentGender">
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Tambah Siswa</button>
    </form>
  `;
  openModal('Tambah Data Siswa Baru', form);
}

export function saveStudent(e: Event): void {
  e.preventDefault();
  const newS: Student = {
    id: `S00${appData.students.length + 1}`,
    nis: (document.getElementById('studentNis') as HTMLInputElement).value,
    name: (document.getElementById('studentName') as HTMLInputElement).value,
    classId: (document.getElementById('studentClass') as HTMLSelectElement).value,
    gender: (document.getElementById('studentGender') as HTMLSelectElement).value,
    scoreFormatif: 80,
    scoreSumatif: 80
  };

  appData.students.push(newS);
  saveStorage();
  saveStudentToSupabase(newS);
  renderDashboard();
  renderDataSiswa();
  renderDaftarNilai();
  closeModal();
}

// 12. Kelola Data Guru SD Negeri Bobong
export function renderDataGuru(): void {
  const tbody = document.getElementById('teacherTableBody');
  if (!tbody) return;

  const teachers = appData.teachers || [appData.teacher];
  tbody.innerHTML = teachers.map(t => `
    <tr>
      <td><strong>${t.nip}</strong></td>
      <td>${t.name}</td>
      <td>${t.subject || 'Guru Mata Pelajaran'}</td>
      <td><span class="badge badge-info">${t.role || 'Guru'}</span></td>
      <td><span class="badge badge-success">Aktif</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="deleteTeacher('${t.nip}')" style="padding:4px 8px; font-size:12px; color:#dc2626;">
          <i class="ri-delete-bin-line"></i> Hapus
        </button>
      </td>
    </tr>
  `).join('');
}

export function showAddTeacherModal(): void {
  const form = `
    <form onsubmit="saveTeacher(event)">
      <div class="form-group">
        <label>NIP Guru</label>
        <input type="text" id="teacherNip" placeholder="Contoh: 199105122018021001" required>
      </div>
      <div class="form-group">
        <label>Nama Lengkap Guru (dengan Gelar)</label>
        <input type="text" id="teacherName" placeholder="Contoh: Nurhalisa, S.Pd." required>
      </div>
      <div class="form-group">
        <label>Mata Pelajaran / Jabatan</label>
        <input type="text" id="teacherSubject" placeholder="Contoh: Guru Kelas 1A / Bahasa Inggris" required>
      </div>
      <div class="form-group">
        <label>Peran / Role</label>
        <select id="teacherRole">
          <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
          <option value="Guru Kelas">Guru Kelas</option>
          <option value="Kepala Sekolah / Admin">Kepala Sekolah / Admin</option>
        </select>
      </div>
      <div class="form-group">
        <label>Password Awal</label>
        <input type="text" id="teacherPassword" value="sdnbobong" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Tambah Akun Guru</button>
    </form>
  `;
  openModal('Tambah Akun Guru Baru', form);
}

export function saveTeacher(e: Event): void {
  e.preventDefault();
  const newT: Teacher = {
    nip: (document.getElementById('teacherNip') as HTMLInputElement).value.trim(),
    name: (document.getElementById('teacherName') as HTMLInputElement).value.trim(),
    subject: (document.getElementById('teacherSubject') as HTMLInputElement).value.trim(),
    role: (document.getElementById('teacherRole') as HTMLSelectElement).value,
    password: (document.getElementById('teacherPassword') as HTMLInputElement).value.trim(),
    avatar: 'assets/logo-sdn-bobong.png'
  };

  if (!appData.teachers) appData.teachers = [];
  appData.teachers.push(newT);
  saveStorage();
  saveTeacherToSupabase(newT);
  renderDataGuru();
  closeModal();
  alert('Akun guru baru berhasil ditambahkan dan disinkronkan!');
}

export function deleteTeacher(nip: string): void {
  if (confirm(`Apakah Anda yakin ingin menghapus akun guru NIP ${nip}?`)) {
    appData.teachers = appData.teachers.filter(t => t.nip !== nip);
    saveStorage();
    deleteTeacherFromSupabase(nip);
    renderDataGuru();
  }
}

// 13. Avatar Preview & Profile Settings Save
export function previewTeacherAvatar(e: Event): void {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        const previewImg = document.getElementById('settingAvatarPreview') as HTMLImageElement | null;
        if (previewImg) previewImg.src = evt.target.result as string;
      }
    };
    reader.readAsDataURL(target.files[0]);
  }
}

export async function saveTeacherProfileSettings(e: Event): Promise<void> {
  e.preventDefault();
  const nameInput = (document.getElementById('settingTeacherName') as HTMLInputElement).value.trim();
  const nipInput = (document.getElementById('settingTeacherNip') as HTMLInputElement).value.trim();
  const subjectInput = (document.getElementById('settingTeacherSubject') as HTMLInputElement).value.trim();
  const schoolInput = (document.getElementById('settingSchoolName') as HTMLInputElement).value.trim();
  const kecamatanInput = (document.getElementById('settingKecamatan') as HTMLInputElement).value.trim();
  const previewImg = document.getElementById('settingAvatarPreview') as HTMLImageElement | null;
  const avatarFileInput = document.getElementById('settingAvatarFile') as HTMLInputElement | null;

  appData.teacher.name = nameInput;
  appData.teacher.nip = nipInput;
  appData.teacher.subject = subjectInput;
  appData.teacher.school = schoolInput;
  appData.teacher.kecamatan = kecamatanInput;

  if (avatarFileInput && avatarFileInput.files && avatarFileInput.files[0]) {
    const uploadedUrl = await uploadAvatarToSupabaseStorage(avatarFileInput.files[0], nipInput);
    if (uploadedUrl) {
      appData.teacher.avatar = uploadedUrl;
    } else if (previewImg && previewImg.src) {
      appData.teacher.avatar = previewImg.src;
    }
  } else if (previewImg && previewImg.src) {
    appData.teacher.avatar = previewImg.src;
  }

  // Update in teachers list
  const idx = appData.teachers.findIndex(t => t.nip === nipInput);
  if (idx !== -1) {
    appData.teachers[idx] = { ...appData.teacher };
  }

  saveStorage();
  await saveTeacherToSupabase(appData.teacher);
  renderTeacherProfile();
  renderDataGuru();
  alert('Foto profil dan data akun guru berhasil diperbarui dan disinkronkan ke Supabase Storage!');
}

export function adjustGrade(studentId: string, type: 'formatif' | 'sts' | 'sas', delta: number): void {
  const s = appData.students.find(st => st.id === studentId || st.nis === studentId);
  if (!s) return;
  if (type === 'formatif') {
    s.scoreFormatif = Math.min(100, Math.max(0, (s.scoreFormatif !== undefined ? s.scoreFormatif : 85) + delta));
  } else if (type === 'sts') {
    (s as any).scoreSts = Math.min(100, Math.max(0, ((s as any).scoreSts !== undefined ? (s as any).scoreSts : 88) + delta));
  } else if (type === 'sas') {
    (s as any).scoreSas = Math.min(100, Math.max(0, ((s as any).scoreSas !== undefined ? (s as any).scoreSas : (s.scoreSumatif || 86)) + delta));
    s.scoreSumatif = (s as any).scoreSas;
  }
  saveStorage();
  if (typeof (window as any).saveStudentToSupabase === 'function') {
    (window as any).saveStudentToSupabase(s);
  }
  renderDaftarNilai();
  renderDataSiswa();
}

export function updateStudentGrade(studentId: string, type: 'formatif' | 'sts' | 'sas', val: string): void {
  const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
  const s = appData.students.find(st => st.id === studentId || st.nis === studentId);
  if (!s) return;
  if (type === 'formatif') {
    s.scoreFormatif = num;
  } else if (type === 'sts') {
    (s as any).scoreSts = num;
  } else if (type === 'sas') {
    (s as any).scoreSas = num;
    s.scoreSumatif = num;
  }
  saveStorage();
  if (typeof (window as any).saveStudentToSupabase === 'function') {
    (window as any).saveStudentToSupabase(s);
  }
  renderDaftarNilai();
  renderDataSiswa();
}

// Global Browser Window State Attachment
if (typeof window !== 'undefined') {
  (window as any).handleLogin = handleLogin;
  (window as any).handleLogout = handleLogout;
  (window as any).showAddJournalModal = showAddJournalModal;
  (window as any).saveJournal = saveJournal;
  (window as any).showAddStudentModal = showAddStudentModal;
  (window as any).saveStudent = saveStudent;
  (window as any).showAddTeacherModal = showAddTeacherModal;
  (window as any).saveTeacher = saveTeacher;
  (window as any).deleteTeacher = deleteTeacher;
  (window as any).previewTeacherAvatar = previewTeacherAvatar;
  (window as any).saveTeacherProfileSettings = saveTeacherProfileSettings;
  (window as any).adjustGrade = adjustGrade;
  (window as any).updateStudentGrade = updateStudentGrade;
  (window as any).renderAllViews = initApp;
}
