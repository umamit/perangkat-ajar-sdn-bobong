import { appData, saveTeacherToSupabase, uploadAvatarToSupabaseStorage } from '../helpers.js';
export async function previewTeacherAvatar(event) {
    const input = event.target;
    if (!input.files || input.files.length === 0)
        return;
    const file = input.files[0];
    // Preview lokal segera
    const reader = new FileReader();
    reader.onload = (ev) => {
        const preview = document.getElementById('settingAvatarPreview');
        const sidebar = document.getElementById('teacherAvatarSidebar');
        if (preview && ev.target)
            preview.src = ev.target.result;
        if (sidebar && ev.target)
            sidebar.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    // Upload ke Supabase Storage
    const nip = appData.teacher?.nip || 'unknown';
    const url = await uploadAvatarToSupabaseStorage(file, nip);
    if (url) {
        appData.teacher = { ...appData.teacher, avatar: url };
        saveTeacherToSupabase(appData.teacher);
        const preview = document.getElementById('settingAvatarPreview');
        const sidebar = document.getElementById('teacherAvatarSidebar');
        if (preview)
            preview.src = url;
        if (sidebar)
            sidebar.src = url;
    }
}
