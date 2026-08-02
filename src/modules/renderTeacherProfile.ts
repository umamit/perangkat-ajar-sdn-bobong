import { appData } from '../helpers';
import { renderPengaturanForm } from './renderPengaturanForm';

export function renderTeacherProfile(): void {
  if (appData.teachers && appData.teachers.length > 0) {
    const activeNip = (appData.teacher && appData.teacher.nip) ? appData.teacher.nip : '199610272019032006';
    const matched = appData.teachers.find(t => t.nip === activeNip);
    if (matched) {
      appData.teacher = { ...appData.teacher, ...matched };
    }
  }

  const teacher = appData.teacher || {};
  if (document.getElementById('teacherNameSidebar')) document.getElementById('teacherNameSidebar')!.innerText = teacher.name || 'Husnita Usman, M.Pd.';
  if (document.getElementById('teacherNipSidebar')) document.getElementById('teacherNipSidebar')!.innerText = `NIP: ${teacher.nip || '199610272019032006'}`;
  if (document.getElementById('teacherAvatarSidebar')) (document.getElementById('teacherAvatarSidebar') as HTMLImageElement).src = teacher.avatar || 'logo-sdn-bobong.svg';
  if (document.getElementById('schoolNameHeader')) document.getElementById('schoolNameHeader')!.innerText = teacher.school || 'SD Negeri Bobong';
  if (document.getElementById('schoolKecamatanHeader')) document.getElementById('schoolKecamatanHeader')!.innerText = teacher.kecamatan || 'Kab. Pulau Taliabu';
  renderPengaturanForm();
}
