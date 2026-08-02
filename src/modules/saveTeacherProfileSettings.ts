import { appData, saveTeacherToSupabase } from '../helpers';
import { renderTeacherProfile } from './renderTeacherProfile';

export function saveTeacherProfileSettings(e: Event): void {
  e.preventDefault();
  const get = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value.trim() || '';

  appData.teacher = {
    ...appData.teacher,
    name:      get('settingTeacherName'),
    nip:       get('settingTeacherNip'),
    subject:   get('settingTeacherSubject'),
    school:    get('settingSchoolName'),
    kecamatan: get('settingKecamatan')
  };

  saveTeacherToSupabase(appData.teacher as any);
  renderTeacherProfile();
  alert('✅ Profil berhasil disimpan dan disinkronkan!');
}
