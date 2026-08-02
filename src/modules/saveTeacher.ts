import { appData, saveStorage, saveTeacherToSupabase } from '../helpers';
import { Teacher } from '../types';
import { closeModal } from './closeModal';
import { renderDataGuru } from './renderDataGuru';

export function saveTeacher(e: Event): void {
  e.preventDefault();
  const name = (document.getElementById('teacherName') as HTMLInputElement).value;
  const nip = (document.getElementById('teacherNip') as HTMLInputElement).value;
  const role = (document.getElementById('teacherRole') as HTMLSelectElement).value;

  const newTeacher: any = {
    id: `G0${appData.teachers.length + 1}`,
    name,
    nip,
    role,
    subject: 'Bahasa Inggris',
    status: 'Aktif'
  };

  appData.teachers.push(newTeacher);
  saveStorage();
  saveTeacherToSupabase(newTeacher);
  renderDataGuru();
  closeModal();
}
