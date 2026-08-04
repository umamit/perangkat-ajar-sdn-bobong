import { appData } from '../helpers';
import { renderDataGuru } from './renderDataGuru';
import { showToast } from './showToast';

export function deleteTeacher(nip: string) {
  if (!nip) return;
  const teacher = appData.teachers.find(t => t.nip === nip);
  const teacherName = teacher ? teacher.name : nip;

  if (confirm(`Apakah Anda yakin ingin menghapus data guru: ${teacherName}?`)) {
    appData.teachers = appData.teachers.filter(t => t.nip !== nip);
    showToast(`Data guru ${teacherName} berhasil dihapus.`, 'info');
    renderDataGuru();
  }
}
