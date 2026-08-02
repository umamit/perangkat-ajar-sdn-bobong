import { appData, saveTeacherToSupabase, uploadAvatarToSupabaseStorage } from '../helpers';

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
