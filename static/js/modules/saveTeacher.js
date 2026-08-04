import { appData, saveStorage, saveTeacherToSupabase } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderDataGuru } from './renderDataGuru.js';
export function saveTeacher(e) {
    e.preventDefault();
    const name = document.getElementById('teacherName').value;
    const nip = document.getElementById('teacherNip').value;
    const role = document.getElementById('teacherRole').value;
    const newTeacher = {
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
