// Supabase Configuration & Helpers for Perangkat Ajar SD Negeri Bobong
import { Student, JournalEntry, Teacher, AppData } from './types';
import { INITIAL_DATA } from './data';

const SUPABASE_URL: string = "https://evslcvjucmnyxkqwfdye.supabase.co";
const SUPABASE_ANON_KEY: string = "[REDACTED_KEY]";

let supabaseClient: any = null;

export function getSupabase(): any {
  if (!supabaseClient && typeof window !== 'undefined' && (window as any).supabase && SUPABASE_ANON_KEY) {
    supabaseClient = (window as any).supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

export let appData: AppData = { ...INITIAL_DATA };

// Fetch & Sync Data from Supabase
export async function syncFromSupabase(): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  try {
    const { data: students } = await client.from('students').select('id, nis, name, class_id, gender');
    if (students && students.length > 0) {
      appData.students = students.map((s: any) => ({
        id: s.nis,
        uuid: s.id,
        nis: s.nis,
        name: s.name,
        classId: s.class_id,
        gender: s.gender || 'L'
      }));
    } else {
      appData.students = [...INITIAL_DATA.students];
    }

    const { data: journals } = await client.from('journals').select('id, date, time_slot, class_id, topic, notes, attendance_summary');
    if (journals && journals.length > 0) {
      appData.journals = journals.map((j: any) => ({
        id: j.id,
        date: j.date,
        time: j.time_slot || '',
        classId: j.class_id,
        topic: j.topic,
        notes: j.notes || '',
        attendance: j.attendance_summary || ''
      }));
    }

    const { data: teachers } = await client.from('teachers').select('id, nip, name, role, subject, password, avatar_url, is_active');
    if (teachers && teachers.length > 0) {
      appData.teachers = teachers.map((t: any) => ({
        id: t.id,
        nip: t.nip,
        name: t.name,
        role: t.role || 'Guru Mata Pelajaran',
        subject: t.subject || 'Bahasa Inggris',
        password: t.password || 'sdnbobong',
        avatar: t.avatar_url || 'assets/logo-sdn-bobong.png',
        isActive: t.is_active !== false
      }));
    }

    saveStorage();
    if (typeof (window as any).renderAllViews === 'function') {
      (window as any).renderAllViews();
    }
  } catch (err) {
    console.warn('[Supabase Sync Warning]', err);
  }
}

// In-Memory Storage Handlers (Storage API completely removed)
export function setCookie(name: string, value: string, days: number = 7): void {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('[Cookie Error]', e);
  }
}

export function getCookie(name: string): string | null {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
  } catch (e) {
    console.warn('[Cookie Error]', e);
  }
  return null;
}

export function eraseCookie(name: string): void {
  try {
    document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('[Cookie Error]', e);
  }
}

export function loadStorage(): void {
  if (!appData) {
    appData = { ...INITIAL_DATA };
  }
}

export function saveStorage(): void {
  // Data state is held in memory and synced live with Supabase
}

// Password Visibility Toggle
export function togglePasswordVisibility(): void {
  const pwdInput = document.getElementById('loginPassword') as HTMLInputElement | null;
  const icon = document.getElementById('togglePasswordIcon');
  if (!pwdInput || !icon) return;
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    icon.className = 'ri-eye-off-line';
  } else {
    pwdInput.type = 'password';
    icon.className = 'ri-eye-line';
  }
}

// Text to Speech (TTS) for English Pronunciation
export function speakText(event: Event | null, text: string): void {
  if (event) event.stopPropagation();
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

// Flashcard Flip Interaction
export function flipCard(cardEl: HTMLElement): void {
  cardEl.classList.toggle('flipped');
}

// Register PWA Service Worker
export function registerPwaServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch(err => console.error('[PWA] Service Worker registration failed:', err));
    });
  }
}
registerPwaServiceWorker();

// Supabase Real-time Mutations
export async function saveStudentToSupabase(s: Student): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('students').upsert({
      nis: s.nis || s.id,
      name: s.name,
      class_id: s.classId,
      gender: s.gender || 'L'
    }, { onConflict: 'nis' });
  } catch (err) {
    console.warn('[Supabase Student Save Warning]', err);
  }
}

export async function deleteStudentFromSupabase(nis: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('students').delete().eq('nis', nis);
  } catch (err) {
    console.warn('[Supabase Student Delete Warning]', err);
  }
}

export async function saveJournalToSupabase(j: JournalEntry): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('journals').insert({
      date: j.date,
      time_slot: j.time || '',
      class_id: j.classId,
      topic: j.topic,
      notes: j.notes || '',
      attendance_summary: j.attendance || ''
    });
  } catch (err) {
    console.warn('[Supabase Journal Save Warning]', err);
  }
}

export async function saveTeacherToSupabase(t: Teacher): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('teachers').upsert({
      nip: t.nip,
      name: t.name,
      role: t.role || 'Guru Mata Pelajaran',
      subject: t.subject || 'Bahasa Inggris',
      password: t.password || 'sdnbobong',
      avatar_url: t.avatar || 'assets/logo-sdn-bobong.png'
    }, { onConflict: 'nip' });
  } catch (err) {
    console.warn('[Supabase Teacher Save Warning]', err);
  }
}

export async function deleteTeacherFromSupabase(nip: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('teachers').delete().eq('nip', nip);
  } catch (err) {
    console.warn('[Supabase Teacher Delete Warning]', err);
  }
}

export async function uploadAvatarToSupabaseStorage(file: File, nip: string): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `teacher_${nip}_${Date.now()}.${ext}`;

    const { data, error } = await client.storage
      .from('avatars')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      console.warn('[Supabase Storage Upload Error]', error);
      return null;
    }

    const { data: publicUrlData } = client.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrlData ? publicUrlData.publicUrl : null;
  } catch (err) {
    console.warn('[Supabase Storage Exception]', err);
    return null;
  }
}

// Global Browser Window State Attachment
if (typeof window !== 'undefined') {
  (window as any).getSupabase = getSupabase;
  (window as any).syncFromSupabase = syncFromSupabase;
  (window as any).loadStorage = loadStorage;
  (window as any).saveStorage = saveStorage;
  (window as any).togglePasswordVisibility = togglePasswordVisibility;
  (window as any).speakText = speakText;
  (window as any).flipCard = flipCard;
  (window as any).saveStudentToSupabase = saveStudentToSupabase;
  (window as any).deleteStudentFromSupabase = deleteStudentFromSupabase;
  (window as any).saveJournalToSupabase = saveJournalToSupabase;
  (window as any).saveTeacherToSupabase = saveTeacherToSupabase;
  (window as any).deleteTeacherFromSupabase = deleteTeacherFromSupabase;
  (window as any).uploadAvatarToSupabaseStorage = uploadAvatarToSupabaseStorage;
  (window as any).appData = appData;
}
