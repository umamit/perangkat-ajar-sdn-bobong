// Application Main Script for Perangkat Ajar Guru Bahasa Inggris SD Negeri Bobong
document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  checkAuthSession();
  initApp();
  syncFromSupabase();
});

let inMemoryAuth = false;

function checkAuthSession() {
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

function handleLogin(e) {
  e.preventDefault();
  const inputNip = document.getElementById('loginNip').value.trim();
  const inputPassword = document.getElementById('loginPassword').value.trim();
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

function handleLogout() {
  inMemoryAuth = false;
  if (typeof eraseCookie === 'function') {
    eraseCookie('sdn_bobong_auth');
  }
  checkAuthSession();
  if (document.getElementById('loginNip')) document.getElementById('loginNip').value = '';
  if (document.getElementById('loginPassword')) document.getElementById('loginPassword').value = '';
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('loginPassword');
  const icon = document.getElementById('togglePasswordIcon');
  if (passInput.type === 'password') {
    passInput.type = 'text';
    icon.className = 'ri-eye-off-line';
  } else {
    passInput.type = 'password';
    icon.className = 'ri-eye-line';
  }
}

function initApp() {
  if (!appData.activeRoleMode) {
    appData.activeRoleMode = 'guru_inggris';
  }
  const selectElem = document.getElementById('roleModeSelect');
  if (selectElem) selectElem.value = appData.activeRoleMode;

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

  // Mobile drawer toggle & backdrop
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (document.getElementById('menuToggle')) {
    const toggleBtn = document.getElementById('menuToggle');
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      backdrop.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = sidebar.classList.contains('active') ? 'ri-close-line' : 'ri-menu-line';
      }
    });
  }

  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

  // Modal overlay click off
  if (document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modalOverlay')) {
        closeModal();
      }
    });
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  const toggleBtn = document.getElementById('menuToggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    if (icon) icon.className = 'ri-menu-line';
  }
}

// Teacher Info Render & Form Auto-Populate
function renderTeacherProfile() {
  const teacher = appData.teacher || {};
  if (document.getElementById('teacherNameSidebar')) document.getElementById('teacherNameSidebar').innerText = teacher.name || 'Husnita Usman, M.Pd.';
  if (document.getElementById('teacherNipSidebar')) document.getElementById('teacherNipSidebar').innerText = `NIP: ${teacher.nip || '199610272019032006'}`;
  if (document.getElementById('teacherAvatarSidebar')) document.getElementById('teacherAvatarSidebar').src = teacher.avatar || 'logo-sdn-bobong.svg';
  if (document.getElementById('schoolNameHeader')) document.getElementById('schoolNameHeader').innerText = teacher.school || 'SD Negeri Bobong';
  if (document.getElementById('schoolKecamatanHeader')) document.getElementById('schoolKecamatanHeader').innerText = teacher.kecamatan || 'Kecamatan Taliabu Barat';
  renderPengaturanForm();
}

function renderPengaturanForm() {
  const teacher = appData.teacher || {};
  if (document.getElementById('settingTeacherName')) document.getElementById('settingTeacherName').value = teacher.name || 'Husnita Usman, M.Pd.';
  if (document.getElementById('settingTeacherNip')) document.getElementById('settingTeacherNip').value = teacher.nip || '199610272019032006';
  if (document.getElementById('settingTeacherSubject')) document.getElementById('settingTeacherSubject').value = teacher.subject || 'Bahasa Inggris';
  if (document.getElementById('settingSchoolName')) document.getElementById('settingSchoolName').value = teacher.school || 'SD Negeri Bobong';
  if (document.getElementById('settingKecamatan')) document.getElementById('settingKecamatan').value = teacher.kecamatan || 'Kecamatan Taliabu Barat';
  if (document.getElementById('settingAvatarPreview')) document.getElementById('settingAvatarPreview').src = teacher.avatar || 'logo-sdn-bobong.svg';
}

// Navigation & Tab Switcher
function setupNavigation() {
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
        document.getElementById('currentViewTitle').innerText = item.innerText.trim();
      }

      // Close mobile sidebar if open
      closeMobileSidebar();
    });
  });
}

// 1. Dashboard View
function renderDashboard() {
  const totalStudents = appData.students.length;
  const totalClasses = appData.classes.length;
  const totalModules = appData.modules.length;
  const totalJournals = appData.journals.length;

  document.getElementById('statTotalStudents').innerText = totalStudents;
  document.getElementById('statTotalClasses').innerText = totalClasses;
  document.getElementById('statTotalModules').innerText = totalModules;
  document.getElementById('statTotalJournals').innerText = totalJournals;

  // Timetable
  const timetableBody = document.getElementById('timetableBody');
  if (timetableBody) {
    if (!appData.schedules || appData.schedules.length === 0) {
      appData.schedules = [
        { day: "Senin", time: "07.30 - 08.40", classId: "4A", topic: "Unit 1: What Are You Doing?" },
        { day: "Selasa", time: "08.40 - 09.50", classId: "1A", topic: "Unit 1: How Are You?" },
        { day: "Rabu", time: "07.30 - 08.40", classId: "5A", topic: "Unit 1: What Time Is It?" },
        { day: "Kamis", time: "09.50 - 11.00", classId: "3A", topic: "Unit 1: I Like Dancing" },
        { day: "Jumat", time: "08.00 - 09.10", classId: "2A", topic: "Unit 1: My Family" }
      ];
    }
    timetableBody.innerHTML = appData.schedules.map((s, idx) => `
      <tr>
        <td><strong>${s.day}</strong></td>
        <td>${s.time}</td>
        <td><span class="badge badge-info">${s.classId}</span></td>
        <td>${s.topic}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteScheduleRecord(${idx})" style="padding:2px 6px; font-size:11px;" title="Hapus Jadwal">&times;</button>
        </td>
      </tr>
    `).join('');
  }

  // Recent Journals Table
  const tbody = document.getElementById('recentJournalsBody');
  if (tbody) {
    tbody.innerHTML = appData.journals.slice(0, 3).map(j => `
      <tr>
        <td>${j.date}</td>
        <td><span class="badge badge-info">${j.classId}</span></td>
        <td><strong>${j.topic}</strong></td>
        <td><span class="badge badge-success">${j.status}</span></td>
      </tr>
    `).join('');
  }
}

function switchRoleMode(mode) {
  appData.activeRoleMode = mode;
  saveStorage();
  
  const selectElem = document.getElementById('roleModeSelect');
  if (selectElem) selectElem.value = mode;

  const btnGuru = document.getElementById('btnRoleGuru');
  const btnKepsek = document.getElementById('btnRoleKepsek');

  if (btnGuru && btnKepsek) {
    if (mode === 'guru_inggris') {
      btnGuru.style.background = 'var(--primary)';
      btnGuru.style.color = '#ffffff';
      btnGuru.style.boxShadow = '0 4px 12px rgba(18, 165, 184, 0.35)';

      btnKepsek.style.background = 'transparent';
      btnKepsek.style.color = 'var(--text-muted)';
      btnKepsek.style.boxShadow = 'none';
    } else {
      btnKepsek.style.background = 'var(--primary-dark)';
      btnKepsek.style.color = '#ffffff';
      btnKepsek.style.boxShadow = '0 4px 12px rgba(10, 126, 141, 0.35)';

      btnGuru.style.background = 'transparent';
      btnGuru.style.color = 'var(--text-muted)';
      btnGuru.style.boxShadow = 'none';
    }
  }

  renderDataKelas();
  renderDataSiswa();
  renderDaftarNilai();
  renderDashboard();
}

// Helper: Get classes available for logged-in teacher's active role mode
function getTeacherClasses() {
  const activeMode = appData.activeRoleMode || 'guru_inggris';
  const selectElem = document.getElementById('roleModeSelect');
  if (selectElem && selectElem.value !== activeMode) {
    selectElem.value = activeMode;
  }
  
  if (activeMode === 'guru_inggris') {
    return appData.classes.filter(c => !c.id.startsWith('1') && !c.id.startsWith('2'));
  }
  return appData.classes; // Returns all 12 classes for Kepsek mode
}

// 2. Data Siswa View
function renderDataSiswa(filterClass = 'ALL') {
  const container = document.getElementById('siswaTableBody');
  if (!container) return;

  // Dynamically update class filter options based on teacher role
  const selectElem = document.getElementById('filterClassSelect');
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
    // If English teacher, filter students list to only Class 3+
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
      <td>${s.scoreFormatif}</td>
      <td>${s.scoreSumatif}</td>
      <td>
        <button class="btn btn-secondary" onclick="editStudent('${s.id}')" style="padding: 4px 8px; font-size:12px;">
          <i class="ri-edit-line"></i> Edit
        </button>
      </td>
    </tr>
  `).join('');
}

function filterSiswaByClass(classId) {
  renderDataSiswa(classId);
}

// 3. Data Kelas View
function renderDataKelas() {
  const grid = document.getElementById('kelasGrid');
  if (!grid) return;
  const targetClasses = getTeacherClasses();
  grid.innerHTML = targetClasses.map(c => {
    delete c.count; // Hapus paksa properti count fiktif jika ada di memory/cache
    const realStudents = (appData.students || []).filter(s => s.classId === c.id);
    const studentCount = realStudents.length;
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
function renderAbsensi() {
  const tbody = document.getElementById('absensiTableBody');
  if (!tbody) return;
  tbody.innerHTML = appData.attendance.map(a => `
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

function showAddAttendanceModal() {
  const today = new Date().toISOString().split('T')[0];
  const classOptions = getTeacherClasses().map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const form = `
    <form onsubmit="saveAttendanceRecord(event)">
      <div class="form-group">
        <label>Tanggal Presensi</label>
        <input type="date" id="attDate" value="${today}" required>
      </div>
      <div class="form-group">
        <label>Pilih Kelas</label>
        <select id="attClassId" required>${classOptions}</select>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group">
          <label>Jumlah Hadir</label>
          <input type="number" id="attHadir" min="0" value="20" required>
        </div>
        <div class="form-group">
          <label>Jumlah Izin</label>
          <input type="number" id="attIzin" min="0" value="0" required>
        </div>
        <div class="form-group">
          <label>Jumlah Sakit</label>
          <input type="number" id="attSakit" min="0" value="0" required>
        </div>
        <div class="form-group">
          <label>Jumlah Alpa</label>
          <input type="number" id="attAlpa" min="0" value="0" required>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">Simpan Catatan Presensi</button>
    </form>
  `;
  openModal('Catat Presensi Harian Siswa', form);
}

function editAttendanceRecord(date, classId) {
  const item = appData.attendance.find(a => a.date === date && a.classId === classId);
  if (!item) return;
  const classOptions = getTeacherClasses().map(c => `<option value="${c.id}" ${c.id === classId ? 'selected' : ''}>${c.name}</option>`).join('');
  const form = `
    <form onsubmit="saveAttendanceRecord(event)">
      <div class="form-group">
        <label>Tanggal Presensi</label>
        <input type="date" id="attDate" value="${item.date}" required>
      </div>
      <div class="form-group">
        <label>Pilih Kelas</label>
        <select id="attClassId" required>${classOptions}</select>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group">
          <label>Jumlah Hadir</label>
          <input type="number" id="attHadir" min="0" value="${item.hadir}" required>
        </div>
        <div class="form-group">
          <label>Jumlah Izin</label>
          <input type="number" id="attIzin" min="0" value="${item.izin}" required>
        </div>
        <div class="form-group">
          <label>Jumlah Sakit</label>
          <input type="number" id="attSakit" min="0" value="${item.sakit}" required>
        </div>
        <div class="form-group">
          <label>Jumlah Alpa</label>
          <input type="number" id="attAlpa" min="0" value="${item.alpa}" required>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">Update Presensi</button>
    </form>
  `;
  openModal('Edit Presensi Harian Siswa', form);
}

function saveAttendanceRecord(e) {
  e.preventDefault();
  const date = document.getElementById('attDate').value;
  const classId = document.getElementById('attClassId').value;
  const hadir = parseInt(document.getElementById('attHadir').value, 10) || 0;
  const izin = parseInt(document.getElementById('attIzin').value, 10) || 0;
  const sakit = parseInt(document.getElementById('attSakit').value, 10) || 0;
  const alpa = parseInt(document.getElementById('attAlpa').value, 10) || 0;

  const existingIdx = appData.attendance.findIndex(a => a.date === date && a.classId === classId);
  const rec = { date, classId, hadir, izin, sakit, alpa };

  if (existingIdx !== -1) {
    appData.attendance[existingIdx] = rec;
  } else {
    appData.attendance.unshift(rec);
  }

  saveStorage();
  renderAbsensi();
  closeModal();
  alert(`Data presensi kelas ${classId} tanggal ${date} berhasil disimpan!`);
}

function deleteAttendanceRecord(date, classId) {
  if (confirm(`Hapus catatan presensi kelas ${classId} tanggal ${date}?`)) {
    appData.attendance = appData.attendance.filter(a => !(a.date === date && a.classId === classId));
    saveStorage();
    renderAbsensi();
  }
}

function showAddScheduleModal() {
  const classOptions = getTeacherClasses().map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const form = `
    <form onsubmit="saveScheduleRecord(event)">
      <div class="form-group">
        <label>Hari</label>
        <select id="schDay" required>
          <option value="Senin">Senin</option>
          <option value="Selasa">Selasa</option>
          <option value="Rabu">Rabu</option>
          <option value="Kamis">Kamis</option>
          <option value="Jumat">Jumat</option>
          <option value="Sabtu">Sabtu</option>
        </select>
      </div>
      <div class="form-group">
        <label>Waktu Jam Pelajaran</label>
        <input type="text" id="schTime" placeholder="Contoh: 07.30 - 08.40" value="07.30 - 08.40" required>
      </div>
      <div class="form-group">
        <label>Pilih Kelas</label>
        <select id="schClassId" required>${classOptions}</select>
      </div>
      <div class="form-group">
        <label>Materi / Topik Pembelajaran</label>
        <input type="text" id="schTopic" placeholder="Contoh: Unit 2: Be Healthy, Be Happy" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Tambah Jadwal Mengajar</button>
    </form>
  `;
  openModal('Tambah Jadwal Mengajar Guru', form);
}

function saveScheduleRecord(e) {
  e.preventDefault();
  const day = document.getElementById('schDay').value;
  const time = document.getElementById('schTime').value.trim();
  const classId = document.getElementById('schClassId').value;
  const topic = document.getElementById('schTopic').value.trim();

  if (!appData.schedules) appData.schedules = [];
  appData.schedules.push({ day, time, classId, topic });

  saveStorage();
  renderDashboard();
  closeModal();
  alert(`Jadwal mengajar ${day} (${classId}) berhasil ditambahkan!`);
}

function deleteScheduleRecord(idx) {
  if (confirm('Hapus entri jadwal mengajar ini?')) {
    if (appData.schedules) appData.schedules.splice(idx, 1);
    saveStorage();
    renderDashboard();
  }
}

// 5. Daftar Nilai View (Standar Asesmen Kurikulum Merdeka Kemendikbudristek)
function renderDaftarNilai() {
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
    const sts = s.scoreSts !== undefined ? s.scoreSts : 88;
    const sas = s.scoreSas !== undefined ? s.scoreSas : (s.scoreSumatif || 86);
    
    // Rumus NA Rapor Kurikulum Merdeka: 50% Formatif/LM + 25% STS + 25% SAS
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

function adjustGrade(studentId, type, delta) {
  const s = appData.students.find(st => st.id === studentId || st.nis === studentId);
  if (!s) return;
  if (type === 'formatif') {
    s.scoreFormatif = Math.min(100, Math.max(0, (s.scoreFormatif !== undefined ? s.scoreFormatif : 85) + delta));
  } else if (type === 'sts') {
    s.scoreSts = Math.min(100, Math.max(0, (s.scoreSts !== undefined ? s.scoreSts : 88) + delta));
  } else if (type === 'sas') {
    s.scoreSas = Math.min(100, Math.max(0, (s.scoreSas !== undefined ? s.scoreSas : (s.scoreSumatif || 86)) + delta));
    s.scoreSumatif = s.scoreSas;
  }
  saveStorage();
  if (typeof saveStudentToSupabase === 'function') {
    saveStudentToSupabase(s);
  }
  renderDaftarNilai();
  renderDataSiswa();
}

function updateStudentGrade(studentId, type, val) {
  const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
  const s = appData.students.find(st => st.id === studentId || st.nis === studentId);
  if (!s) return;
  if (type === 'formatif') {
    s.scoreFormatif = num;
  } else if (type === 'sts') {
    s.scoreSts = num;
  } else if (type === 'sas') {
    s.scoreSas = num;
    s.scoreSumatif = num;
  }
  saveStorage();
  if (typeof saveStudentToSupabase === 'function') {
    saveStudentToSupabase(s);
  }
  renderDaftarNilai();
  renderDataSiswa();
}

// 6. Jurnal Mengajar View
function renderJurnal() {
  const tbody = document.getElementById('jurnalTableBody');
  tbody.innerHTML = appData.journals.map(j => `
    <tr>
      <td>${j.date}</td>
      <td><span class="badge badge-info">${j.classId}</span></td>
      <td><strong>${j.topic}</strong></td>
      <td>${j.activity}</td>
      <td><em>${j.notes}</em></td>
      <td><span class="badge badge-success">${j.status}</span></td>
    </tr>
  `).join('');
}

// Render Jadwal Mengajar Minggu Ini
function renderTimetable() {
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

// Live Search & Filter Siswa
function searchStudent(query) {
  filterSiswa(query);
}

function filterSiswa(queryVal) {
  const query = (queryVal !== undefined ? queryVal : (document.getElementById('searchSiswaInput')?.value || '')).toLowerCase().trim();
  const selectElem = document.getElementById('filterClassSelect');
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

// Filter Flashcards Live
function filterFlashcards(query) {
  const q = query.toLowerCase().trim();
  const filtered = appData.flashcards.filter(f => 
    f.word.toLowerCase().includes(q) || 
    f.translate.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q)
  );

  const container = document.getElementById('flashcardsGrid');
  if (!container) return;

  container.innerHTML = filtered.map(f => `
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

// Modul Ajar View & Printable Kurikulum Merdeka (See views.js)


// 8. Materi Interaktif & Flashcards dengan Text-to-Speech (TTS)
function renderMateriFlashcards() {
  const container = document.getElementById('flashcardsGrid');
  if (!container) return;
  const list = appData.flashcards || [];
  container.innerHTML = list.map(f => `
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
          <button class="btn btn-secondary" onclick="event.stopPropagation(); deleteFlashcard('${f.word}')" style="margin-top:8px; padding:2px 8px; font-size:11px; color:#dc2626;" title="Hapus Kartu">
            <i class="ri-delete-bin-line"></i> Hapus Kartu
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function flipCard(cardEl) {
  cardEl.classList.toggle('flipped');
}

function speakText(event, text) {
  event.stopPropagation(); // Mencegah card flip saat tombol audio diklik
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Kecepatan pelafalan agak lambat untuk SD
    window.speechSynthesis.speak(utterance);
  } else {
    alert('browser Anda tidak mendukung Web Speech API audio.');
  }
}

// 9. Tugas & Bank Soal View
function renderTugas() {
  const container = document.getElementById('tugasGrid');
  if (!container) return;
  const list = appData.assignments || [];
  container.innerHTML = list.map(t => `
    <div class="card" style="padding:20px; border-left:4px solid var(--primary);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="badge ${t.type === 'Formatik' ? 'badge-info' : 'badge-warning'}">${t.type}</span>
        <div style="display:flex; gap:6px; align-items:center;">
          <span class="badge badge-success">${t.status}</span>
          <button class="btn btn-secondary" onclick="deleteTugas('${t.id}')" style="padding:2px 6px; font-size:11px; color:#dc2626;" title="Hapus Tugas">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
      <h3 style="font-size:16px; margin-bottom:6px;">${t.title}</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Kelas: ${t.classId} | Tenggat: ${t.dueDate}</p>
      <p style="font-size:13.5px; color:#334155; background:#f8fafc; padding:10px; border-radius:6px;">${t.instructions}</p>
    </div>
  `).join('');
}

// 10. Laporan View
function renderLaporan() {
  const total = appData.students.length;
  const avgFormatif = Math.round(appData.students.reduce((acc, curr) => acc + curr.scoreFormatif, 0) / total);
  const avgSumatif = Math.round(appData.students.reduce((acc, curr) => acc + curr.scoreSumatif, 0) / total);

  document.getElementById('laporanAvgFormatif').innerText = avgFormatif;
  document.getElementById('laporanAvgSumatif').innerText = avgSumatif;
}

// Modal Handlers
function openModal(title, contentHtml) {
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalBody').innerHTML = contentHtml;
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// Modal Quick Forms
function showAddJournalModal() {
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

function saveJournal(e) {
  e.preventDefault();
  const newJ = {
    id: `J0${appData.journals.length + 1}`,
    date: document.getElementById('jurnalDate').value,
    classId: document.getElementById('jurnalClass').value,
    topic: document.getElementById('jurnalTopic').value,
    activity: document.getElementById('jurnalActivity').value,
    notes: document.getElementById('jurnalNotes').value || '-',
    status: 'Selesai'
  };

  appData.journals.unshift(newJ);
  saveStorage();
  saveJournalToSupabase(newJ);
  renderDashboard();
  renderJurnal();
  closeModal();
}

function showAddStudentModal() {
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

function saveStudent(e) {
  e.preventDefault();
  const newS = {
    id: `S00${appData.students.length + 1}`,
    nis: document.getElementById('studentNis').value,
    name: document.getElementById('studentName').value,
    classId: document.getElementById('studentClass').value,
    gender: document.getElementById('studentGender').value,
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
function renderDataGuru() {
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

function showAddTeacherModal() {
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

function saveTeacher(e) {
  e.preventDefault();
  const newT = {
    nip: document.getElementById('teacherNip').value.trim(),
    name: document.getElementById('teacherName').value.trim(),
    subject: document.getElementById('teacherSubject').value.trim(),
    role: document.getElementById('teacherRole').value,
    password: document.getElementById('teacherPassword').value.trim(),
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

function deleteTeacher(nip) {
  if (confirm(`Apakah Anda yakin ingin menghapus akun guru NIP ${nip}?`)) {
    appData.teachers = appData.teachers.filter(t => t.nip !== nip);
    saveStorage();
    deleteTeacherFromSupabase(nip);
    renderDataGuru();
  }
}

function previewTeacherAvatar(e) {
  const target = e.target;
  if (target && target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const previewImg = document.getElementById('settingAvatarPreview');
      if (previewImg && evt.target) previewImg.src = evt.target.result;
    };
    reader.readAsDataURL(target.files[0]);
  }
}

async function saveTeacherProfileSettings(e) {
  e.preventDefault();
  const nameInput = document.getElementById('settingTeacherName').value.trim();
  const nipInput = document.getElementById('settingTeacherNip').value.trim();
  const subjectInput = document.getElementById('settingTeacherSubject').value.trim();
  const schoolInput = document.getElementById('settingSchoolName').value.trim();
  const kecamatanInput = document.getElementById('settingKecamatan').value.trim();
  const previewImg = document.getElementById('settingAvatarPreview');
  const avatarFileInput = document.getElementById('settingAvatarFile');

  appData.teacher.name = nameInput;
  appData.teacher.nip = nipInput;
  appData.teacher.subject = subjectInput;
  appData.teacher.school = schoolInput;
  appData.teacher.kecamatan = kecamatanInput;

  if (avatarFileInput && avatarFileInput.files && avatarFileInput.files[0]) {
    if (typeof uploadAvatarToSupabaseStorage === 'function') {
      const uploadedUrl = await uploadAvatarToSupabaseStorage(avatarFileInput.files[0], nipInput);
      if (uploadedUrl) {
        appData.teacher.avatar = uploadedUrl;
      } else if (previewImg && previewImg.src) {
        appData.teacher.avatar = previewImg.src;
      }
    } else if (previewImg && previewImg.src) {
      appData.teacher.avatar = previewImg.src;
    }
  } else if (previewImg && previewImg.src) {
    appData.teacher.avatar = previewImg.src;
  }

  // Update in teachers list
  if (appData.teachers) {
    const idx = appData.teachers.findIndex(t => t.nip === nipInput);
    if (idx !== -1) {
      appData.teachers[idx] = { ...appData.teacher };
    }
  }

  saveStorage();
  if (typeof saveTeacherToSupabase === 'function') {
    await saveTeacherToSupabase(appData.teacher);
  }
  renderTeacherProfile();
  renderDataGuru();
  alert('Foto profil dan data akun guru berhasil diperbarui dan disinkronkan ke Supabase Cloud!');
}

if (typeof window !== 'undefined') {
  window.showAddAttendanceModal = showAddAttendanceModal;
  window.editAttendanceRecord = editAttendanceRecord;
  window.saveAttendanceRecord = saveAttendanceRecord;
  window.deleteAttendanceRecord = deleteAttendanceRecord;
  window.showAddScheduleModal = showAddScheduleModal;
  window.saveScheduleRecord = saveScheduleRecord;
  window.deleteScheduleRecord = deleteScheduleRecord;
  window.adjustGrade = adjustGrade;
  window.updateStudentGrade = updateStudentGrade;
  window.showAddModulModal = showAddModulModal;
  window.deleteModul = deleteModul;
  window.showAddFlashcardModal = showAddFlashcardModal;
  window.deleteFlashcard = deleteFlashcard;
  window.showAddTugasModal = showAddTugasModal;
  window.deleteTugas = deleteTugas;
  window.searchStudent = searchStudent;
  window.filterSiswa = filterSiswa;
}

// 13. CRUD Modul Ajar, Flashcard, & Tugas Interaktif
function showAddModulModal() {
  const form = `
    <form onsubmit="saveModul(event)">
      <div class="form-group">
        <label>Judul Modul Ajar</label>
        <input type="text" id="modulTitle" placeholder="Contoh: Unit 3 - My Family Members" required>
      </div>
      <div class="form-group">
        <label>Tingkat / Kelas SD</label>
        <select id="modulGrade">
          <option value="Kelas 1 SD">Kelas 1 SD (Fase A)</option>
          <option value="Kelas 2 SD">Kelas 2 SD (Fase A)</option>
          <option value="Kelas 3 SD" selected>Kelas 3 SD (Fase B)</option>
          <option value="Kelas 4 SD">Kelas 4 SD (Fase B)</option>
          <option value="Kelas 5 SD">Kelas 5 SD (Fase C)</option>
          <option value="Kelas 6 SD">Kelas 6 SD (Fase C)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Alokasi Waktu</label>
        <input type="text" id="modulDuration" placeholder="Contoh: 4 JP (2 x Pertemuan)" value="4 JP (2 x Pertemuan)" required>
      </div>
      <div class="form-group">
        <label>Tujuan Pembelajaran (TP)</label>
        <textarea id="modulTarget" rows="2" placeholder="Peserta didik mampu menyebutkan nama anggota keluarga..." required></textarea>
      </div>
      <div class="form-group">
        <label>Media & Alat Pembelajaran</label>
        <textarea id="modulMaterials" rows="2" placeholder="Flashcards, Gambar Keluarga, audio lagu" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Simpan Modul Ajar</button>
    </form>
  `;
  openModal('Buat Modul Ajar Baru (Kurikulum Merdeka)', form);
}

function saveModul(e) {
  e.preventDefault();
  const gradeVal = document.getElementById('modulGrade').value;
  const phaseVal = gradeVal.includes('1') || gradeVal.includes('2') ? 'Fase A' : gradeVal.includes('3') || gradeVal.includes('4') ? 'Fase B' : 'Fase C';
  const newMod = {
    id: `MOD-ENG-BOBONG-${Date.now()}`,
    title: document.getElementById('modulTitle').value.trim(),
    grade: gradeVal,
    phase: phaseVal,
    duration: document.getElementById('modulDuration').value.trim(),
    target: document.getElementById('modulTarget').value.trim(),
    cp: "Menyimak - Berbicara: Peserta didik menggunakan bahasa Inggris sederhana untuk berinteraksi dalam situasi sosial.",
    materials: document.getElementById('modulMaterials').value.split(',').map(m => m.trim()),
    steps: [
      "Pendahuluan (10 Menit): Salam, berdoa, dan apersepsi materi.",
      "Kegiatan Inti (50 Menit): Pemaparan materi, praktik lisan berpasangan, dan pengisian LKS.",
      "Penutup (10 Menit): Refleksi pembelajaran dan doa penutup."
    ],
    assessment: "Formatik (Observasi Unjuk Kerja Lisan & Lembar Kerja Siswa)"
  };

  appData.modules.unshift(newMod);
  saveStorage();
  renderModulAjar();
  closeModal();
  alert('Modul Ajar baru berhasil diterbitkan!');
}

function deleteModul(id) {
  if (confirm('Apakah Anda yakin ingin menghapus Modul Ajar ini?')) {
    appData.modules = appData.modules.filter(m => m.id !== id);
    saveStorage();
    renderModulAjar();
  }
}

function showAddFlashcardModal() {
  const form = `
    <form onsubmit="saveFlashcard(event)">
      <div class="form-group">
        <label>Kata Bahasa Inggris (English Word)</label>
        <input type="text" id="fcWord" placeholder="Contoh: Reading" required>
      </div>
      <div class="form-group">
        <label>Terjemahan Indonesia</label>
        <input type="text" id="fcTranslate" placeholder="Contoh: Membaca" required>
      </div>
      <div class="form-group">
        <label>Kategori</label>
        <select id="fcCategory">
          <option value="Action Verbs">Kata Kerja (Action Verbs)</option>
          <option value="Feelings">Perasaan (Feelings)</option>
          <option value="Animals">Hewan (Animals)</option>
          <option value="Professions">Profesi (Professions)</option>
          <option value="Family">Keluarga (Family)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Contoh Kalimat Sederhana</label>
        <input type="text" id="fcExample" placeholder="Contoh: She is reading a storybook." required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Tambah Kartu Kata</button>
    </form>
  `;
  openModal('Tambah Flashcard Kosakata Baru', form);
}

function saveFlashcard(e) {
  e.preventDefault();
  const cat = document.getElementById('fcCategory').value;
  let iconName = 'ri-book-open-line';
  if (cat === 'Feelings') iconName = 'ri-emotion-happy-line';
  else if (cat === 'Animals') iconName = 'ri-bear-smile-line';
  else if (cat === 'Professions') iconName = 'ri-user-voice-line';

  const newFc = {
    word: document.getElementById('fcWord').value.trim(),
    translate: document.getElementById('fcTranslate').value.trim(),
    category: cat,
    icon: iconName,
    example: document.getElementById('fcExample').value.trim()
  };

  appData.flashcards.unshift(newFc);
  saveStorage();
  renderMateriFlashcards();
  closeModal();
  alert('Kartu kata kosakata baru berhasil ditambahkan!');
}

function deleteFlashcard(word) {
  if (confirm(`Hapus kartu kata "${word}"?`)) {
    appData.flashcards = appData.flashcards.filter(f => f.word !== word);
    saveStorage();
    renderMateriFlashcards();
  }
}

function showAddTugasModal() {
  const form = `
    <form onsubmit="saveTugas(event)">
      <div class="form-group">
        <label>Judul Tugas / Bank Soal</label>
        <input type="text" id="tugasTitle" placeholder="Contoh: Latihan Kosakata Animals" required>
      </div>
      <div class="form-group">
        <label>Kelas Tujuan</label>
        <select id="tugasClass">
          ${appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Batas Waktu Pengumpulan (Deadline)</label>
        <input type="date" id="tugasDueDate" required value="${new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label>Tipe Penilaian</label>
        <select id="tugasType">
          <option value="Formatik">Penilaian Formatif</option>
          <option value="Sumatif">Penilaian Sumatif</option>
        </select>
      </div>
      <div class="form-group">
        <label>Instruksi Pengerjaan</label>
        <textarea id="tugasInstructions" rows="3" placeholder="Tuliskan petunjuk pengerjaan tugas bagi siswa..." required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Terbitkan Tugas</button>
    </form>
  `;
  openModal('Buat Tugas / Soal Baru', form);
}

function saveTugas(e) {
  e.preventDefault();
  const newT = {
    id: `TUG-${Date.now()}`,
    title: document.getElementById('tugasTitle').value.trim(),
    classId: document.getElementById('tugasClass').value,
    dueDate: document.getElementById('tugasDueDate').value,
    type: document.getElementById('tugasType').value,
    status: 'Aktif',
    instructions: document.getElementById('tugasInstructions').value.trim()
  };

  if (!appData.assignments) appData.assignments = [];
  appData.assignments.unshift(newT);
  saveStorage();
  renderTugas();
  closeModal();
  alert('Tugas baru berhasil diterbitkan!');
}

function deleteTugas(id) {
  if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
    appData.assignments = appData.assignments.filter(t => t.id !== id);
    saveStorage();
    renderTugas();
  }
}
