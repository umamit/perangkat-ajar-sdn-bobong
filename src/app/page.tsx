'use client';

import { useEffect } from 'react';
import { appData, loadStorage, syncFromSupabase } from '../helpers';
import { checkAuthSession } from '../modules/checkAuthSession';
import { handleLogin } from '../modules/handleLogin';
import { handleLogout } from '../modules/handleLogout';
import { renderTeacherProfile } from '../modules/renderTeacherProfile';
import { saveTeacherProfileSettings } from '../modules/saveTeacherProfileSettings';
import { previewTeacherAvatar } from '../modules/previewTeacherAvatar';
import { renderDataGuru } from '../modules/renderDataGuru';
import { deleteTeacher } from '../modules/deleteTeacher';

import { renderDataSiswa } from '../modules/renderDataSiswa';
import { filterSiswa } from '../modules/filterSiswa';
import { searchStudent } from '../modules/searchStudent';
import { showAddStudentModal } from '../modules/showAddStudentModal';
import { showEditStudentModal } from '../modules/showEditStudentModal';
import { saveStudent } from '../modules/saveStudent';
import { saveEditStudent } from '../modules/saveEditStudent';
import { deleteStudent } from '../modules/deleteStudent';
import { showImportStudentModal } from '../modules/showImportStudentModal';
import { downloadStudentTemplate } from '../modules/downloadStudentTemplate';
import { executeDirectImport } from '../modules/executeDirectImport';
import { renderDataKelas } from '../modules/renderDataKelas';

import { renderDashboard } from '../modules/renderDashboard';
import { renderAbsensi } from '../modules/renderAbsensi';
import { renderAbsensiForm } from '../modules/renderAbsensiForm';
import { setAbsensiStatus } from '../modules/setAbsensiStatus';
import { saveAbsensi } from '../modules/saveAbsensi';

import { renderDaftarNilai } from '../modules/renderDaftarNilai';
import { filterNilaiByClass } from '../modules/filterNilaiByClass';
import { adjustGrade } from '../modules/adjustGrade';
import { updateStudentGrade } from '../modules/updateStudentGrade';

import { renderJurnal } from '../modules/renderJurnal';
import { showAddJournalModal } from '../modules/showAddJournalModal';
import { showEditJournalModal } from '../modules/showEditJournalModal';
import { saveJournal } from '../modules/saveJournal';
import { saveEditJournal } from '../modules/saveEditJournal';
import { deleteJournal } from '../modules/deleteJournal';
import { deleteModul } from '../modules/deleteModul';
import { showToast } from '../modules/showToast';

import { renderTimetable } from '../modules/renderTimetable';
import { renderMateriFlashcards } from '../modules/renderMateriFlashcards';
import { renderTugas } from '../modules/renderTugas';
import { renderLaporan } from '../modules/renderLaporan';

import { closeModal } from '../modules/closeModal';
import { closeMobileSidebar } from '../modules/closeMobileSidebar';
import { setupNavigation } from '../modules/setupNavigation';
import { switchView } from '../modules/switchView';
import { switchRoleMode } from '../modules/switchRoleMode';

import { showAddTeacherModal } from '../modules/showAddTeacherModal';
import { saveTeacher } from '../modules/saveTeacher';
import { showAddModulModal } from '../modules/showAddModulModal';
import { saveModul } from '../modules/saveModul';
import { showAddTugasModal } from '../modules/showAddTugasModal';
import { saveTugas } from '../modules/saveTugas';
import { showAddFlashcardModal } from '../modules/showAddFlashcardModal';
import { saveFlashcard } from '../modules/saveFlashcard';
import { filterFlashcards } from '../modules/filterFlashcards';
import { showAddScheduleModal } from '../modules/showAddScheduleModal';
import { saveSchedule } from '../modules/saveSchedule';
import { handleManualSync } from '../modules/handleManualSync';

import {
  renderModulAjar,
  exportSiswaToCSV,
  exportNilaiToCSV,
  startEnglishQuiz,
  renderQuizQuestion,
  checkQuizAnswer,
  printWorksheet,
  printModule
} from '../views';

export default function Page() {
  useEffect(() => {
    // Bind all handlers to global window object
    const w = window as any;
    w.handleLogin = handleLogin;
    w.handleLogout = handleLogout;
    w.showAddJournalModal = showAddJournalModal;
    w.showEditJournalModal = showEditJournalModal;
    w.saveJournal = saveJournal;
    w.saveEditJournal = saveEditJournal;
    w.showAddTeacherModal = showAddTeacherModal;
    w.saveTeacher = saveTeacher;
    w.deleteTeacher = deleteTeacher;
    w.showAddStudentModal = showAddStudentModal;
    w.showEditStudentModal = showEditStudentModal;
    w.saveStudent = saveStudent;
    w.saveEditStudent = saveEditStudent;
    w.showAddModulModal = showAddModulModal;
    w.saveModul = saveModul;
    w.showAddTugasModal = showAddTugasModal;
    w.saveTugas = saveTugas;
    w.showAddFlashcardModal = showAddFlashcardModal;
    w.saveFlashcard = saveFlashcard;
    w.filterFlashcards = filterFlashcards;
    w.showAddScheduleModal = showAddScheduleModal;
    w.saveSchedule = saveSchedule;
    w.printModule = printModule;
    w.saveTeacherProfileSettings = saveTeacherProfileSettings;
    w.previewTeacherAvatar = previewTeacherAvatar;
    w.adjustGrade = adjustGrade;
    w.updateStudentGrade = updateStudentGrade;
    w.searchStudent = searchStudent;
    w.filterSiswa = filterSiswa;
    w.filterSiswaByClass = (val: string) => {
      const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
      if (selectElem) selectElem.value = val;
      renderDataSiswa(val);
    };
    w.filterNilaiByClass = filterNilaiByClass;
    w.renderAllViews = initApp;
    w.renderTeacherProfile = renderTeacherProfile;
    w.renderDataGuru = renderDataGuru;
    w.renderDashboard = renderDashboard;
    w.renderDataSiswa = renderDataSiswa;
    w.renderDaftarNilai = renderDaftarNilai;
    w.renderJurnal = renderJurnal;
    w.renderAbsensi = renderAbsensi;
    w.renderAbsensiForm = renderAbsensiForm;
    w.setAbsensiStatus = setAbsensiStatus;
    w.saveAbsensi = saveAbsensi;
    w.printWorksheet = printWorksheet;
    w.startEnglishQuiz = startEnglishQuiz;
    w.renderQuizQuestion = renderQuizQuestion;
    w.checkQuizAnswer = checkQuizAnswer;
    w.exportSiswaToCSV = exportSiswaToCSV;
    w.exportNilaiToCSV = exportNilaiToCSV;
    w.deleteStudent = deleteStudent;
    w.showImportStudentModal = showImportStudentModal;
    w.downloadStudentTemplate = downloadStudentTemplate;
    w.executeDirectImport = executeDirectImport;
    w.deleteJournal = deleteJournal;
    w.deleteModul = deleteModul;
    w.showToast = showToast;
    w.closeModal = closeModal;
    w.switchView = switchView;
    w.handleManualSync = handleManualSync;
    w.switchRoleMode = (mode: string) => switchRoleMode(mode, [renderDataKelas, renderDataSiswa, renderDaftarNilai, renderDashboard]);

    // Initialize application
    async function start() {
      loadStorage();
      checkAuthSession();
      await syncFromSupabase();
      initApp();
    }
    start();
  }, []);

  function initApp() {
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

    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');

    if (document.getElementById('menuToggle') && sidebar && backdrop) {
      const toggleBtn = document.getElementById('menuToggle')!;
      toggleBtn.onclick = () => {
        sidebar.classList.toggle('active');
        backdrop.classList.toggle('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.className = sidebar.classList.contains('active') ? 'ri-close-line' : 'ri-menu-line';
        }
      };
    }

    if (backdrop) backdrop.onclick = closeMobileSidebar;

    if (document.getElementById('modalOverlay')) {
      document.getElementById('modalOverlay')!.onclick = (e) => {
        if (e.target === document.getElementById('modalOverlay')) {
          closeModal();
        }
      };
    }
  }

  return (
    <>
      {/* Toast Notification Container */}
      <div id="toastContainer" className="toast-container"></div>

      {/* 1. FULLSCREEN LOGIN SCREEN */}
      <div id="loginScreen" className="login-wrapper">
        <div className="login-card">
          <div className="school-logo-container">
            <img
              src="/assets/logo-sdn-bobong.png"
              alt="Logo SD Negeri Bobong"
              className="sd-logo-img"
              style={{ width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.15))' }}
            />
          </div>

          <div className="login-header-text">
            <h2>SD NEGERI BOBONG</h2>
            <p className="sub-school">Kabupaten Pulau Taliabu</p>
          </div>

          <div id="loginErrorAlert" className="login-error-alert" style={{ display: 'none' }}>
            <i className="ri-error-warning-line"></i> NIP atau Password salah. Silakan periksa kembali!
          </div>

          <form id="loginForm" onSubmit={(e) => (window as any).handleLogin(e)}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="loginNip"><i className="ri-id-card-line"></i> NIP</label>
              <input type="text" id="loginNip" placeholder="Masukkan NIP" required autoComplete="username" />
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="loginPassword"><i className="ri-lock-password-line"></i> Password</label>
              <div className="password-input-wrapper">
                <input type="password" id="loginPassword" placeholder="Masukkan Password" required autoComplete="current-password" />
                <button type="button" className="toggle-password-btn" onClick={() => (window as any).togglePasswordVisibility()}>
                  <i className="ri-eye-line" id="togglePasswordIcon"></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-login">
              <i className="ri-login-box-line"></i> Masuk
            </button>
          </form>
        </div>
      </div>

      {/* 2. MAIN APPLICATION CONTENT */}
      <div className="app-container" id="appMainContent" style={{ display: 'none' }}>
        <aside className="sidebar" id="sidebar">
          <div>
            <div className="sidebar-header">
              <img src="/assets/logo-sdn-bobong.png" alt="Logo SD Negeri Bobong" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
              <div className="school-info">
                <h3 id="schoolNameHeader">SD Negeri Bobong</h3>
                <p id="schoolKecamatanHeader">Kab. Pulau Taliabu</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              <a className="nav-item active" data-view="dashboard">
                <i className="ri-grid-fill"></i> Dashboard
              </a>
              <a className="nav-item" data-view="siswa">
                <i className="ri-group-line"></i> Data Siswa
              </a>
              <a className="nav-item" data-view="kelas">
                <i className="ri-community-line"></i> Data Kelas
              </a>
              <a className="nav-item" data-view="absensi">
                <i className="ri-checkbox-line"></i> Absensi
              </a>
              <a className="nav-item" data-view="nilai">
                <i className="ri-graduation-cap-line"></i> Daftar Nilai
              </a>
              <a className="nav-item" data-view="jurnal">
                <i className="ri-book-read-line"></i> Jurnal Mengajar
              </a>
              <a className="nav-item" data-view="modul">
                <i className="ri-file-list-3-line"></i> Modul Ajar
              </a>
              <a className="nav-item" data-view="materi">
                <i className="ri-folder-open-line"></i> Materi & Flashcards
              </a>
              <a className="nav-item" data-view="tugas">
                <i className="ri-clipboard-line"></i> Tugas & Bank Soal
              </a>
              <a className="nav-item" data-view="laporan">
                <i className="ri-bar-chart-box-line"></i> Laporan
              </a>
              <a className="nav-item" data-view="guru">
                <i className="ri-user-star-line"></i> Kelola Data Guru
              </a>
              <a className="nav-item" data-view="pengaturan">
                <i className="ri-settings-4-line"></i> Pengaturan
              </a>
            </nav>
          </div>

          <div className="teacher-profile-card">
            <img id="teacherAvatarSidebar" src="" alt="Guru" className="teacher-avatar" />
            <div className="teacher-details">
              <h4 id="teacherNameSidebar">Guru Bahasa Inggris</h4>
              <p id="teacherNipSidebar">NIP: 199610272019032006</p>
            </div>
          </div>
        </aside>

        <div className="sidebar-backdrop" id="sidebarBackdrop"></div>

        <div className="main-wrapper">
          <header className="top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="menu-toggle" id="menuToggle">
                <i className="ri-menu-line"></i>
              </button>
              <div className="top-title">
                <h2 id="currentViewTitle">Dashboard</h2>
                <p>Perangkat Ajar SD Negeri Bobong - Kab. Pulau Taliabu</p>
              </div>
            </div>
            <div className="top-actions">
              <div className="role-switcher-container" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eef6f8', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(18, 165, 184, 0.2)' }}>
                <i className="ri-user-settings-line" style={{ color: 'var(--primary-dark)', fontSize: '14px' }}></i>
                <select id="roleModeSelect" onChange={(e) => (window as any).switchRoleMode(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 700, color: 'var(--primary-dark)', outline: 'none', cursor: 'pointer' }} title="Beralih Mode Tampilan Peran">
                  <option value="guru_inggris">Mode: Guru Bahasa Inggris</option>
                  <option value="plt_kepsek">Mode: Plt. Kepala Sekolah (Admin)</option>
                </select>
              </div>
              <button className="btn btn-secondary" onClick={() => (window as any).handleLogout()} title="Keluar / Logout">
                <i className="ri-logout-box-r-line"></i> <span className="hide-on-mobile">Keluar</span>
              </button>
            </div>
          </header>

          <div className="content-area">
            {/* 1. DASHBOARD VIEW */}
            <section id="view-dashboard" className="view-section active">
              <div className="hero-banner">
                <div className="hero-text">
                  <span className="hero-badge">SD NEGERI BOBONG - KAB. PULAU TALIABU</span>
                  <h1>Selamat Datang!</h1>
                  <p>Kelola Perangkat Ajar Bahasa Inggris SD, Modul Ajar Kurikulum Merdeka, Flashcards Interaktif, Presensi, dan Jurnal Mengajar Harian secara praktis.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon teal"><i className="ri-user-smile-line"></i></div>
                  <div className="stat-info">
                    <h4 id="statTotalStudents">0</h4>
                    <p>Total Siswa</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon emerald"><i className="ri-building-4-line"></i></div>
                  <div className="stat-info">
                    <h4 id="statTotalClasses">0</h4>
                    <p>Kelas Binaan</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon amber"><i className="ri-file-paper-2-line"></i></div>
                  <div className="stat-info">
                    <h4 id="statTotalModules">0</h4>
                    <p>Modul Ajar SD</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon rose"><i className="ri-book-mark-line"></i></div>
                  <div className="stat-info">
                    <h4 id="statTotalJournals">0</h4>
                    <p>Jurnal Terisi</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="card" style={{ marginBottom: 0 }}>
                  <div className="section-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', margin: 0 }}><i className="ri-calendar-check-line" style={{ color: 'var(--primary)' }}></i> Jadwal Mengajar</h3>
                    <button className="btn btn-primary" onClick={() => (window as any).showAddScheduleModal()} style={{ padding: '4px 10px', fontSize: '12px' }}>
                      <i className="ri-add-line"></i> Tambah Jadwal
                    </button>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Hari</th>
                          <th>Waktu</th>
                          <th>Kelas</th>
                          <th>Materi</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody id="timetableBody"></tbody>
                    </table>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 0 }}>
                  <div className="section-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', margin: 0 }}>Jurnal Mengajar Terbaru</h3>
                    <button className="btn btn-secondary" onClick={() => {
                      const el = document.querySelector('[data-view=jurnal]') as HTMLElement | null;
                      if (el) el.click();
                    }} style={{ padding: '4px 10px', fontSize: '12px' }}>Lihat Semua</button>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Tanggal</th>
                          <th>Kelas</th>
                          <th>Materi / Topik</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody id="recentJournalsBody"></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. DATA SISWA VIEW */}
            <section id="view-siswa" className="view-section">
              <div className="section-header">
                <h3>Daftar Siswa SD Negeri Bobong</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => (window as any).showAddStudentModal()}>
                    <i className="ri-user-add-line"></i> Tambah Siswa Baru
                  </button>
                  <button className="btn btn-secondary" onClick={() => (window as any).showImportStudentModal()} style={{ borderColor: 'var(--primary)', color: 'var(--primary-dark)' }}>
                    <i className="ri-file-excel-2-line"></i> Impor dari Excel / CSV
                  </button>
                  <button className="btn btn-secondary" onClick={() => (window as any).exportSiswaToCSV()}>
                    <i className="ri-download-line"></i> Ekspor Data CSV
                  </button>
                </div>
              </div>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div className="search-box">
                    <i className="ri-search-line"></i>
                    <input type="text" id="searchSiswaInput" placeholder="Cari siswa berdasarkan nama..." onKeyUp={(e: any) => (window as any).searchStudent(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>Filter Kelas:</label>
                    <select id="siswaClassSelect" onChange={(e) => (window as any).filterSiswaByClass(e.target.value)} style={{ padding: '7px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white', minWidth: '130px' }}>
                      <option value="ALL">Semua Kelas</option>
                    </select>
                  </div>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Lengkap</th>
                        <th>Kelas</th>
                        <th>Jenis Kelamin</th>
                        <th>Nilai Formatif</th>
                        <th>Nilai Sumatif</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody id="siswaTableBody"></tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 3. DATA KELAS VIEW */}
            <section id="view-kelas" className="view-section">
              <div className="section-header">
                <h3>Daftar Kelas SD Negeri Bobong</h3>
              </div>
              <div className="grid-responsive" id="kelasGridContainer"></div>
            </section>

            {/* 4. ABSENSI VIEW */}
            <section id="view-absensi" className="view-section">
              <div className="section-header">
                <h3>Presensi & Absensi Siswa Harian</h3>
              </div>
              <div className="card" style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', marginBottom: '12px' }}><i className="ri-edit-line" style={{ color: 'var(--primary)' }}></i> Input Presensi Kelas</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '16px' }}>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Pilih Kelas:</label>
                    <select id="absensiClassSelect" style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1' }}>
                      <option value="1A">Kelas 1A</option>
                      <option value="1B">Kelas 1B</option>
                      <option value="2A">Kelas 2A</option>
                      <option value="2B">Kelas 2B</option>
                      <option value="6A">Kelas 6A</option>
                      <option value="6B">Kelas 6B</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Tanggal Presensi:</label>
                    <input type="date" id="absensiDateInput" style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1' }} />
                  </div>
                  <button className="btn btn-primary" onClick={() => (window as any).renderAbsensiForm()}>
                    <i className="ri-user-check-line"></i> Muat Daftar Siswa
                  </button>
                </div>
                <div id="absensiFormContainer"></div>
              </div>

              <div className="card">
                <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Riwayat Presensi Harian</h4>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Kelas</th>
                        <th style={{ textAlign: 'center' }}>Hadir</th>
                        <th style={{ textAlign: 'center' }}>Izin</th>
                        <th style={{ textAlign: 'center' }}>Sakit</th>
                        <th style={{ textAlign: 'center' }}>Alpa</th>
                        <th style={{ textAlign: 'center' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody id="absensiTableBody"></tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 5. DAFTAR NILAI VIEW */}
            <section id="view-nilai" className="view-section">
              <div className="section-header">
                <h3>Daftar Nilai Asesmen Siswa</h3>
                <button className="btn btn-secondary" onClick={() => (window as any).exportNilaiToCSV()}>
                  <i className="ri-download-line"></i> Ekspor CSV Nilai
                </button>
              </div>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Filter Kelas:</label>
                    <select id="nilaiClassSelect" onChange={(e) => (window as any).filterNilaiByClass(e.target.value)} style={{ padding: '7px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}>
                      <option value="ALL">Semua Kelas</option>
                    </select>
                  </div>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Siswa</th>
                        <th>Kelas</th>
                        <th>Nilai Formatif</th>
                        <th>Nilai STS</th>
                        <th>Nilai SAS</th>
                        <th>Rata-Rata Final</th>
                      </tr>
                    </thead>
                    <tbody id="nilaiTableBody"></tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 6. JURNAL MENGAJAR VIEW */}
            <section id="view-jurnal" className="view-section">
              <div className="section-header">
                <h3>Jurnal Mengajar Guru Bahasa Inggris</h3>
                <button className="btn btn-primary" onClick={() => (window as any).showAddJournalModal()}>
                  <i className="ri-add-line"></i> Isi Jurnal Hari Ini
                </button>
              </div>
              <div className="card">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Tanggal & Jam</th>
                        <th>Kelas</th>
                        <th>Materi / Topik</th>
                        <th>Presensi</th>
                        <th>Catatan</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody id="jurnalTableBody"></tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 7. MODUL AJAR VIEW */}
            <section id="view-modul" className="view-section">
              <div className="section-header">
                <h3>Perangkat & Modul Ajar Kurikulum Merdeka</h3>
                <button className="btn btn-primary" onClick={() => (window as any).showAddModulModal()}>
                  <i className="ri-upload-cloud-line"></i> Unggah Modul Baru
                </button>
              </div>
              <div className="grid-responsive" id="modulGridContainer"></div>
            </section>

            {/* 8. MATERI & FLASHCARDS VIEW */}
            <section id="view-materi" className="view-section">
              <div className="section-header">
                <h3>Materi & Flashcards Interaktif Bahasa Inggris</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={() => (window as any).showAddFlashcardModal()}>
                    <i className="ri-add-line"></i> Tambah Flashcard
                  </button>
                  <button className="btn btn-secondary" onClick={() => (window as any).startEnglishQuiz()}>
                    <i className="ri-gamepad-line"></i> Kuis Interaktif
                  </button>
                </div>
              </div>

              {/* Quiz Container */}
              <div id="quizContainer" className="card" style={{ display: 'none', background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)', border: '1px solid #bae6fd', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, color: 'var(--primary-dark)' }}><i className="ri-gamepad-line"></i> Kuis Bahasa Inggris Interaktif</h4>
                  <button className="btn btn-secondary" onClick={() => {
                    const box = document.getElementById('quizContainer');
                    if (box) box.style.display = 'none';
                  }} style={{ padding: '2px 8px', fontSize: '12px' }}>Tutup</button>
                </div>
                <div id="quizQuestionBody"></div>
              </div>

              <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Kategori Flashcard:</label>
                <select id="flashcardCategorySelect" onChange={(e) => (window as any).filterFlashcards(e.target.value)} style={{ padding: '7px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}>
                  <option value="ALL">Semua Topik</option>
                  <option value="Greetings">Greetings & Introductions</option>
                  <option value="Family">My Family</option>
                  <option value="School">School Objects</option>
                  <option value="Animals">Animals & Pets</option>
                  <option value="Colors">Colors & Numbers</option>
                </select>
              </div>

              <div className="grid-responsive" id="flashcardsContainer"></div>
            </section>

            {/* 9. TUGAS & BANK SOAL VIEW */}
            <section id="view-tugas" className="view-section">
              <div className="section-header">
                <h3>Tugas & Lembar Kerja Siswa (LKS)</h3>
                <button className="btn btn-primary" onClick={() => (window as any).showAddTugasModal()}>
                  <i className="ri-add-line"></i> Buat Tugas Baru
                </button>
              </div>
              <div className="grid-responsive" id="tugasGridContainer"></div>
            </section>

            {/* 10. LAPORAN VIEW */}
            <section id="view-laporan" className="view-section">
              <div className="section-header">
                <h3>Laporan Rekapitulasi Perangkat Ajar & Presensi</h3>
              </div>
              <div className="card" id="laporanContainer"></div>
            </section>

            {/* 11. KELOLA DATA GURU VIEW */}
            <section id="view-guru" className="view-section">
              <div className="section-header">
                <h3>Kelola Data Guru & Tenaga Pendidik</h3>
                <button className="btn btn-primary" onClick={() => (window as any).showAddTeacherModal()}>
                  <i className="ri-user-add-line"></i> Tambah Data Guru
                </button>
              </div>
              <div className="card">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>NIP</th>
                        <th>Nama Lengkap</th>
                        <th>Jabatan / Peran</th>
                        <th>Mata Pelajaran</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody id="guruTableBody"></tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 12. PENGATURAN VIEW */}
            <section id="view-pengaturan" className="view-section">
              <div className="section-header">
                <h3>Pengaturan Profil Guru & Sekolah</h3>
              </div>
              <div className="card">
                <form onSubmit={(e) => (window as any).saveTeacherProfileSettings(e)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <img id="settingsAvatarPreview" src="" alt="Avatar Guru" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
                    <div>
                      <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>Foto Profil Guru</h4>
                      <input type="file" id="settingsAvatarInput" accept="image/*" onChange={(e) => (window as any).previewTeacherAvatar(e)} style={{ fontSize: '13px' }} />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Nama Lengkap Guru:</label>
                    <input type="text" id="settingsTeacherName" style={{ width: '100%', padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1' }} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>NIP Guru:</label>
                    <input type="text" id="settingsTeacherNip" style={{ width: '100%', padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1' }} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Role / Jabatan:</label>
                    <input type="text" id="settingsTeacherRole" style={{ width: '100%', padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1' }} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Nama Sekolah:</label>
                    <input type="text" id="settingsSchoolName" style={{ width: '100%', padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1' }} required />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <i className="ri-save-line"></i> Simpan Pengaturan
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* MODAL CONTAINER */}
      <div id="modalOverlay" className="modal-overlay" style={{ display: 'none' }}>
        <div className="modal-card">
          <div className="modal-header">
            <h3 id="modalTitle">Modal Title</h3>
            <button className="close-modal" onClick={() => (window as any).closeModal()}>&times;</button>
          </div>
          <div id="modalBody"></div>
        </div>
      </div>
    </>
  );
}
