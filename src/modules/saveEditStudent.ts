import { appData, saveStorage, saveStudentToSupabase } from '../helpers';
import { closeModal } from './closeModal';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';

export function saveEditStudent(e: Event, originalNis: string): void {
  e.preventDefault();
  const nis = (document.getElementById('editStudentNis') as HTMLInputElement).value.trim();
  const name = (document.getElementById('editStudentName') as HTMLInputElement).value.trim();
  const classId = (document.getElementById('editStudentClass') as HTMLSelectElement).value;
  const gender = (document.getElementById('editStudentGender') as HTMLSelectElement).value as 'L' | 'P';

  const idx = (appData.students || []).findIndex((st: any) => st.nis === originalNis || st.id === originalNis);
  if (idx !== -1) {
    appData.students[idx] = {
      ...appData.students[idx],
      nis,
      id: nis,
      name,
      classId,
      gender
    };

    saveStorage();
    saveStudentToSupabase(appData.students[idx]);
    renderDataSiswa();
    filterSiswa();
    closeModal();
    alert(`✅ Data siswa ${name} berhasil diperbarui!`);
  }
}
