import { showToast } from './showToast.js';
import { appData, saveStorage, saveStudentToSupabase } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderDataSiswa } from './renderDataSiswa.js';
import { filterSiswa } from './filterSiswa.js';
export function saveEditStudent(e, originalNis) {
    e.preventDefault();
    const name = document.getElementById('editStudentName').value.trim();
    const classId = document.getElementById('editStudentClass').value;
    const gender = document.getElementById('editStudentGender').value;
    const idx = (appData.students || []).findIndex((st) => st.nis === originalNis || st.id === originalNis);
    if (idx !== -1) {
        appData.students[idx] = {
            ...appData.students[idx],
            name,
            classId,
            gender
        };
        saveStorage();
        saveStudentToSupabase(appData.students[idx]);
        const selectElem = document.getElementById('siswaClassSelect');
        const currentFilter = selectElem ? selectElem.value : 'ALL';
        renderDataSiswa(currentFilter);
        filterSiswa();
        closeModal();
        showToast(`Data siswa ${name} berhasil diperbarui!`, 'success');
    }
}
