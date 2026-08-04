import { appData, saveStorage, saveTeacherToSupabase } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderDataGuru } from './renderDataGuru.js';
export function saveTeacher(e) {
    e.preventDefault();
    const name = document.getElementById('teacherName').value;
    const nip = document.getElementById('teacherNip').value;
    const role = document.getElementById('teacherRole').value;
    const generatedId = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    const newTeacher = {
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
