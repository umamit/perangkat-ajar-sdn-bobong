import { appData } from '../helpers';

export function renderPengaturanForm(): void {
  const teacher = appData.teacher || {};
  if (document.getElementById('settingTeacherName')) (document.getElementById('settingTeacherName') as HTMLInputElement).value = teacher.name || 'Husnita Usman, M.Pd.';
  if (document.getElementById('settingTeacherNip')) (document.getElementById('settingTeacherNip') as HTMLInputElement).value = teacher.nip || '199610272019032006';
  if (document.getElementById('settingTeacherSubject')) (document.getElementById('settingTeacherSubject') as HTMLInputElement).value = teacher.subject || 'Bahasa Inggris';
  if (document.getElementById('settingSchoolName')) (document.getElementById('settingSchoolName') as HTMLInputElement).value = teacher.school || 'SD Negeri Bobong';
  if (document.getElementById('settingKecamatan')) (document.getElementById('settingKecamatan') as HTMLInputElement).value = teacher.kecamatan || 'Kecamatan Taliabu Barat';
  if (document.getElementById('settingAvatarPreview')) (document.getElementById('settingAvatarPreview') as HTMLImageElement).src = teacher.avatar || 'logo-sdn-bobong.svg';
}
