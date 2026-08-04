// Supabase Configuration & Helpers for Perangkat Ajar SD Negeri Bobong
import { createClient } from '@supabase/supabase-js';
import { Student, JournalEntry, Teacher, AppData } from './types';
import { INITIAL_DATA } from './data';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : null;

const SUPABASE_URL: string = (metaEnv && metaEnv.VITE_SUPABASE_URL)
  ? metaEnv.VITE_SUPABASE_URL
  : "https://evslcvjucmnyxkqwfdye.supabase.co";

const HARDCODED_SERVICE_ROLE_KEY: string = "[REDACTED_KEY]";

const SUPABASE_SERVICE_ROLE_KEY: string = (metaEnv && metaEnv.VITE_SUPABASE_SERVICE_ROLE_KEY)
  ? metaEnv.VITE_SUPABASE_SERVICE_ROLE_KEY
  : HARDCODED_SERVICE_ROLE_KEY;

let supabaseClient: any = null;

export function getSupabase(): any {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  return supabaseClient;
}

export let appData: AppData = { ...INITIAL_DATA };

// Fetch & Sync Data Fresh from Supabase
export async function syncFromSupabase(): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  try {
    const { data: dbClasses } = await client.from('classes').select('id, name, room, phase');
    if (dbClasses && dbClasses.length > 0) {
      const classMap = new Map();
      INITIAL_DATA.classes.forEach(c => classMap.set(c.id, c));
      dbClasses.forEach((c: any) => classMap.set(c.id, { id: c.id, name: c.name, room: c.room || '', phase: c.phase || '' }));
      appData.classes = Array.from(classMap.values());
    }

    const { data: students } = await client.from('students').select('id, nis, name, class_id, gender');
    if (students && students.length > 0) {
      const currentMap = new Map();
      (appData.students || []).forEach(s => currentMap.set(s.id || s.nis, s));

      const fetchedStudents = students.map((s: any) => {
        const existing = currentMap.get(s.id) || currentMap.get(s.nis);
        return {
          id: s.id,
          uuid: s.id,
          nis: s.nis || s.id,
          name: s.name,
          classId: s.class_id,
          gender: s.gender || 'L',
          scoreFormatif: existing ? (existing.scoreFormatif || 80) : 80,
          scoreSumatif: existing ? (existing.scoreSumatif || 80) : 80
        };
      });

      const studentMap = new Map();
      INITIAL_DATA.students.forEach(s => studentMap.set(s.nis || s.id, s));
      (appData.students || []).forEach(s => studentMap.set(s.nis || s.id, s));
      fetchedStudents.forEach(s => studentMap.set(s.nis || s.id, s));
      appData.students = Array.from(studentMap.values());
    } else {
      const studentMap = new Map();
      INITIAL_DATA.students.forEach(s => studentMap.set(s.nis || s.id, s));
      (appData.students || []).forEach(s => studentMap.set(s.nis || s.id, s));
      appData.students = Array.from(studentMap.values());
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

    const { data: attendance } = await client.from('attendance').select('*');
    if (attendance && attendance.length > 0) {
      const grouped: { [key: string]: any } = {};
      attendance.forEach((a: any) => {
        const key = `${a.date}_${a.class_id}`;
        if (!grouped[key]) {
          grouped[key] = { date: a.date, classId: a.class_id, hadir: 0, izin: 0, sakit: 0, alpa: 0 };
        }
        if (a.status === 'Hadir') grouped[key].hadir++;
        else if (a.status === 'Izin') grouped[key].izin++;
        else if (a.status === 'Sakit') grouped[key].sakit++;
        else if (a.status === 'Alpa') grouped[key].alpa++;
      });
      appData.attendance = Object.values(grouped);
    }

    const { data: grades } = await client.from('grades').select('*');
    if (grades && grades.length > 0) {
      grades.forEach((g: any) => {
        const st = appData.students.find(s => s.uuid === g.student_id || s.nis === g.student_id);
        if (st) {
          if (g.type === 'Formatif') st.scoreFormatif = Number(g.score);
          else if (g.type === 'Sumatif') st.scoreSumatif = Number(g.score);
        }
      });
    }

    const { data: modules } = await client.from('modules').select('*');
    if (modules && modules.length > 0) {
      appData.modules = modules.map((m: any) => ({
        id: m.id,
        title: m.title,
        grade: m.phase || 'Kelas 4 SD',
        tp: m.tp || '',
        atp: m.atp || '',
        duration: m.duration || '2 x 35 Menit',
        fileUrl: m.file_url || ''
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

      const activeNip = (appData.teacher && appData.teacher.nip) ? appData.teacher.nip : '199610272019032006';
      const matched = appData.teachers.find((t: any) => t.nip === activeNip);
      if (matched) {
        appData.teacher = { ...appData.teacher, ...matched };
      }
    } else {
      // Fallback ke data lokal jika Supabase belum terisi
      appData.teachers = [...(INITIAL_DATA as any).teachers];
    }

    saveStorage();
    // Re-render hanya komponen yang perlu diperbarui setelah sync (bukan initApp() penuh)
    if (typeof (window as any).renderTeacherProfile === 'function') {
      (window as any).renderTeacherProfile();
    }
    if (typeof (window as any).renderDataGuru === 'function') {
      (window as any).renderDataGuru();
    }
    if (typeof (window as any).renderDashboard === 'function') {
      (window as any).renderDashboard();
    }
    if (typeof (window as any).renderDataSiswa === 'function') {
      (window as any).renderDataSiswa();
    }
    if (typeof (window as any).renderDaftarNilai === 'function') {
      (window as any).renderDaftarNilai();
    }
    if (typeof (window as any).renderJurnal === 'function') {
      (window as any).renderJurnal();
    }
    if (typeof (window as any).renderAbsensi === 'function') {
      (window as any).renderAbsensi();
    }
    if (typeof (window as any).renderAllViews === 'function') {
      (window as any).renderAllViews();
    }

    setupSupabaseRealtime();
  } catch (err) {
    console.warn('[Supabase Sync Warning]', err);
  }
}

// Supabase Real-time WebSockets Subscription (Gratis)
let realtimeChannel: any = null;
export function setupSupabaseRealtime(): void {
  const client = getSupabase();
  if (!client || realtimeChannel) return;

  try {
    realtimeChannel = client
      .channel('sdn-bobong-realtime-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload: any) => {
          console.log('[Supabase Realtime Student Event]', payload);
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newS = payload.new;
            const existingIdx = (appData.students || []).findIndex((s: any) => s.id === newS.id || s.nis === newS.nis);
            const mapped = {
              id: newS.id,
              uuid: newS.id,
              nis: newS.nis || newS.id,
              name: newS.name,
              classId: newS.class_id,
              gender: newS.gender || 'L',
              scoreFormatif: 80,
              scoreSumatif: 80
            };
            if (existingIdx >= 0) {
              appData.students[existingIdx] = {
                ...appData.students[existingIdx],
                ...mapped
              };
            } else {
              appData.students.push(mapped);
            }
          } else if (payload.eventType === 'DELETE') {
            const oldS = payload.old;
            appData.students = (appData.students || []).filter((s: any) => s.id !== oldS.id && s.nis !== oldS.nis);
          }

          if (typeof (window as any).renderDataSiswa === 'function') {
            const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
            const filterVal = selectElem ? selectElem.value : 'ALL';
            (window as any).renderDataSiswa(filterVal);
          }
        }
      )
      .subscribe();
  } catch (e) {
    console.warn('[Supabase Realtime Subscription Warning]', e);
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

// Pure Supabase Sync Handlers (IndexedDB & LocalStorage completely removed)
export function loadStorage(): void {
  // Pure live Supabase sync on login, no browser storage
}

export function saveStorage(): void {
  // Pure live Supabase sync, no browser storage
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
export async function saveStudentToSupabase(s: Student): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const dbId = s.uuid || s.id || (crypto.randomUUID ? crypto.randomUUID() : `st-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
    const payload: any = {
      id: dbId,
      nis: dbId,
      name: s.name,
      class_id: s.classId,
      gender: s.gender || 'L'
    };

    const { data, error } = await client.from('students').upsert(payload, { onConflict: 'id' }).select();

    if (error) {
      console.error('[Supabase Student Save Error]', error.message, error);
      return false;
    }
    if (data && data.length > 0) {
      s.uuid = data[0].id;
      s.id = data[0].id;
      s.nis = data[0].id;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Student Save Exception]', err);
    return false;
  }
}

export async function saveStudentsBatchToSupabase(students: Student[]): Promise<boolean> {
  const client = getSupabase();
  if (!client || !students || students.length === 0) return false;
  try {
    const payload = students.map((s, idx) => {
      const dbId = s.uuid || s.id || (crypto.randomUUID ? crypto.randomUUID() : `st-${Date.now()}-${idx + 1}-${Math.floor(Math.random() * 1000)}`);
      const item: any = {
        id: dbId,
        nis: dbId,
        name: s.name,
        class_id: s.classId,
        gender: s.gender || 'L'
      };
      return item;
    });

    const { error } = await client.from('students').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('[Supabase Students Batch Save Error]', error.message, error);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Students Batch Save Exception]', err);
    return false;
  }
}

export async function deleteStudentFromSupabase(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('students').delete().or(`id.eq.${id},nis.eq.${id}`);
    if (error) {
      console.error('[Supabase Student Delete Error]', error.message, error);
      if (typeof (window as any).showToast === 'function') {
        (window as any).showToast(`⚠️ Gagal Menghapus Siswa di Supabase: ${error.message}`, 'error');
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Student Delete Exception]', err);
    return false;
  }
}

export async function saveJournalToSupabase(j: JournalEntry): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('journals').insert({
      date: j.date,
      time_slot: j.time || '',
      class_id: j.classId,
      topic: j.topic,
      notes: j.notes || '',
      attendance_summary: j.attendance || ''
    });

    if (error) {
      console.error('[Supabase Journal Save Error]', error.message, error);
      if (typeof (window as any).showToast === 'function') {
        (window as any).showToast(`⚠️ Supabase Error Jurnal: ${error.message}`, 'error');
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Journal Save Exception]', err);
    return false;
  }
}

export async function saveTeacherToSupabase(t: Teacher): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('teachers').upsert({
      nip: t.nip,
      name: t.name,
      role: t.role || 'Guru Mata Pelajaran',
      subject: t.subject || 'Bahasa Inggris',
      password: t.password || 'sdnbobong',
      avatar_url: t.avatar || 'assets/logo-sdn-bobong.png'
    }, { onConflict: 'nip' });

    if (error) {
      console.error('[Supabase Teacher Save Error]', error.message, error);
      if (typeof (window as any).showToast === 'function') {
        (window as any).showToast(`⚠️ Supabase Error Guru: ${error.message}`, 'error');
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Teacher Save Exception]', err);
    return false;
  }
}

export async function deleteTeacherFromSupabase(nip: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('teachers').delete().eq('nip', nip);
    if (error) {
      console.error('[Supabase Teacher Delete Error]', error.message, error);
      if (typeof (window as any).showToast === 'function') {
        (window as any).showToast(`⚠️ Gagal Menghapus Guru di Supabase: ${error.message}`, 'error');
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Teacher Delete Exception]', err);
    return false;
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
