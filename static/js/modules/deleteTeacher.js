import { appData, saveStorage, deleteTeacherFromSupabase } from '../helpers.js';
import { INITIAL_DATA } from '../data.js';
import { renderDataGuru } from './renderDataGuru.js';
export function deleteTeacher(nip) {
    const activeNip = (appData.teacher && appData.teacher.nip) ? appData.teacher.nip : '';
    if (nip === activeNip) {
        alert(`Akun ${appData.teacher.name || 'Anda'} yang sedang aktif tidak dapat dihapus demi keamanan sistem.`);
        return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun guru NIP ${nip}?`)) {
        appData.teachers = (appData.teachers || []).filter(t => t.nip !== nip);
        if (appData.teachers.length === 0) {
            appData.teachers = [...INITIAL_DATA.teachers];
        }
        saveStorage();
        deleteTeacherFromSupabase(nip);
        renderDataGuru();
    }
}
