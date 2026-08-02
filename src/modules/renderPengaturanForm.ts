import { appData } from '../helpers';

export function renderPengaturanForm(): void {
  const teacher = appData.teacher || ({} as any);
  const set = (id: string, val: string) => {
    const el = document.getElementById(id);
    if (el) (el as HTMLInputElement).value = val;
  };
  set('settingTeacherName',    teacher.name      || '');
  set('settingTeacherNip',     teacher.nip       || '');
  set('settingTeacherSubject', teacher.subject   || '');
  set('settingSchoolName',     teacher.school    || 'SD Negeri Bobong');
  set('settingKecamatan',      teacher.kecamatan || 'Kecamatan Taliabu Barat');

  const avatar = document.getElementById('settingAvatarPreview') as HTMLImageElement | null;
  if (avatar) avatar.src = teacher.avatar || 'assets/logo-sdn-bobong.png';
}
