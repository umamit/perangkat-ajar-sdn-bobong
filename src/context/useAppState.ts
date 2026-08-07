import { useState, useEffect, useCallback } from 'react';
import { Student, Teacher, JournalEntry } from '@/types';
import { verifyAndCleanClass6Students } from '@/lib/syncHelpers';
import { saveAppCache, loadAppCache, flushOfflineQueue } from '@/lib/offlineSync';
import { mapTeachers, mapStudents, mapClasses, mapJournals, mapAssignments, defaultAdminTeacher } from './syncMappers';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const defaultTeacher: Teacher = {
  nip: '199610272019032006',
  name: 'Husnita Usman, M.Pd',
  role: 'Kepala Sekolah / Executive Admin',
  subject: 'Bahasa Inggris & Manajemen Sekolah',
  school: 'SD Negeri Bobong',
  kecamatan: 'Kabupaten Pulau Taliabu',
  avatar: '/assets/logo-sdn-bobong.png'
};

export function useAppState() {
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
  
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const cache = loadAppCache();
    return cache?.teachers || [];
  });
  const [students, setStudents] = useState<Student[]>(() => {
    const cache = loadAppCache();
    return cache?.students || [];
  });
  const [classes, setClasses] = useState<any[]>(() => {
    const cache = loadAppCache();
    return cache?.classes || [];
  });
  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const cache = loadAppCache();
    return cache?.journals || [];
  });
  const [attendance, setAttendance] = useState<any[]>(() => {
    const cache = loadAppCache();
    return cache?.attendance || [];
  });
  const [modules, setModules] = useState<any[]>(() => {
    const cache = loadAppCache();
    return cache?.modules || [];
  });
  const [flashcards, setFlashcards] = useState<any[]>(() => {
    const cache = loadAppCache();
    return cache?.flashcards || [
      { id: '1', title: 'Greetings & Introduction', word: 'Hello / Good Morning', meaning: 'Halo / Selamat Pagi', phase: 'Fase A' },
      { id: '2', title: 'Classroom Objects', word: 'Pencil & Book', meaning: 'Pensil & Buku', phase: 'Fase A' },
      { id: '3', title: 'Numbers 1-20', word: 'One, Two, Three...', meaning: 'Satu, Dua, Tiga...', phase: 'Fase B' }
    ];
  });
  const [assignments, setAssignments] = useState<any[]>(() => {
    const cache = loadAppCache();
    return cache?.assignments || [
      { id: '1', title: 'Tugas 1: Vocabulary Greetings', classId: '1A', dueDate: '2026-08-10', status: 'Aktif' }
    ];
  });
  const [grades, setGrades] = useState<any[]>(() => {
    const cache = loadAppCache();
    return cache?.grades || [];
  });
  
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
      const res = await fetch(`/api/sync${nip ? `?nip=${encodeURIComponent(nip)}` : ''}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        const filtered = data.teachers?.length > 0 ? mapTeachers(data.teachers) : [defaultAdminTeacher];
        setTeachers(filtered);

        const finalStudents = data.students ? mapStudents(data.students) : [];
        if (data.students) setStudents(finalStudents);

        const mappedClasses = mapClasses(data.classes || []);
        if (data.classes?.length > 0) setClasses(mappedClasses);

        const mappedJournals = mapJournals(data.journals || []);
        if (data.journals) setJournals(mappedJournals);

        if (data.attendance) setAttendance(data.attendance);
        if (data.modules) setModules(data.modules);
        if (data.flashcards?.length > 0) setFlashcards(data.flashcards);

        const mappedAssignments = mapAssignments(data.assignments || []);
        if (data.assignments?.length > 0) setAssignments(mappedAssignments);
        if (data.grades) setGrades(data.grades);

        saveAppCache({
          teachers: filtered,
          students: finalStudents,
          classes: mappedClasses,
          journals: mappedJournals,
          attendance: data.attendance || [],
          modules: data.modules || [],
          flashcards: data.flashcards || [],
          assignments: mappedAssignments,
          grades: data.grades || []
        });
      }
    } catch (err) {
      console.warn('[Supabase Sync Error]', err);
      const cache = loadAppCache();
      if (cache) {
        if (cache.teachers) setTeachers(cache.teachers);
        if (cache.students) setStudents(cache.students);
        if (cache.classes) setClasses(cache.classes);
        if (cache.journals) setJournals(cache.journals);
        if (cache.attendance) setAttendance(cache.attendance);
        if (cache.modules) setModules(cache.modules);
        if (cache.flashcards) setFlashcards(cache.flashcards);
        if (cache.assignments) setAssignments(cache.assignments);
        if (cache.grades) setGrades(cache.grades);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoggedIn,
    setIsLoggedIn,
    currentTeacher,
    setCurrentTeacher,
    isInitializing,
    setIsInitializing,
    activeView,
    setActiveView,
    selectedClassFilter,
    setSelectedClassFilter,
    activeRoleMode,
    setActiveRoleMode,
    teachers,
    setTeachers,
    students,
    setStudents,
    classes,
    setClasses,
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
    isLoading,
    sidebarOpen,
    setSidebarOpen,
    showToast,
    logout,
    syncData
  };
}
