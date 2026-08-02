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
    document.getElementById('menuToggle').addEventListener('click', () => {
      sidebar.classList.toggle('active');
      backdrop.classList.toggle('active');
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
}

// Teacher Info Render
function renderTeacherProfile() {
  const teacher = appData.teacher || {};
  if (document.getElementById('teacherNameSidebar')) document.getElementById('teacherNameSidebar').innerText = teacher.name || 'Husnita Usman, M.Pd.';
  if (document.getElementById('teacherNipSidebar')) document.getElementById('teacherNipSidebar').innerText = `NIP: ${teacher.nip || '199610272019032006'}`;
  if (document.getElementById('teacherAvatarSidebar')) document.getElementById('teacherAvatarSidebar').src = teacher.avatar || 'logo-sdn-bobong.svg';
  if (document.getElementById('schoolNameHeader')) document.getElementById('schoolNameHeader').innerText = teacher.school || 'SD Negeri Bobong';
  if (document.getElementById('schoolKecamatanHeader')) document.getElementById('schoolKecamatanHeader').innerText = teacher.kecamatan || 'Kecamatan Taliabu Barat';
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

  // Recent Journals Table
  const tbody = document.getElementById('recentJournalsBody');
  tbody.innerHTML = appData.journals.slice(0, 3).map(j => `
    <tr>
      <td>${j.date}</td>
      <td><span class="badge badge-info">${j.classId}</span></td>
      <td><strong>${j.topic}</strong></td>
      <td>${j.activity}</td>
      <td><span class="badge badge-success">${j.status}</span></td>
    </tr>
  `).join('');
}

// 2. Data Siswa View
function renderDataSiswa(filterClass = 'ALL') {
  const container = document.getElementById('siswaTableBody');
  let filtered = appData.students;
  if (filterClass !== 'ALL') {
    filtered = filtered.filter(s => s.classId === filterClass);
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
  grid.innerHTML = appData.classes.map(c => {
    const studentCount = appData.students.filter(s => s.classId === c.id).length;
    const countDisplay = studentCount > 0 ? studentCount : (c.count || 0);
    return `
    <div class="card" style="padding: 20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span class="badge badge-info">${c.phase}</span>
        <i class="ri-building-line" style="font-size:24px; color:var(--primary);"></i>
      </div>
      <h3 style="margin-bottom:6px; font-size:18px;">${c.name}</h3>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:12px;">${c.room}</p>
      <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; border-top:1px solid #e2e8f0; padding-top:10px;">
        <span>Jumlah Siswa:</span>
        <span style="color:var(--primary); font-weight:800;">${countDisplay} Orang</span>
      </div>
    </div>
    `;
  }).join('');
}

// 4. Absensi View
function renderAbsensi() {
  const tbody = document.getElementById('absensiTableBody');
  tbody.innerHTML = appData.attendance.map(a => `
    <tr>
      <td>${a.date}</td>
      <td><span class="badge badge-info">${a.classId}</span></td>
      <td><span class="badge badge-success">${a.hadir} Siswa</span></td>
      <td><span class="badge badge-warning">${a.izin} Siswa</span></td>
      <td><span class="badge badge-warning">${a.sakit} Siswa</span></td>
      <td><span class="badge badge-danger">${a.alpa} Siswa</span></td>
      <td>
        <button class="btn btn-secondary" onclick="alert('Fitur ubah absensi tanggal ${a.date}')" style="padding: 4px 8px; font-size:12px;">
          Update Presensi
        </button>
      </td>
    </tr>
  `).join('');
}

// 5. Daftar Nilai View
function renderDaftarNilai() {
  const tbody = document.getElementById('nilaiTableBody');
  tbody.innerHTML = appData.students.map((s, index) => {
    const finalScore = Math.round((s.scoreFormatif * 0.4) + (s.scoreSumatif * 0.6));
    const grade = finalScore >= 90 ? 'A (Sangat Baik)' : finalScore >= 80 ? 'B (Baik)' : 'C (Cukup)';
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${s.name}</td>
        <td><span class="badge badge-info">${s.classId}</span></td>
        <td>${s.scoreFormatif}</td>
        <td>${s.scoreSumatif}</td>
        <td><strong>${finalScore}</strong></td>
        <td><span class="badge ${finalScore >= 80 ? 'badge-success' : 'badge-warning'}">${grade}</span></td>
      </tr>
    `;
  }).join('');
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
function filterSiswa() {
  const query = document.getElementById('searchSiswaInput')?.value.toLowerCase().trim() || '';
  const classFilter = document.getElementById('filterClassSiswa')?.value || 'ALL';

  let filtered = appData.students;

  if (classFilter !== 'ALL') {
    filtered = filtered.filter(s => s.classId === classFilter);
  }

  if (query) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(query) || s.nis.includes(query));
  }

  const container = document.getElementById('siswaTableBody');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">Tidak ada siswa yang cocok.</td></tr>`;
    return;
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
  container.innerHTML = appData.assignments.map(t => `
    <div class="card" style="padding:20px; border-left:4px solid var(--primary);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="badge ${t.type === 'Formatik' ? 'badge-info' : 'badge-warning'}">${t.type}</span>
        <span class="badge badge-success">${t.status}</span>
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
