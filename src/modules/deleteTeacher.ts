import { appData, saveStorage, deleteTeacherFromSupabase } from '../helpers';
import { INITIAL_DATA } from '../data';
import { renderDataGuru } from './renderDataGuru';

export function deleteTeacher(nip: string): void {
  if (nip === '199610272019032006') {
    alert('Akun utama Husnita Usman, M.Pd. (Plt. Kepala Sekolah) tidak dapat dihapus demi keamanan sistem.');
    return;
  }

  if (confirm(`Apakah Anda yakin ingin menghapus akun guru NIP ${nip}?`)) {
    appData.teachers = (appData.teachers || []).filter(t => t.nip !== nip);
    if (appData.teachers.length === 0) {
      appData.teachers = [...(INITIAL_DATA as any).teachers];
    }
    saveStorage();
    deleteTeacherFromSupabase(nip);
    renderDataGuru();
  }
}
