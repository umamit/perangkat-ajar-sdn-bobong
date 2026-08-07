'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, Teacher, JournalEntry } from '@/types';
import { SISWA_6B_LIST, REAL_6B_NAMES, seedSiswa6BToSupabase } from '@/lib/seedSiswa6B';
import { SISWA_6A_LIST, REAL_6A_NAMES, seedSiswa6AToSupabase } from '@/lib/seedSiswa6A';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedClassFilter: string;
  setSelectedClassFilter: (cls: string) => void;
  activeRoleMode: string;
  setActiveRoleMode: (mode: string) => void;
  currentTeacher: Teacher;
  setCurrentTeacher: (teacher: Teacher) => void;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: any[];
  journals: JournalEntry[];
  setJournals: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  attendance: any[];
  setAttendance: React.Dispatch<React.SetStateAction<any[]>>;
  modules: any[];
  setModules: React.Dispatch<React.SetStateAction<any[]>>;
  flashcards: any[];
  setFlashcards: React.Dispatch<React.SetStateAction<any[]>>;
  assignments: any[];
  setAssignments: React.Dispatch<React.SetStateAction<any[]>>;
  grades: any[];
  setGrades: React.Dispatch<React.SetStateAction<any[]>>;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  syncData: () => Promise<void>;
  isLoading: boolean;
  isInitializing: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  logout: () => void;
}

const defaultTeacher: Teacher = {
  nip: '199610272019032006',
  name: 'Husnita Usman, M.Pd',
  role: 'Kepala Sekolah / Executive Admin',
  subject: 'Bahasa Inggris & Manajemen Sekolah',
  school: 'SD Negeri Bobong',
  kecamatan: 'Kabupaten Pulau Taliabu',
  avatar: '/assets/logo-sdn-bobong.png'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Synchronous lazy state initialization to prevent initial flash glitch
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const localAuth = localStorage.getItem('sdn_bobong_auth');
        const cookieAuth = document.cookie.split('; ').find(row => row.startsWith('sdn_bobong_auth='));
        return localAuth === 'true' || (cookieAuth ? cookieAuth.split('=')[1] === 'true' : false);
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sdn_bobong_teacher');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultTeacher;
  });

  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [activeRoleMode, setActiveRoleMode] = useState<string>('guru_inggris');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([
    { id: '1', title: 'Greetings & Introduction', word: 'Hello / Good Morning', meaning: 'Halo / Selamat Pagi', phase: 'Fase A' },
    { id: '2', title: 'Classroom Objects', word: 'Pencil & Book', meaning: 'Pensil & Buku', phase: 'Fase A' },
    { id: '3', title: 'Numbers 1-20', word: 'One, Two, Three...', meaning: 'Satu, Dua, Tiga...', phase: 'Fase B' }
  ]);
  const [assignments, setAssignments] = useState<any[]>([
    { id: '1', title: 'Tugas 1: Vocabulary Greetings', classId: '1A', dueDate: '2026-08-10', status: 'Aktif' },
    { id: '2', title: 'Tugas 2: Listening & Repeating', classId: '4A', dueDate: '2026-08-12', status: 'Aktif' }
  ]);
  const [grades, setGrades] = useState<any[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const logout = useCallback(() => {
    document.cookie = 'sdn_bobong_auth=; path=/; max-age=0';
    try {
      localStorage.removeItem('sdn_bobong_auth');
      localStorage.removeItem('sdn_bobong_teacher');
    } catch (e) {}
    setIsLoggedIn(false);
    showToast('Anda telah keluar dari aplikasi', 'info');
  }, [showToast]);

  const syncData = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedTeacher = typeof window !== 'undefined'
        ? (() => { try { const s = localStorage.getItem('sdn_bobong_teacher'); return s ? JSON.parse(s) : null; } catch { return null; } })()
        : null;
      const nip = savedTeacher?.nip || '';
      const res = await fetch(`/api/sync${nip ? `?nip=${encodeURIComponent(nip)}` : ''}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success) {
        if (data.teachers && data.teachers.length > 0) {
          const filtered = data.teachers
            .filter((t: any) => t.nip !== '197508201999031002')
            .map((t: any) => {
              if (t.nip === '199610272019032006') {
                return {
                  nip: '199610272019032006',
                  name: 'Husnita Usman, M.Pd',
                  role: 'Kepala Sekolah / Executive Admin',
                  subject: 'Bahasa Inggris & Manajemen Sekolah',
                  password: t.password || 'kepseksdnbobong',
                  avatar: t.avatar_url || '/assets/logo-sdn-bobong.png'
                };
              }
              return {
                nip: t.nip,
                name: t.name,
                role: t.role || 'Guru Mata Pelajaran',
                subject: t.subject || 'Bahasa Inggris',
                password: t.password || 'sdnbobong',
                avatar: t.avatar_url || '/assets/logo-sdn-bobong.png'
              };
            });

          // Ensure 199610272019032006 is present as sole Executive Admin
          const hasAdmin = filtered.some((t: any) => t.nip === '199610272019032006');
          if (!hasAdmin) {
            filtered.unshift({
              nip: '199610272019032006',
              name: 'Husnita Usman, M.Pd',
              role: 'Kepala Sekolah / Executive Admin',
              subject: 'Bahasa Inggris & Manajemen Sekolah',
              password: 'kepseksdnbobong',
              avatar: '/assets/logo-sdn-bobong.png'
            });
          }

          setTeachers(filtered);
        } else {
          setTeachers([{
            nip: '199610272019032006',
            name: 'Husnita Usman, M.Pd',
            role: 'Kepala Sekolah / Executive Admin',
            subject: 'Bahasa Inggris & Manajemen Sekolah',
            password: 'kepseksdnbobong',
            avatar: '/assets/logo-sdn-bobong.png'
          }]);
        }
        if (data.students) {
          const rawStudents = data.students.map((s: any) => ({
            id: s.id,
            nis: s.nis || s.id,
            name: s.name,
            classId: s.class_id,
            gender: s.gender || 'L',
            scoreFormatif: s.score_formatif || 0,
            scoreSumatif: s.score_sumatif || 0,
            scoreSts: s.score_sts || 0,
            scoreSas: s.score_sas || 0
          }));

          // Purge dummy 6A & 6B students that don't match official list
          const loadedStudents = rawStudents.filter((s: any) => {
            if (s.classId === '6B' || s.classId === '6b') {
              return REAL_6B_NAMES.has((s.name || '').toUpperCase());
            }
            if (s.classId === '6A' || s.classId === '6a') {
              return REAL_6A_NAMES.has((s.name || '').toUpperCase());
            }
            return true;
          });

          // Merge official 6A & 6B students if missing
          const existingIds = new Set(loadedStudents.map((s: any) => s.id));
          const missing6B = SISWA_6B_LIST.filter(s => !existingIds.has(s.id));
          const missing6A = SISWA_6A_LIST.filter(s => !existingIds.has(s.id));

          if (missing6B.length > 0 || missing6A.length > 0 || rawStudents.length !== loadedStudents.length) {
            if (missing6B.length > 0 || rawStudents.some((s: any) => s.classId === '6B' && !REAL_6B_NAMES.has(s.name.toUpperCase()))) {
              seedSiswa6BToSupabase();
            }
            if (missing6A.length > 0 || rawStudents.some((s: any) => s.classId === '6A' && !REAL_6A_NAMES.has(s.name.toUpperCase()))) {
              seedSiswa6AToSupabase();
            }

            const officialAdditions = [
              ...missing6B.map(s => ({ id: s.id, nis: s.nis, name: s.name, classId: s.classId, gender: s.gender, scoreFormatif: 0, scoreSumatif: 0, scoreSts: 0, scoreSas: 0 })),
              ...missing6A.map(s => ({ id: s.id, nis: s.nis, name: s.name, classId: s.classId, gender: s.gender, scoreFormatif: 0, scoreSumatif: 0, scoreSts: 0, scoreSas: 0 }))
            ];

            setStudents([...loadedStudents, ...officialAdditions]);
          } else {
            setStudents(loadedStudents);
          }
        }
        if (data.classes && data.classes.length > 0) {
          const classMap = new Map<string, any>();
          data.classes.forEach((c: any) => {
            if (c && c.id && !classMap.has(c.id)) {
              classMap.set(c.id, {
                id: c.id,
                name: c.name,
                phase: c.phase || 'Fase A',
                room: c.room || 'Ruang Kelas'
              });
            }
          });
          setClasses(Array.from(classMap.values()));
        }
        if (data.journals) {
          setJournals(data.journals.map((j: any) => ({
            id: j.id,
            date: j.date,
            time: j.time_slot || '',
            classId: j.class_id,
            topic: j.topic,
            notes: j.notes || '',
            attendance: j.attendance_summary || ''
          })));
        }
        if (data.attendance) {
          setAttendance(data.attendance);
        }
        if (data.modules) {
          setModules(data.modules);
        }
        if (data.flashcards && data.flashcards.length > 0) {
          setFlashcards(data.flashcards);
        }
        if (data.assignments && data.assignments.length > 0) {
          setAssignments(data.assignments.map((a: any) => ({
            id: a.id,
            title: a.title,
            classId: a.class_id,
            dueDate: a.due_date,
            status: a.status || 'Aktif'
          })));
        }
        if (data.grades) {
          setGrades(data.grades);
        }
      }
    } catch (err) {
      console.warn('[Supabase Sync Error]', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncData();
  }, [syncData]);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        activeView,
        setActiveView,
        selectedClassFilter,
        setSelectedClassFilter,
        activeRoleMode,
        setActiveRoleMode,
        currentTeacher,
        setCurrentTeacher,
        teachers,
        setTeachers,
        students,
        setStudents,
        classes,
        journals,
        setJournals,
        attendance,
        setAttendance,
        modules,
        setModules,
        flashcards,
        setFlashcards,
        assignments,
        setAssignments,
        grades,
        setGrades,
        toasts,
        showToast,
        syncData,
        isLoading,
        isInitializing,
        sidebarOpen,
        setSidebarOpen,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
