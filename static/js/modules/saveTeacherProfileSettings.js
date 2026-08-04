import { appData, saveTeacherToSupabase } from '../helpers.js';
import { renderTeacherProfile } from './renderTeacherProfile.js';
export function saveTeacherProfileSettings(e) {
    e.preventDefault();
    const get = (id) => document.getElementById(id)?.value.trim() || '';
    appData.teacher = {
        ...appData.teacher,
        name: get('settingTeacherName'),
        nip: get('settingTeacherNip'),
        subject: get('settingTeacherSubject'),
        school: get('settingSchoolName'),
        kecamatan: get('settingKecamatan')
    };
    saveTeacherToSupabase(appData.teacher);
    renderTeacherProfile();
    alert('✅ Profil berhasil disimpan dan disinkronkan!');
}
