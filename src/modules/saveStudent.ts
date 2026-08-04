import { appData, saveStorage, saveStudentToSupabase } from '../helpers';
import { closeModal } from './closeModal';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';
import { showToast } from './showToast';

export function saveStudent(e: Event): void {
  e.preventDefault();
  const name = (document.getElementById('studentName') as HTMLInputElement).value.trim();
  const classId = (document.getElementById('studentClass') as HTMLSelectElement).value;
  const gender = (document.getElementById('studentGender') as HTMLSelectElement).value as 'L' | 'P';

  if (!name) {
    showToast('Harap isi Nama Lengkap siswa!', 'error');
    return;
  }

  const generatedId = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
  const newStudent: any = {
    id: generatedId,
    uuid: generatedId,
    nis: generatedId,
    name: name,
    classId: classId,
    gender: gender,
    scoreFormatif: 0,
    scoreSumatif: 0
  };

  // 1. OPTIMISTIC UPDATE (Instan 0ms pada UI)
  appData.students.push(newStudent);

  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  if (selectElem) selectElem.value = classId;
  renderDataSiswa(classId);
  filterSiswa();
  closeModal();
  showToast(`Siswa "${name}" berhasil disimpan ke ${classId}!`, 'success');

  // 2. BACKGROUND ASYNC SYNC (Jalan di belakang layar)
  saveStudentToSupabase(newStudent).then(success => {
    if (!success) {
      showToast(`Kendala koneksi Supabase, namun data siswa tetap tersimpan di memori.`, 'info');
    }
  });
}
