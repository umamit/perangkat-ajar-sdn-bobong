import { appData, saveStudentToSupabase } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderDataSiswa } from './renderDataSiswa.js';
import { filterSiswa } from './filterSiswa.js';
import { showToast } from './showToast.js';
export function saveStudent(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value.trim();
    const classId = document.getElementById('studentClass').value;
    const gender = document.getElementById('studentGender').value;
    if (!name) {
        showToast('Harap isi Nama Lengkap siswa!', 'error');
        return;
    }
    const generatedId = crypto.randomUUID ? crypto.randomUUID() : `st-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const newStudent = {
        id: generatedId,
        nis: generatedId,
        name: name,
        classId: classId,
        gender: gender,
        scoreFormatif: 80,
        scoreSumatif: 80
    };
    // 1. OPTIMISTIC UPDATE (Instan 0ms pada UI)
    appData.students.push(newStudent);
    const selectElem = document.getElementById('siswaClassSelect');
    if (selectElem)
        selectElem.value = classId;
    renderDataSiswa(classId);
    filterSiswa();
    closeModal();
    showToast(`⚡ Siswa "${name}" berhasil disimpan ke ${classId}!`, 'success');
    // 2. BACKGROUND ASYNC SYNC (Jalan di belakang layar)
    saveStudentToSupabase(newStudent).then(success => {
        if (!success) {
            showToast(`⚠️ Kendala koneksi Supabase, namun data siswa tetap tersimpan di memori.`, 'info');
        }
    });
}
