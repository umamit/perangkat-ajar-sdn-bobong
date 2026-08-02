import { appData, saveStorage, saveStudentToSupabase } from '../helpers';
import { closeModal } from './closeModal';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';

export function saveStudent(e: Event): void {
  e.preventDefault();
  const nis = (document.getElementById('studentNis') as HTMLInputElement).value.trim();
  const name = (document.getElementById('studentName') as HTMLInputElement).value.trim();
  const classId = (document.getElementById('studentClass') as HTMLSelectElement).value;
  const gender = (document.getElementById('studentGender') as HTMLSelectElement).value as 'L' | 'P';

  if (!nis || !name) {
    alert('Harap isi NISN dan Nama Lengkap!');
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
  renderDataSiswa();
  filterSiswa();
  closeModal();
  alert(`✅ Siswa "${name}" berhasil disimpan!`);
}
