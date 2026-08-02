// Application Main Script for Perangkat Ajar Guru Bahasa Inggris SD Negeri Bobong
import { 
  appData, loadStorage, saveStorage, syncFromSupabase
} from './helpers';

import { checkAuthSession } from './modules/checkAuthSession';
import { handleLogin } from './modules/handleLogin';
import { handleLogout } from './modules/handleLogout';
import { renderTeacherProfile } from './modules/renderTeacherProfile';
import { renderPengaturanForm } from './modules/renderPengaturanForm';
import { getTeacherClasses } from './modules/getTeacherClasses';
import { renderDataGuru } from './modules/renderDataGuru';
import { deleteTeacher } from './modules/deleteTeacher';

import { renderDataSiswa } from './modules/renderDataSiswa';
import { filterSiswa, searchStudent } from './modules/searchStudent';
import { renderDataKelas } from './modules/renderDataKelas';

import { renderDashboard } from './modules/renderDashboard';
import { renderAbsensi } from './modules/renderAbsensi';
import { renderDaftarNilai, adjustGrade, updateStudentGrade } from './modules/renderDaftarNilai';
import { renderJurnal, showAddJournalModal, saveJournal } from './modules/renderJurnal';
import { renderTimetable } from './modules/renderTimetable';
import { renderMateriFlashcards } from './modules/renderMateriFlashcards';
import { renderTugas } from './modules/renderTugas';
import { renderLaporan } from './modules/renderLaporan';

import { openModal, closeModal } from './modules/openModal';
import { closeMobileSidebar } from './modules/closeMobileSidebar';
import { setupNavigation } from './modules/setupNavigation';
import { switchRoleMode } from './modules/switchRoleMode';

import { showAddTeacherModal } from './modules/showAddTeacherModal';
import { saveTeacher } from './modules/saveTeacher';

import { renderModulAjar, exportSiswaToCSV, exportNilaiToCSV, startEnglishQuiz, renderQuizQuestion, checkQuizAnswer, printWorksheet } from './views';

document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  checkAuthSession();
  initApp();
  syncFromSupabase();
});

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
    const toggleBtn = document.getElementById('menuToggle')!;
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

  if (document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay')!.addEventListener('click', (e) => {
      if (e.target === document.getElementById('modalOverlay')) {
        closeModal();
      }
    });
  }
}

// Global Browser Window State Attachment
if (typeof window !== 'undefined') {
  (window as any).handleLogin = handleLogin;
  (window as any).handleLogout = handleLogout;
  (window as any).showAddJournalModal = showAddJournalModal;
  (window as any).saveJournal = saveJournal;
  (window as any).showAddTeacherModal = showAddTeacherModal;
  (window as any).saveTeacher = saveTeacher;
  (window as any).deleteTeacher = deleteTeacher;
  (window as any).adjustGrade = adjustGrade;
  (window as any).updateStudentGrade = updateStudentGrade;
  (window as any).searchStudent = searchStudent;
  (window as any).filterSiswa = filterSiswa;
  (window as any).renderAllViews = initApp;
  (window as any).renderTeacherProfile = renderTeacherProfile;
  (window as any).renderDataGuru = renderDataGuru;
  (window as any).renderDashboard = renderDashboard;
  (window as any).renderDataSiswa = renderDataSiswa;
  (window as any).renderDaftarNilai = renderDaftarNilai;
  (window as any).renderJurnal = renderJurnal;
  (window as any).renderAbsensi = renderAbsensi;
  (window as any).switchRoleMode = (mode: string) => switchRoleMode(mode, [renderDataKelas, renderDataSiswa, renderDaftarNilai, renderDashboard]);
}
