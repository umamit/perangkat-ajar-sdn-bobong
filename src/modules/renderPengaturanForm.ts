import { appData, saveTeacherToSupabase, uploadAvatarToSupabaseStorage } from '../helpers';
import { renderTeacherProfile } from './renderTeacherProfile';

export function renderPengaturanForm(): void {
  const teacher = appData.teacher || ({} as any);
  const set = (id: string, val: string) => {
    const el = document.getElementById(id);
    if (el) (el as HTMLInputElement).value = val;
  };
  set('settingTeacherName',    teacher.name    || '');
  set('settingTeacherNip',     teacher.nip     || '');
  set('settingTeacherSubject', teacher.subject || '');
  set('settingSchoolName',     teacher.school  || 'SD Negeri Bobong');
  set('settingKecamatan',      teacher.kecamatan || 'Kecamatan Taliabu Barat');

  const avatar = document.getElementById('settingAvatarPreview') as HTMLImageElement | null;
  if (avatar) avatar.src = teacher.avatar || 'assets/logo-sdn-bobong.png';
}

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

export async function previewTeacherAvatar(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];

  // Preview lokal segera
  const reader = new FileReader();
  reader.onload = (ev) => {
    const preview = document.getElementById('settingAvatarPreview') as HTMLImageElement | null;
    const sidebar = document.getElementById('teacherAvatarSidebar') as HTMLImageElement | null;
    if (preview && ev.target) preview.src = ev.target.result as string;
    if (sidebar && ev.target) sidebar.src = ev.target.result as string;
  };
  reader.readAsDataURL(file);

  // Upload ke Supabase Storage
  const nip = appData.teacher?.nip || 'unknown';
  const url = await uploadAvatarToSupabaseStorage(file, nip);
  if (url) {
    appData.teacher = { ...appData.teacher, avatar: url };
    saveTeacherToSupabase(appData.teacher as any);
    const preview = document.getElementById('settingAvatarPreview') as HTMLImageElement | null;
    const sidebar = document.getElementById('teacherAvatarSidebar') as HTMLImageElement | null;
    if (preview) preview.src = url;
    if (sidebar) sidebar.src = url;
  }
}
