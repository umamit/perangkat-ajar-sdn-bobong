// Application Main Script for Perangkat Ajar Guru Bahasa Inggris SD Negeri Bobong

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwpXkZ1t6rKBb1hvZdEpmPKc-SRNV-41pRxw7Sr9TPz6WC65RdlFoI4ZI9p-FgEJxd30w/exec";

let appData = { ...INITIAL_DATA };

// Helper Kirim Data Real-Time ke Google Sheets
function sendToGoogleSheets(targetSheet, payload) {
  if (!GOOGLE_SCRIPT_URL) return;
  fetch(`${GOOGLE_SCRIPT_URL}?targetSheet=${targetSheet}`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(() => {
    console.log(`[Google Sheets] Data tersimpan di sheet ${targetSheet}`);
  }).catch(err => {
    console.error(`[Google Sheets Error]`, err);
  });
}

// Load data from LocalStorage if exists
function loadStorage() {
  const saved = localStorage.getItem('sdn_bobong_app_data');
  if (saved) {
    try {
      appData = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse localStorage appData:', e);
    }
  }
}

function saveStorage() {
  localStorage.setItem('sdn_bobong_app_data', JSON.stringify(appData));
}

document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  checkAuthSession();
  initApp();
});

function checkAuthSession() {
  const isLoggedIn = sessionStorage.getItem('sdn_bobong_auth') === 'true';
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

  // Credential check
  const validNip = appData.teacher.nip; // 199610272019032006
  const validPassword = appData.teacher.password; // kepseksdnbobong

  if (inputNip === validNip && inputPassword === validPassword) {
    if (alertEl) alertEl.style.display = 'none';
    sessionStorage.setItem('sdn_bobong_auth', 'true');
    checkAuthSession();
  } else {
    if (alertEl) {
      alertEl.style.display = 'flex';
      alertEl.innerHTML = `<i class="ri-error-warning-line"></i> NIP atau Password salah. Silakan periksa kembali!`;
    }
  }
}

function handleLogout() {
  sessionStorage.removeItem('sdn_bobong_auth');
  checkAuthSession();
  document.getElementById('loginNip').value = '';
  document.getElementById('loginPassword').value = '';
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
  const teacher = appData.teacher;
  if (document.getElementById('teacherNameSidebar')) document.getElementById('teacherNameSidebar').innerText = teacher.name;
  if (document.getElementById('teacherNipSidebar')) document.getElementById('teacherNipSidebar').innerText = `NIP: ${teacher.nip}`;
  if (document.getElementById('teacherAvatarSidebar')) document.getElementById('teacherAvatarSidebar').src = teacher.avatar;
  if (document.getElementById('schoolNameHeader')) document.getElementById('schoolNameHeader').innerText = teacher.school;
  if (document.getElementById('schoolKecamatanHeader')) document.getElementById('schoolKecamatanHeader').innerText = teacher.kecamatan;
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
  grid.innerHTML = appData.classes.map(c => `
    <div class="card" style="padding: 20px;">
      <div style="display:flex; justify-shadow:space-between; align-items:center; margin-bottom:10px;">
        <span class="badge badge-info">${c.phase}</span>
        <i class="ri-building-line" style="font-size:24px; color:var(--primary);"></i>
      </div>
      <h3 style="margin-bottom:6px; font-size:18px;">${c.name}</h3>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:12px;">${c.room}</p>
      <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; border-top:1px solid #e2e8f0; padding-top:10px;">
        <span>Jumlah Siswa:</span>
        <span style="color:var(--primary);">${c.count} Orang</span>
      </div>
    </div>
  `).join('');
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
          <div class="flashcard-emoji">${f.emoji}</div>
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

// Ekspor Data Siswa ke CSV
function exportSiswaToCSV() {
  let csv = 'No,NIS,Nama Siswa,Kelas,Jenis Kelamin,Nilai Formatif,Nilai Sumatif\n';
  appData.students.forEach((s, idx) => {
    csv += `${idx + 1},"${s.nis}","${s.name}","${s.classId}","${s.gender}",${s.scoreFormatif},${s.scoreSumatif}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Data_Siswa_SDN_Bobong_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Ekspor Rekap Nilai ke CSV
function exportNilaiToCSV() {
  let csv = 'No,Nama Siswa,Kelas,Rata-rata Formatif,Nilai Sumatif,Nilai Akhir,Predikat\n';
  appData.students.forEach((s, idx) => {
    const finalScore = Math.round((s.scoreFormatif * 0.4) + (s.scoreSumatif * 0.6));
    const grade = finalScore >= 90 ? 'A (Sangat Baik)' : finalScore >= 80 ? 'B (Baik)' : 'C (Cukup)';
    csv += `${idx + 1},"${s.name}","${s.classId}",${s.scoreFormatif},${s.scoreSumatif},${finalScore},"${grade}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Daftar_Nilai_SDN_Bobong_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Kuis Game Interaktif Bahasa Inggris
let quizState = { currentIndex: 0, score: 0 };

function startEnglishQuiz() {
  quizState.currentIndex = 0;
  quizState.score = 0;
  const quizBox = document.getElementById('quizContainer');
  if (quizBox) {
    quizBox.style.display = 'block';
    renderQuizQuestion();
  }
}

function renderQuizQuestion() {
  const quizBox = document.getElementById('quizContainer');
  const q = appData.quizQuestions[quizState.currentIndex];

  if (!q) {
    quizBox.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <h2 style="color:var(--primary-dark); font-size:22px; margin-bottom:8px;">🎉 Selamat! Kuis Selesai!</h2>
        <p style="font-size:16px; margin-bottom:16px;">Skor Akhir: <strong>${quizState.score} / ${appData.quizQuestions.length * 25} Point</strong></p>
        <button class="btn btn-primary" onclick="startEnglishQuiz()">Mainkan Lagi</button>
      </div>
    `;
    return;
  }

  quizBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <strong style="font-size:13px; color:var(--primary-dark);">Soal Nomor ${quizState.currentIndex + 1} dari ${appData.quizQuestions.length}</strong>
      <span class="badge badge-success">Skor: ${quizState.score}</span>
    </div>
    <h3 style="font-size:16px; margin-bottom:16px; color:#1e293b;">${q.question}</h3>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
      ${q.options.map(opt => `
        <button class="btn btn-secondary" onclick="checkQuizAnswer('${opt}')" style="justify-content:flex-start; text-align:left; padding:12px;">
          ${opt}
        </button>
      `).join('')}
    </div>
  `;
}

function checkQuizAnswer(selectedOption) {
  const q = appData.quizQuestions[quizState.currentIndex];
  if (selectedOption === q.answer) {
    quizState.score += 25;
    alert('✅ Benar Sekali! Great Job! 🎉');
  } else {
    alert(`❌ Kurang Tepat. Jawaban yang benar: "${q.answer}"`);
  }
  quizState.currentIndex++;
  renderQuizQuestion();
}

// 7. Modul Ajar View (Printable Kurikulum Merdeka & LKPD)
function renderModulAjar() {
  const container = document.getElementById('modulAjarList');
  container.innerHTML = appData.modules.map(m => `
    <div class="module-card">
      <div class="module-header">
        <div>
          <span class="badge badge-info" style="margin-bottom:6px;">${m.grade} - ${m.phase}</span>
          <h3>${m.title}</h3>
          <p style="font-size:13px; color:var(--text-muted);"><i class="ri-time-line"></i> Alokasi Waktu: ${m.duration}</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="printWorksheet('${m.id}')">
            <i class="ri-file-text-line"></i> Cetak LKPD Siswa
          </button>
          <button class="btn btn-primary" onclick="printModule('${m.id}')">
            <i class="ri-printer-line"></i> Cetak Modul Ajar
          </button>
        </div>
      </div>
      <hr style="margin: 12px 0; border:0; border-top:1px solid #e2e8f0;">
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; font-size:13.5px;">
        <div>
          <strong style="color:var(--primary-dark);">Target Capaian Pembelajaran (CP):</strong>
          <p style="margin-top:4px; color:#334155;">${m.cp}</p>
        </div>
        <div>
          <strong style="color:var(--primary-dark);">Tujuan Pembelajaran:</strong>
          <p style="margin-top:4px; color:#334155;">${m.target}</p>
        </div>
      </div>
      <div style="margin-top:14px; background:#f8fafc; padding:12px; border-radius:8px;">
        <strong style="font-size:13px;">Langkah-Langkah Aktivitas Pembelajaran:</strong>
        <ol style="margin-left:20px; margin-top:6px; font-size:13px; color:#475569;">
          ${m.steps.map(step => `<li style="margin-bottom:4px;">${step}</li>`).join('')}
        </ol>
      </div>
    </div>
  `).join('');
}

// Cetak LKPD (Lembar Kerja Peserta Didik)
function printWorksheet(moduleId) {
  const mod = appData.modules.find(m => m.id === moduleId);
  if (!mod) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>LKPD Siswa - ${mod.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #111; line-height:1.5; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom:20px; }
          .student-box { border: 1px solid #000; padding: 10px; margin-bottom: 20px; font-size:14px; }
          .section-title { font-weight: bold; font-size: 15px; margin-top: 20px; }
          .task-box { border: 1px dashed #666; padding: 15px; margin-top: 10px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin:0;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
          <h3 style="margin:5px 0 0 0;">SD NEGERI BOBONG - KECAMATAN TALIABU BARAT</h3>
          <p style="margin:2px 0 0 0; font-size:13px;">Mata Pelajaran: Bahasa Inggris (${mod.grade})</p>
        </div>

        <div class="student-box">
          <table style="width:100%; border:none;">
            <tr><td><strong>Nama Siswa:</strong> ____________________</td><td><strong>Kelas:</strong> ________</td></tr>
            <tr><td><strong>Hari / Tanggal:</strong> __________________</td><td><strong>Nilai:</strong> ________</td></tr>
          </table>
        </div>

        <div class="section-title">Materi: ${mod.title}</div>
        <p style="font-size:13.5px;">Tujuan Pembelajaran: ${mod.target}</p>

        <div class="task-box">
          <strong>Latihan 1: Jodohkan Gambar & Kosakata yang Tepat!</strong>
          <ol style="margin-top:10px;">
            <li style="margin-bottom:12px;">Reading &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ( &nbsp;&nbsp; ) &nbsp;&nbsp; a. Makan</li>
            <li style="margin-bottom:12px;">Eating &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ( &nbsp;&nbsp; ) &nbsp;&nbsp; b. Membaca</li>
            <li style="margin-bottom:12px;">Writing &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ( &nbsp;&nbsp; ) &nbsp;&nbsp; c. Minum</li>
            <li style="margin-bottom:12px;">Drinking &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ( &nbsp;&nbsp; ) &nbsp;&nbsp; d. Menulis</li>
          </ol>
        </div>

        <div class="task-box" style="margin-top:20px;">
          <strong>Latihan 2: Buatlah 2 Kalimat Sederhana dalam Bahasa Inggris!</strong>
          <br><br>
          1. ____________________________________________________________________
          <br><br>
          2. ____________________________________________________________________
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function printModule(moduleId) {
  const mod = appData.modules.find(m => m.id === moduleId);
  if (!mod) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Modul Ajar - ${mod.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height:1.6; }
          h1 { font-size: 20px; text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .meta-table td { padding: 8px; border: 1px solid #ccc; font-size: 14px; }
          .section-title { font-weight: bold; background: #f0f0f0; padding: 6px 10px; margin-top: 20px; font-size: 15px; }
          ol { margin-left: 20px; }
        </style>
      </head>
      <body>
        <h1>PERANGKAT AJAR KURIKULUM MERDEKA<br>SD NEGERI BOBONG - KECAMATAN TALIABU BARAT</h1>
        <table class="meta-table">
          <tr><td><strong>Satuan Pendidikan</strong></td><td>SD Negeri Bobong</td></tr>
          <tr><td><strong>Kecamatan</strong></td><td>Kecamatan Taliabu Barat</td></tr>
          <tr><td><strong>Guru Mata Pelajaran</strong></td><td>Guru Bahasa Inggris SD</td></tr>
          <tr><td><strong>NIP Guru</strong></td><td>199610272019032006</td></tr>
          <tr><td><strong>Mata Pelajaran</strong></td><td>Bahasa Inggris SD (${mod.grade})</td></tr>
          <tr><td><strong>Judul Modul</strong></td><td>${mod.title}</td></tr>
          <tr><td><strong>Fase / Alokasi Waktu</strong></td><td>${mod.phase} / ${mod.duration}</td></tr>
        </table>

        <div class="section-title">A. CAPAIAN PEMBELAJARAN (CP)</div>
        <p>${mod.cp}</p>

        <div class="section-title">B. TUJUAN PEMBELAJARAN</div>
        <p>${mod.target}</p>

        <div class="section-title">C. MEDIA & MATERI PEMBELAJARAN</div>
        <ul>
          ${mod.materials.map(mat => `<li>${mat}</li>`).join('')}
        </ul>

        <div class="section-title">D. KEGIATAN PEMBELAJARAN</div>
        <ol>
          ${mod.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>

        <div class="section-title">E. ASESMEN PEMBELAJARAN</div>
        <p>${mod.assessment}</p>

        <br><br>
        <table style="width:100%; border:none; margin-top:40px;">
          <tr>
            <td style="border:none; text-align:center;">Mengetahui,<br>Kepala SD Negeri Bobong<br><br><br><br>______________________</td>
            <td style="border:none; text-align:center;">Bobong, Taliabu Barat<br>Guru Mata Pelajaran<br><br><br><br><strong>Guru Bahasa Inggris</strong><br>NIP. 199610272019032006</td>
          </tr>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// 8. Materi Interaktif & Flashcards dengan Text-to-Speech (TTS)
function renderMateriFlashcards() {
  const container = document.getElementById('flashcardsGrid');
  container.innerHTML = appData.flashcards.map(f => `
    <div class="flashcard" onclick="flipCard(this)">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="flashcard-emoji">${f.emoji}</div>
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
  sendToGoogleSheets("Jurnal", newJ);
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
  sendToGoogleSheets("Siswa", newS);
  renderDashboard();
  renderDataSiswa();
  renderDaftarNilai();
  closeModal();
}
