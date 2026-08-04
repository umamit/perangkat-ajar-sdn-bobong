import { appData } from '../helpers.js';
export function renderPengaturanForm() {
    const teacher = appData.teacher || {};
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el)
            el.value = val;
    };
    set('settingTeacherName', teacher.name || '');
    set('settingTeacherNip', teacher.nip || '');
    set('settingTeacherSubject', teacher.subject || '');
    set('settingSchoolName', teacher.school || 'SD Negeri Bobong');
    set('settingKecamatan', teacher.kecamatan || 'Kabupaten Pulau Taliabu');
    const avatar = document.getElementById('settingAvatarPreview');
    if (avatar)
        avatar.src = teacher.avatar || 'assets/logo-sdn-bobong.png';
}
