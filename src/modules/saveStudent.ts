import { appData, saveStudentToSupabase } from '../helpers';
import { closeModal } from './openModal';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './searchStudent';

export function saveStudent(e: Event): void {
  e.preventDefault();
  const nis     = (document.getElementById('studentNis') as HTMLInputElement).value.trim();
  const name    = (document.getElementById('studentName') as HTMLInputElement).value.trim();
  const classId = (document.getElementById('studentClass') as HTMLSelectElement).value;
  const gender  = (document.getElementById('studentGender') as HTMLSelectElement).value;

  if (!nis || !name || !classId) { alert('Lengkapi semua data siswa!'); return; }

  const newStudent = { id: nis, nis, name, classId, gender, scoreFormatif: 80, scoreSumatif: 80 };

  if (!appData.students) appData.students = [];
  const idx = appData.students.findIndex((s: any) => s.nis === nis || s.id === nis);
  if (idx !== -1) {
    appData.students[idx] = { ...appData.students[idx], ...newStudent };
  } else {
    appData.students.push(newStudent);
  }

  saveStudentToSupabase(newStudent as any);
  renderDataSiswa();
  filterSiswa();
  closeModal();
  alert(`✅ Siswa "${name}" berhasil ditambahkan ke kelas ${classId}.`);
}

export function saveEditStudent(e: Event, originalNis: string): void {
  e.preventDefault();
  const nis     = (document.getElementById('editStudentNis') as HTMLInputElement).value.trim();
  const name    = (document.getElementById('editStudentName') as HTMLInputElement).value.trim();
  const classId = (document.getElementById('editStudentClass') as HTMLSelectElement).value;
  const gender  = (document.getElementById('editStudentGender') as HTMLSelectElement).value;

  if (!nis || !name || !classId) { alert('Lengkapi semua data siswa!'); return; }

  const idx = appData.students.findIndex((s: any) => s.nis === originalNis || s.id === originalNis);
  if (idx !== -1) {
    appData.students[idx] = { ...appData.students[idx], nis, id: nis, name, classId, gender };
    saveStudentToSupabase(appData.students[idx] as any);
  }

  renderDataSiswa();
  filterSiswa();
  closeModal();
  alert(`✅ Data siswa "${name}" berhasil diperbarui.`);
}
