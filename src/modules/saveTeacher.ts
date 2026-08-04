import { appData, saveStorage, saveTeacherToSupabase } from '../helpers';
import { Teacher } from '../types';
import { closeModal } from './closeModal';
import { renderDataGuru } from './renderDataGuru';

export function saveTeacher(e: Event): void {
  e.preventDefault();
  const name = (document.getElementById('teacherName') as HTMLInputElement).value;
  const nip = (document.getElementById('teacherNip') as HTMLInputElement).value;
  const role = (document.getElementById('teacherRole') as HTMLSelectElement).value;

  const generatedId = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });

  const newTeacher: any = {
    id: generatedId,
    uuid: generatedId,
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
