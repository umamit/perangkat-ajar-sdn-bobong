import { appData, saveStorage, deleteStudentFromSupabase } from '../helpers';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';

export function deleteStudent(nis: string): void {
  const student = (appData.students || []).find((s: any) => (s.nis === nis || s.id === nis));
  const studentName = student ? student.name : nis;

  if (!confirm(`Apakah Anda yakin ingin menghapus data siswa "${studentName}" (NISN: ${nis})?`)) {
    return;
  }

  appData.students = (appData.students || []).filter((s: any) => s.nis !== nis && s.id !== nis);
  saveStorage();
  deleteStudentFromSupabase(nis);

  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  const currentFilter = selectElem ? selectElem.value : 'ALL';
  renderDataSiswa(currentFilter);
  filterSiswa();

  alert(`✅ Data siswa "${studentName}" berhasil dihapus.`);
}
