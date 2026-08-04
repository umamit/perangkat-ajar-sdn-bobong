import { appData, saveStorage, saveStudentToSupabase } from '../helpers';
import { closeModal } from './closeModal';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';
import { showToast } from './showToast';

export function saveStudent(e: Event): void {
  e.preventDefault();
  const nis = (document.getElementById('studentNis') as HTMLInputElement).value.trim();
  const name = (document.getElementById('studentName') as HTMLInputElement).value.trim();
  const classId = (document.getElementById('studentClass') as HTMLSelectElement).value;
  const gender = (document.getElementById('studentGender') as HTMLSelectElement).value as 'L' | 'P';

  if (!nis || !name) {
    showToast('Harap isi NISN dan Nama Lengkap!', 'error');
    return;
  }

  const existingIdx = (appData.students || []).findIndex((s: any) => s.nis === nis || s.id === nis);
  const newStudent: any = {
    id: nis,
    nis: nis,
    name: name,
    classId: classId,
    gender: gender,
    scoreFormatif: 80,
    scoreSumatif: 80
  };

  if (existingIdx >= 0) {
    appData.students[existingIdx] = newStudent;
  } else {
    appData.students.push(newStudent);
  }

  saveStorage();
  saveStudentToSupabase(newStudent);
  
  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  if (selectElem) selectElem.value = classId;
  renderDataSiswa(classId);
  filterSiswa();
  closeModal();
  showToast(`Siswa "${name}" berhasil disimpan ke ${classId}!`, 'success');
}
