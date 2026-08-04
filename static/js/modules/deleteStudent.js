import { appData, saveStorage, deleteStudentFromSupabase } from '../helpers.js';
import { renderDataSiswa } from './renderDataSiswa.js';
import { filterSiswa } from './filterSiswa.js';
import { showToast } from './showToast.js';
export function deleteStudent(nis) {
    const student = (appData.students || []).find((s) => (s.nis === nis || s.id === nis));
    const studentName = student ? student.name : nis;
    if (!confirm(`Apakah Anda yakin ingin menghapus data siswa "${studentName}"?`)) {
        return;
    }
    appData.students = (appData.students || []).filter((s) => s.nis !== nis && s.id !== nis);
    saveStorage();
    deleteStudentFromSupabase(nis);
    const selectElem = document.getElementById('siswaClassSelect');
    const currentFilter = selectElem ? selectElem.value : 'ALL';
    renderDataSiswa(currentFilter);
    filterSiswa();
    showToast(`Data siswa "${studentName}" berhasil dihapus.`, 'info');
}
