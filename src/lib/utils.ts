import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppData } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function getTeacherAssignedClass(role: string, subject: string): string | null {
  const roleLower = (role || '').toLowerCase();
  const subjectLower = (subject || '').toLowerCase();
  
  if (roleLower.includes('kepala sekolah') || roleLower.includes('admin')) {
    return null;
  }
  
  if (roleLower.includes('guru kelas') || roleLower.includes('wali kelas')) {
    const match = (subject + ' ' + role).match(/\b([1-6][A-Z])\b/i);
    return match ? match[1].toUpperCase() : null;
  }
  
  return null;
}
