// Application Main Script for Perangkat Ajar Guru Bahasa Inggris SD Negeri Bobong
import { 
  appData, loadStorage, syncFromSupabase
} from './helpers';

import { checkAuthSession } from './modules/checkAuthSession';
import { handleLogin } from './modules/handleLogin';
import { handleLogout } from './modules/handleLogout';
import { renderTeacherProfile } from './modules/renderTeacherProfile';
import { renderPengaturanForm } from './modules/renderPengaturanForm';
import { saveTeacherProfileSettings } from './modules/saveTeacherProfileSettings';
import { previewTeacherAvatar } from './modules/previewTeacherAvatar';
import { getTeacherClasses } from './modules/getTeacherClasses';
import { renderDataGuru } from './modules/renderDataGuru';
import { deleteTeacher } from './modules/deleteTeacher';

import { renderDataSiswa } from './modules/renderDataSiswa';
import { filterSiswa } from './modules/filterSiswa';
import { searchStudent } from './modules/searchStudent';
import { showAddStudentModal } from './modules/showAddStudentModal';
import { showEditStudentModal } from './modules/showEditStudentModal';
import { saveStudent } from './modules/saveStudent';
import { saveEditStudent } from './modules/saveEditStudent';
import { deleteStudent } from './modules/deleteStudent';
import { 
  showImportStudentModal, 
  downloadStudentTemplate, 
  executeDirectImport 
} from './modules/showImportStudentModal';
import { renderDataKelas } from './modules/renderDataKelas';

import { renderDashboard } from './modules/renderDashboard';
import { renderAbsensi } from './modules/renderAbsensi';
import { renderAbsensiForm } from './modules/renderAbsensiForm';
import { setAbsensiStatus } from './modules/setAbsensiStatus';
import { saveAbsensi } from './modules/saveAbsensi';

import { renderDaftarNilai } from './modules/renderDaftarNilai';
import { filterNilaiByClass } from './modules/filterNilaiByClass';
import { adjustGrade } from './modules/adjustGrade';
import { updateStudentGrade } from './modules/updateStudentGrade';

import { renderJurnal } from './modules/renderJurnal';
import { showAddJournalModal } from './modules/showAddJournalModal';
import { saveJournal } from './modules/saveJournal';
import { deleteJournal } from './modules/deleteJournal';
import { deleteModul } from './modules/deleteModul';
import { showToast } from './modules/showToast';

import { renderTimetable } from './modules/renderTimetable';
import { renderMateriFlashcards } from './modules/renderMateriFlashcards';
import { renderTugas } from './modules/renderTugas';
import { renderLaporan } from './modules/renderLaporan';

import { closeModal } from './modules/closeModal';
import { closeMobileSidebar } from './modules/closeMobileSidebar';
import { setupNavigation } from './modules/setupNavigation';
import { switchView } from './modules/switchView';
import { switchRoleMode } from './modules/switchRoleMode';

import { showAddTeacherModal } from './modules/showAddTeacherModal';
import { saveTeacher } from './modules/saveTeacher';
import { showAddModulModal } from './modules/showAddModulModal';
import { saveModul } from './modules/saveModul';
import { showAddTugasModal } from './modules/showAddTugasModal';
import { saveTugas } from './modules/saveTugas';
import { showAddFlashcardModal } from './modules/showAddFlashcardModal';
import { saveFlashcard } from './modules/saveFlashcard';
import { filterFlashcards } from './modules/filterFlashcards';
import { showAddScheduleModal } from './modules/showAddScheduleModal';
import { saveSchedule } from './modules/saveSchedule';

import { renderModulAjar, exportSiswaToCSV, exportNilaiToCSV, startEnglishQuiz, renderQuizQuestion, checkQuizAnswer, printWorksheet, printModule } from './views';

document.addEventListener('DOMContentLoaded', async () => {
  loadStorage();
  checkAuthSession();
  // Sync data dari Supabase TERLEBIH DAHULU sebelum render,
  // agar halaman tidak tampil kosong saat refresh
  await syncFromSupabase();
  initApp();
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
  (window as any).showAddStudentModal = showAddStudentModal;
  (window as any).showEditStudentModal = showEditStudentModal;
  (window as any).saveStudent = saveStudent;
  (window as any).saveEditStudent = saveEditStudent;
  (window as any).showAddModulModal = showAddModulModal;
  (window as any).saveModul = saveModul;
  (window as any).showAddTugasModal = showAddTugasModal;
  (window as any).saveTugas = saveTugas;
  (window as any).showAddFlashcardModal = showAddFlashcardModal;
  (window as any).saveFlashcard = saveFlashcard;
  (window as any).filterFlashcards = filterFlashcards;
  (window as any).showAddScheduleModal = showAddScheduleModal;
  (window as any).saveSchedule = saveSchedule;
  (window as any).printModule = printModule;
  (window as any).saveTeacherProfileSettings = saveTeacherProfileSettings;
  (window as any).previewTeacherAvatar = previewTeacherAvatar;
  (window as any).adjustGrade = adjustGrade;
  (window as any).updateStudentGrade = updateStudentGrade;
  (window as any).searchStudent = searchStudent;
  (window as any).filterSiswa = filterSiswa;
  (window as any).filterSiswaByClass = (val: string) => { 
    const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
    if (selectElem) selectElem.value = val;
    renderDataSiswa(val); 
  };
  (window as any).filterNilaiByClass = filterNilaiByClass;
  (window as any).renderAllViews = initApp;
  (window as any).renderTeacherProfile = renderTeacherProfile;
  (window as any).renderDataGuru = renderDataGuru;
  (window as any).renderDashboard = renderDashboard;
  (window as any).renderDataSiswa = renderDataSiswa;
  (window as any).renderDaftarNilai = renderDaftarNilai;
  (window as any).renderJurnal = renderJurnal;
  (window as any).renderAbsensi = renderAbsensi;
  (window as any).renderAbsensiForm = renderAbsensiForm;
  (window as any).setAbsensiStatus = setAbsensiStatus;
  (window as any).saveAbsensi = saveAbsensi;
  (window as any).printWorksheet = printWorksheet;
  (window as any).startEnglishQuiz = startEnglishQuiz;
  (window as any).renderQuizQuestion = renderQuizQuestion;
  (window as any).checkQuizAnswer = checkQuizAnswer;
  (window as any).exportSiswaToCSV = exportSiswaToCSV;
  (window as any).exportNilaiToCSV = exportNilaiToCSV;
  (window as any).deleteStudent = deleteStudent;
  (window as any).showImportStudentModal = showImportStudentModal;
  (window as any).downloadStudentTemplate = downloadStudentTemplate;
  (window as any).executeDirectImport = executeDirectImport;
  (window as any).deleteJournal = deleteJournal;
  (window as any).deleteModul = deleteModul;
  (window as any).showToast = showToast;
  (window as any).closeModal = closeModal;
  (window as any).switchView = switchView;
  (window as any).switchRoleMode = (mode: string) => switchRoleMode(mode, [renderDataKelas, renderDataSiswa, renderDaftarNilai, renderDashboard]);
}
