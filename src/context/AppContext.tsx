'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, Teacher, JournalEntry } from '@/types';

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
  flashcards: any[];
  setFlashcards: React.Dispatch<React.SetStateAction<any[]>>;
  assignments: any[];
  setAssignments: React.Dispatch<React.SetStateAction<any[]>>;
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
  role: 'Guru Mata Pelajaran',
  subject: 'Bahasa Inggris',
  school: 'SD Negeri Bobong',
  kecamatan: 'Kabupaten Pulau Taliabu',
  avatar: '/assets/logo-sdn-bobong.png'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeRoleMode, setActiveRoleMode] = useState<string>('guru_inggris');
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(defaultTeacher);
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
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (data.success) {
        if (data.teachers && data.teachers.length > 0) {
          setTeachers(data.teachers.map((t: any) => ({
            nip: t.nip,
            name: t.name,
            role: t.role || 'Guru Mata Pelajaran',
            subject: t.subject || 'Bahasa Inggris',
            password: t.password || 'sdnbobong',
            avatar: t.avatar_url || '/assets/logo-sdn-bobong.png'
          })));
        }
        if (data.students) {
          setStudents(data.students.map((s: any) => ({
            id: s.id,
            nis: s.nis || s.id,
            name: s.name,
            classId: s.class_id,
            gender: s.gender || 'L',
            scoreFormatif: s.score_formatif || 0,
            scoreSumatif: s.score_sumatif || 0,
            scoreSts: s.score_sts || 0,
            scoreSas: s.score_sas || 0
          })));
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
      }
    } catch (err) {
      console.warn('[Supabase Sync Error]', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const cookieAuth = document.cookie.split('; ').find(row => row.startsWith('sdn_bobong_auth='));
      const localAuth = localStorage.getItem('sdn_bobong_auth');
      const savedTeacherStr = localStorage.getItem('sdn_bobong_teacher');

      const isAuthed = (cookieAuth && cookieAuth.split('=')[1] === 'true') || localAuth === 'true';

      if (isAuthed) {
        setIsLoggedIn(true);
        if (savedTeacherStr) {
          try {
            setCurrentTeacher(JSON.parse(savedTeacherStr));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('[Auth Check Exception]', e);
    } finally {
      setIsInitializing(false);
    }

    syncData();
  }, [syncData]);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        activeView,
        setActiveView,
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
        flashcards,
        setFlashcards,
        assignments,
        setAssignments,
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
