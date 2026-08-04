// Application Main Script for Perangkat Ajar Guru Bahasa Inggris SD Negeri Bobong
import { appData, loadStorage, syncFromSupabase } from './helpers.js';
import { checkAuthSession } from './modules/checkAuthSession.js';
import { handleLogin } from './modules/handleLogin.js';
import { handleLogout } from './modules/handleLogout.js';
import { renderTeacherProfile } from './modules/renderTeacherProfile.js';
import { saveTeacherProfileSettings } from './modules/saveTeacherProfileSettings.js';
import { previewTeacherAvatar } from './modules/previewTeacherAvatar.js';
import { renderDataGuru } from './modules/renderDataGuru.js';
import { deleteTeacher } from './modules/deleteTeacher.js';
import { renderDataSiswa } from './modules/renderDataSiswa.js';
import { filterSiswa } from './modules/filterSiswa.js';
import { searchStudent } from './modules/searchStudent.js';
import { showAddStudentModal } from './modules/showAddStudentModal.js';
import { showEditStudentModal } from './modules/showEditStudentModal.js';
import { saveStudent } from './modules/saveStudent.js';
import { saveEditStudent } from './modules/saveEditStudent.js';
import { deleteStudent } from './modules/deleteStudent.js';
import { showImportStudentModal, downloadStudentTemplate, executeDirectImport } from './modules/showImportStudentModal.js';
import { renderDataKelas } from './modules/renderDataKelas.js';
import { renderDashboard } from './modules/renderDashboard.js';
import { renderAbsensi } from './modules/renderAbsensi.js';
import { renderAbsensiForm } from './modules/renderAbsensiForm.js';
import { setAbsensiStatus } from './modules/setAbsensiStatus.js';
import { saveAbsensi } from './modules/saveAbsensi.js';
import { renderDaftarNilai } from './modules/renderDaftarNilai.js';
import { filterNilaiByClass } from './modules/filterNilaiByClass.js';
import { adjustGrade } from './modules/adjustGrade.js';
import { updateStudentGrade } from './modules/updateStudentGrade.js';
import { renderJurnal } from './modules/renderJurnal.js';
import { showAddJournalModal } from './modules/showAddJournalModal.js';
import { saveJournal } from './modules/saveJournal.js';
import { deleteJournal } from './modules/deleteJournal.js';
import { deleteModul } from './modules/deleteModul.js';
import { showToast } from './modules/showToast.js';
import { renderTimetable } from './modules/renderTimetable.js';
import { renderMateriFlashcards } from './modules/renderMateriFlashcards.js';
import { renderTugas } from './modules/renderTugas.js';
import { renderLaporan } from './modules/renderLaporan.js';
import { closeModal } from './modules/closeModal.js';
import { closeMobileSidebar } from './modules/closeMobileSidebar.js';
import { setupNavigation } from './modules/setupNavigation.js';
import { switchView } from './modules/switchView.js';
import { switchRoleMode } from './modules/switchRoleMode.js';
import { showAddTeacherModal } from './modules/showAddTeacherModal.js';
import { saveTeacher } from './modules/saveTeacher.js';
import { showAddModulModal } from './modules/showAddModulModal.js';
import { saveModul } from './modules/saveModul.js';
import { showAddTugasModal } from './modules/showAddTugasModal.js';
import { saveTugas } from './modules/saveTugas.js';
import { showAddFlashcardModal } from './modules/showAddFlashcardModal.js';
import { saveFlashcard } from './modules/saveFlashcard.js';
import { filterFlashcards } from './modules/filterFlashcards.js';
import { showAddScheduleModal } from './modules/showAddScheduleModal.js';
import { saveSchedule } from './modules/saveSchedule.js';
import { renderModulAjar, exportSiswaToCSV, exportNilaiToCSV, startEnglishQuiz, renderQuizQuestion, checkQuizAnswer, printWorksheet, printModule } from './views.js';
document.addEventListener('DOMContentLoaded', async () => {
    loadStorage();
    checkAuthSession();
    // Sync data dari Supabase TERLEBIH DAHULU sebelum render,
    // agar halaman tidak tampil kosong saat refresh
    await syncFromSupabase();
    initApp();
});
export function initApp() {
    if (!appData.activeRoleMode) {
        appData.activeRoleMode = 'guru_inggris';
    }
    const selectElem = document.getElementById('roleModeSelect');
    if (selectElem)
        selectElem.value = appData.activeRoleMode;
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
    if (backdrop)
        backdrop.addEventListener('click', closeMobileSidebar);
    if (document.getElementById('modalOverlay')) {
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modalOverlay')) {
                closeModal();
            }
        });
    }
}
// Global Browser Window State Attachment
if (typeof window !== 'undefined') {
    window.handleLogin = handleLogin;
    window.handleLogout = handleLogout;
    window.showAddJournalModal = showAddJournalModal;
    window.saveJournal = saveJournal;
    window.showAddTeacherModal = showAddTeacherModal;
    window.saveTeacher = saveTeacher;
    window.deleteTeacher = deleteTeacher;
    window.showAddStudentModal = showAddStudentModal;
    window.showEditStudentModal = showEditStudentModal;
    window.saveStudent = saveStudent;
    window.saveEditStudent = saveEditStudent;
    window.showAddModulModal = showAddModulModal;
    window.saveModul = saveModul;
    window.showAddTugasModal = showAddTugasModal;
    window.saveTugas = saveTugas;
    window.showAddFlashcardModal = showAddFlashcardModal;
    window.saveFlashcard = saveFlashcard;
    window.filterFlashcards = filterFlashcards;
    window.showAddScheduleModal = showAddScheduleModal;
    window.saveSchedule = saveSchedule;
    window.printModule = printModule;
    window.saveTeacherProfileSettings = saveTeacherProfileSettings;
    window.previewTeacherAvatar = previewTeacherAvatar;
    window.adjustGrade = adjustGrade;
    window.updateStudentGrade = updateStudentGrade;
    window.searchStudent = searchStudent;
    window.filterSiswa = filterSiswa;
    window.filterSiswaByClass = (val) => {
        const selectElem = document.getElementById('siswaClassSelect');
        if (selectElem)
            selectElem.value = val;
        renderDataSiswa(val);
    };
    window.filterNilaiByClass = filterNilaiByClass;
    window.renderAllViews = initApp;
    window.renderTeacherProfile = renderTeacherProfile;
    window.renderDataGuru = renderDataGuru;
    window.renderDashboard = renderDashboard;
    window.renderDataSiswa = renderDataSiswa;
    window.renderDaftarNilai = renderDaftarNilai;
    window.renderJurnal = renderJurnal;
    window.renderAbsensi = renderAbsensi;
    window.renderAbsensiForm = renderAbsensiForm;
    window.setAbsensiStatus = setAbsensiStatus;
    window.saveAbsensi = saveAbsensi;
    window.printWorksheet = printWorksheet;
    window.startEnglishQuiz = startEnglishQuiz;
    window.renderQuizQuestion = renderQuizQuestion;
    window.checkQuizAnswer = checkQuizAnswer;
    window.exportSiswaToCSV = exportSiswaToCSV;
    window.exportNilaiToCSV = exportNilaiToCSV;
    window.deleteStudent = deleteStudent;
    window.showImportStudentModal = showImportStudentModal;
    window.downloadStudentTemplate = downloadStudentTemplate;
    window.executeDirectImport = executeDirectImport;
    window.deleteJournal = deleteJournal;
    window.deleteModul = deleteModul;
    window.showToast = showToast;
    window.closeModal = closeModal;
    window.switchView = switchView;
    window.switchRoleMode = (mode) => switchRoleMode(mode, [renderDataKelas, renderDataSiswa, renderDaftarNilai, renderDashboard]);
}
