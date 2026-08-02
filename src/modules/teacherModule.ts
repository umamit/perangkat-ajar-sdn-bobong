// Teacher Profile & Account Module
import { appData, saveStorage, saveTeacherToSupabase, deleteTeacherFromSupabase, uploadAvatarToSupabaseStorage } from '../helpers';
import { INITIAL_DATA } from '../data';

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
  if (document.getElementById('schoolKecamatanHeader')) document.getElementById('schoolKecamatanHeader')!.innerText = teacher.kecamatan || 'Kecamatan Taliabu Barat';
  renderPengaturanForm();
}

export function renderPengaturanForm(): void {
  const teacher = appData.teacher || {};
  if (document.getElementById('settingTeacherName')) (document.getElementById('settingTeacherName') as HTMLInputElement).value = teacher.name || 'Husnita Usman, M.Pd.';
  if (document.getElementById('settingTeacherNip')) (document.getElementById('settingTeacherNip') as HTMLInputElement).value = teacher.nip || '199610272019032006';
  if (document.getElementById('settingTeacherSubject')) (document.getElementById('settingTeacherSubject') as HTMLInputElement).value = teacher.subject || 'Bahasa Inggris';
  if (document.getElementById('settingSchoolName')) (document.getElementById('settingSchoolName') as HTMLInputElement).value = teacher.school || 'SD Negeri Bobong';
  if (document.getElementById('settingKecamatan')) (document.getElementById('settingKecamatan') as HTMLInputElement).value = teacher.kecamatan || 'Kecamatan Taliabu Barat';
  if (document.getElementById('settingAvatarPreview')) (document.getElementById('settingAvatarPreview') as HTMLImageElement).src = teacher.avatar || 'logo-sdn-bobong.svg';
}

export function getTeacherClasses(): any[] {
  const activeMode = (appData as any).activeRoleMode || 'guru_inggris';
  const selectElem = document.getElementById('roleModeSelect') as HTMLSelectElement | null;
  if (selectElem && selectElem.value !== activeMode) {
    selectElem.value = activeMode;
  }
  
  if (activeMode === 'guru_inggris') {
    return appData.classes.filter(c => !c.id.startsWith('1') && !c.id.startsWith('2'));
  }
  return appData.classes;
}

export function renderDataGuru(): void {
  const tbody = document.getElementById('teacherTableBody');
  if (!tbody) return;

  const teachers = (appData.teachers && appData.teachers.length > 0) ? appData.teachers : [(INITIAL_DATA as any).teacher];
  tbody.innerHTML = teachers.map((t: any) => `
    <tr>
      <td><strong>${t.nip}</strong></td>
      <td>${t.name}</td>
      <td>${t.subject || 'Guru Mata Pelajaran'}</td>
      <td><span class="badge badge-info">${t.role || 'Guru'}</span></td>
      <td><span class="badge badge-success">Aktif</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="deleteTeacher('${t.nip}')" style="padding:4px 8px; font-size:12px; color:#dc2626;" title="Hapus Guru">
          <i class="ri-delete-bin-line"></i> Hapus
        </button>
      </td>
    </tr>
  `).join('');
}

export function deleteTeacher(nip: string): void {
  if (nip === '199610272019032006') {
    alert('Akun utama Husnita Usman, M.Pd. (Plt. Kepala Sekolah) tidak dapat dihapus demi keamanan sistem.');
    return;
  }

  if (confirm(`Apakah Anda yakin ingin menghapus akun guru NIP ${nip}?`)) {
    appData.teachers = (appData.teachers || []).filter(t => t.nip !== nip);
    if (appData.teachers.length === 0) {
      appData.teachers = [...(INITIAL_DATA as any).teachers];
    }
    saveStorage();
    deleteTeacherFromSupabase(nip);
    renderDataGuru();
  }
}
