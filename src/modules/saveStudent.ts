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

  if (!name) {
    showToast('Harap isi Nama Lengkap siswa!', 'error');
    return;
  }

  const finalNis = nis || '';

  const existingIdx = (appData.students || []).findIndex((s: any) => (finalNis && (s.nis === finalNis || s.id === finalNis)));
  const newStudent: any = {
    id: finalNis || `LOCAL-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    nis: finalNis,
    name: name,
    classId: classId,
    gender: gender,
    scoreFormatif: 80,
    scoreSumatif: 80
  };

  // 1. OPTIMISTIC UPDATE (Instan 0ms pada UI)
  if (existingIdx >= 0) {
    appData.students[existingIdx] = newStudent;
  } else {
    appData.students.push(newStudent);
  }

  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  if (selectElem) selectElem.value = classId;
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
