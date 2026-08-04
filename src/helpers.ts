import { createClient } from '@supabase/supabase-js';
import { AppData } from './types';

export let appData: AppData = {
  teacher: {
    nip: '199610272019032006',
    name: 'Husnita Usman, M.Pd',
    role: 'Guru Mata Pelajaran',
    subject: 'Bahasa Inggris',
    school: 'SD Negeri Bobong',
    kecamatan: 'Kabupaten Pulau Taliabu',
    avatar: '/assets/logo-sdn-bobong.png'
  },
  teachers: [],
  classes: [
    { id: '1A', name: 'Kelas 1 - A', count: 24, room: 'Ruang 01', phase: 'Fase A' },
    { id: '1B', name: 'Kelas 1 - B', count: 24, room: 'Ruang 02', phase: 'Fase A' },
    { id: '2A', name: 'Kelas 2 - A', count: 22, room: 'Ruang 03', phase: 'Fase A' },
    { id: '2B', name: 'Kelas 2 - B', count: 22, room: 'Ruang 04', phase: 'Fase A' },
    { id: '3A', name: 'Kelas 3 - A', count: 25, room: 'Ruang 05', phase: 'Fase B' },
    { id: '3B', name: 'Kelas 3 - B', count: 25, room: 'Ruang 06', phase: 'Fase B' },
    { id: '4A', name: 'Kelas 4 - A', count: 26, room: 'Ruang 07', phase: 'Fase B' },
    { id: '4B', name: 'Kelas 4 - B', count: 26, room: 'Ruang 08', phase: 'Fase B' },
    { id: '5A', name: 'Kelas 5 - A', count: 28, room: 'Ruang 09', phase: 'Fase C' },
    { id: '5B', name: 'Kelas 5 - B', count: 28, room: 'Ruang 10', phase: 'Fase C' },
    { id: '6A', name: 'Kelas 6 - A', count: 25, room: 'Ruang 11', phase: 'Fase C' },
    { id: '6B', name: 'Kelas 6 - B', count: 25, room: 'Ruang 12', phase: 'Fase C' }
  ],
  students: [],
  attendance: [],
  journals: [],
  modules: [],
  schedules: [],
  timetable: [],
  flashcards: [],
  quizQuestions: []
};

let cachedSupabase: any = null;

export function getSupabase() {
  if (cachedSupabase) return cachedSupabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://evslcvjucmnyxkqwfdye.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2xjdmp1Y21ueXhrcXdmZHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjQ4NzYsImV4cCI6MjEwMTI0MDg3Nn0.7b4J7bK8B7G6F5E4D3C2B1A0';

  cachedSupabase = createClient(url, key);
  return cachedSupabase;
}

export function loadStorage() {
  return appData;
}

export function saveStorage() {
  return appData;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

export function eraseCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
}

export async function syncFromSupabase() {
  try {
    const supabase = getSupabase();
    const [tRes, cRes, sRes] = await Promise.all([
      supabase.from('teachers').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('students').select('*')
    ]);
    if (tRes.data) appData.teachers = tRes.data;
    if (cRes.data) appData.classes = cRes.data;
    if (sRes.data) appData.students = sRes.data;
  } catch (e) {
    console.warn('[Sync Error]', e);
  }
}

export async function deleteStudentFromSupabase(id: string) {
  try {
    const supabase = getSupabase();
    await supabase.from('students').delete().eq('id', id);
  } catch (e) {
    console.warn('[Delete Student Error]', e);
  }
}

export async function saveStudentToSupabase(student: any) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('students').upsert(student);
    return !error;
  } catch (e) {
    console.warn('[Save Student Error]', e);
    return false;
  }
}

export async function saveTeacherToSupabase(teacher: any) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('teachers').upsert(teacher);
    return !error;
  } catch (e) {
    console.warn('[Save Teacher Error]', e);
    return false;
  }
}

export async function saveJournalToSupabase(journal: any) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('journals').upsert(journal);
    return !error;
  } catch (e) {
    console.warn('[Save Journal Error]', e);
    return false;
  }
}

export async function saveGradeToSupabase(studentIdOrGrade: any, type?: string, score?: number, classId?: string) {
  try {
    const supabase = getSupabase();
    const payload = typeof studentIdOrGrade === 'object' ? studentIdOrGrade : {
      student_id: studentIdOrGrade,
      type: type,
      score: score,
      class_id: classId
    };
    const { error } = await supabase.from('grades').upsert(payload);
    return !error;
  } catch (e) {
    console.warn('[Save Grade Error]', e);
    return false;
  }
}

export async function uploadAvatarToSupabaseStorage(file: File, nip?: string) {
  try {
    return '/assets/logo-sdn-bobong.png';
  } catch (e) {
    return '/assets/logo-sdn-bobong.png';
  }
}
