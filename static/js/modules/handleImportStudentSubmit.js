import * as XLSX from 'xlsx';
import { appData, saveStudentsBatchToSupabase } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderDataSiswa } from './renderDataSiswa.js';
import { filterSiswa } from './filterSiswa.js';
import { showToast } from './showToast.js';
export function handleImportStudentSubmit(e) {
    e.preventDefault();
    const fileInput = document.getElementById('importStudentFile');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showToast('Harap pilih file Excel atau CSV terlebih dahulu!', 'error');
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
        try {
            const buffer = evt.target?.result;
            const workbook = XLSX.read(buffer, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(sheet);
            if (!rawData || rawData.length === 0) {
                showToast('File Excel / CSV kosong atau tidak terbaca!', 'error');
                return;
            }
            let importedCount = 0;
            let targetClass = 'ALL';
            const importedStudentsList = [];
            for (let i = 0; i < rawData.length; i++) {
                const row = rawData[i];
                const keys = Object.keys(row);
                const findVal = (...possibleNames) => {
                    const matchedKey = keys.find(k => possibleNames.some(p => k.toLowerCase().trim() === p.toLowerCase().trim()));
                    return matchedKey ? String(row[matchedKey]).trim() : '';
                };
                const nis = findVal('NISN', 'NIS', 'id', 'No Induk', 'Nomor Induk');
                const name = findVal('Nama Lengkap', 'Nama', 'name', 'Nama Siswa');
                let classIdRaw = findVal('Kelas', 'classId', 'Kelas Siswa', 'Rombel');
                let genderRaw = findVal('Jenis Kelamin', 'gender', 'JK', 'L/P', 'Sex');
                let classId = classIdRaw.toUpperCase().trim()
                    .replace('KELAS', '')
                    .replace('III', '3')
                    .replace('II', '2')
                    .replace('IV', '4')
                    .replace('VI', '6')
                    .replace('V', '5')
                    .replace('I', '1')
                    .replace(/[^0-9A-Z]/g, '');
                if (!classId) {
                    const selectElem = document.getElementById('siswaClassSelect');
                    classId = (selectElem && selectElem.value !== 'ALL') ? selectElem.value : '3B';
                }
                let gender = (genderRaw.toUpperCase().startsWith('P') || genderRaw.toUpperCase().startsWith('W')) ? 'P' : 'L';
                if (name) {
                    const generatedId = crypto.randomUUID ? crypto.randomUUID() : `st-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`;
                    targetClass = classId;
                    const newStudent = {
                        id: generatedId,
                        nis: generatedId,
                        name: name || 'Siswa Tanpa Nama',
                        classId: classId,
                        gender: gender,
                        scoreFormatif: 80,
                        scoreSumatif: 80
                    };
                    appData.students.push(newStudent);
                    importedCount++;
                    importedStudentsList.push(newStudent);
                }
            }
            if (importedStudentsList.length > 0) {
                await saveStudentsBatchToSupabase(importedStudentsList);
            }
            closeModal();
            showToast(`🎉 Sukses mengimpor ${importedCount} data siswa ke kelas ${targetClass}!`, 'success');
            if (typeof window.filterSiswaByClass === 'function') {
                window.filterSiswaByClass(targetClass !== 'ALL' ? targetClass : 'ALL');
            }
            else {
                renderDataSiswa(targetClass !== 'ALL' ? targetClass : 'ALL');
            }
            filterSiswa();
        }
        catch (err) {
            console.error('[Import Student Error]', err);
            showToast('Gagal memproses file Excel/CSV. Pastikan format file sesuai!', 'error');
        }
    };
    reader.readAsBinaryString(file);
}
