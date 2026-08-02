import { appData, saveStorage, saveTeacherToSupabase } from '../helpers';
import { INITIAL_DATA } from '../data';
import { renderDataGuru } from './renderDataGuru';
import { closeModal } from './openModal';

export function saveTeacher(e: Event): void {
  e.preventDefault();
  const newT = {
    nip: (document.getElementById('teacherNip') as HTMLInputElement).value.trim(),
    name: (document.getElementById('teacherName') as HTMLInputElement).value.trim(),
    subject: (document.getElementById('teacherSubject') as HTMLInputElement).value.trim(),
    role: (document.getElementById('teacherRole') as HTMLSelectElement).value,
    password: (document.getElementById('teacherPassword') as HTMLInputElement).value.trim(),
    avatar: 'assets/logo-sdn-bobong.png'
  };

  if (!appData.teachers || appData.teachers.length === 0) {
    appData.teachers = [...(INITIAL_DATA as any).teachers];
  }

  const existingIdx = appData.teachers.findIndex(t => t.nip === newT.nip);
  if (existingIdx !== -1) {
    appData.teachers[existingIdx] = newT;
  } else {
    appData.teachers.push(newT);
  }

  saveStorage();
  saveTeacherToSupabase(newT);
  renderDataGuru();
  closeModal();
  alert('Akun guru baru berhasil ditambahkan dan disinkronkan!');
}
