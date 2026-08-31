import { useState, useEffect, useCallback } from 'react';
import { Student, Teacher, JournalEntry, ClassInfo, AttendanceRecord, ModuleAjar, FlashcardItem, TaskItem, GradeRecord, CounselingLog, Schedule, SchoolSettings } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { verifyAndCleanClass6Students } from '@/lib/syncHelpers';
import { saveAppCache, loadAppCache, flushOfflineQueue } from '@/lib/offlineSync';
import { mapTeachers, mapStudents, mapClasses, mapJournals, mapAssignments, mapCounselingLogs, mapModules, defaultAdminTeacher } from './syncMappers';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const defaultSchoolSettings: SchoolSettings = {
  id: 'global',
  school_name: 'SD Negeri Bobong',
  npsn: '60101234',
  academic_year: '2026/2027',
  semester: 'Ganjil',
  headmaster_name: 'Husnita Usman, M.Pd',
  headmaster_nip: '199610272019032006'
};

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(defaultTeacher);

  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    // Run client-side check to confirm auth and restore session safely
    try {
      const localAuth = localStorage.getItem('sdn_bobong_auth');
      const cookieAuth = document.cookie.split('; ').find(row => row.startsWith('sdn_bobong_auth='));
      const authed = localAuth === 'true' || (cookieAuth ? cookieAuth.split('=')[1] === 'true' : false);
      
      setIsLoggedIn(authed);
      if (authed) {
        const saved = localStorage.getItem('sdn_bobong_teacher');
        if (saved) {
          setCurrentTeacher(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.warn('[Session Recovery Failed]', e);
    } finally {
      setIsInitializing(false);
    }
  }, []);
  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('sdn_bobong_active_view') || 'dashboard';
      } catch (e) {
        return 'dashboard';
      }
    }
    return 'dashboard';
  });

  useEffect(() => {
    try {
      localStorage.setItem('sdn_bobong_active_view', activeView);
    } catch (e) {}
  }, [activeView]);

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
  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    const cache = loadAppCache();
    return cache?.classes || [];
  });
  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const cache = loadAppCache();
    return cache?.journals || [];
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const cache = loadAppCache();
    return cache?.attendance || [];
  });
  const [modules, setModules] = useState<ModuleAjar[]>(() => {
    const cache = loadAppCache();
    return cache?.modules || [];
  });
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(() => {
    const cache = loadAppCache();
    return cache?.flashcards || [
      { id: 1, word: 'Hello / Good Morning', translate: 'Halo / Selamat Pagi', example: '', category: 'Greetings', phase: 'Fase A' },
      { id: 2, word: 'Pencil & Book', translate: 'Pensil & Buku', example: '', category: 'Classroom Objects', phase: 'Fase A' },
      { id: 3, word: 'One, Two, Three...', translate: 'Satu, Dua, Tiga...', example: '', category: 'Numbers', phase: 'Fase B' }
    ];
  });
  const [assignments, setAssignments] = useState<TaskItem[]>(() => {
    const cache = loadAppCache();
    return cache?.assignments || [
      { id: '1', title: 'Tugas 1: Vocabulary Greetings', classId: '1A', dueDate: '2026-08-10', type: 'Tugas', status: 'Aktif', description: '' }
    ];
  });
  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const cache = loadAppCache();
    return cache?.grades || [];
  });
  const [counselingLogs, setCounselingLogs] = useState<CounselingLog[]>(() => {
    const cache = loadAppCache();
    return cache?.counselingLogs || [];
  });
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const cache = loadAppCache();
    return cache?.schedules || [];
  });
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    const cache = loadAppCache();
    return cache?.schoolSettings || defaultSchoolSettings;
  });
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('sdn_bobong_sidebar_collapsed') === 'true';
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    try {
      localStorage.setItem('sdn_bobong_sidebar_collapsed', String(collapsed));
    } catch (e) {}
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const logout = useCallback(() => {
    document.cookie = 'sdn_bobong_auth=; path=/; max-age=0';
    document.cookie = 'sdn_bobong_nip=; path=/; max-age=0';
    try {
      localStorage.removeItem('sdn_bobong_auth');
      localStorage.removeItem('sdn_bobong_teacher');
      localStorage.removeItem('sdn_bobong_cache');
      localStorage.removeItem('sdn_bobong_active_view');
    } catch (e) {}

    // Reset memory state immediately to secure teacher privacy
    setTeachers([]);
    setStudents([]);
    setClasses([]);
    setJournals([]);
    setAttendance([]);
    setModules([]);
    setActiveView('dashboard');
    setFlashcards([
      { id: 1, word: 'Hello / Good Morning', translate: 'Halo / Selamat Pagi', example: '', category: 'Greetings', phase: 'Fase A' },
      { id: 2, word: 'Pencil & Book', translate: 'Pensil & Buku', example: '', category: 'Classroom Objects', phase: 'Fase A' },
      { id: 3, word: 'One, Two, Three...', translate: 'Satu, Dua, Tiga...', example: '', category: 'Numbers', phase: 'Fase B' }
    ]);
    setAssignments([
      { id: '1', title: 'Tugas 1: Vocabulary Greetings', classId: '1A', dueDate: '2026-08-10', type: 'Tugas', status: 'Aktif', description: '' }
    ]);
    setGrades([]);
    setCounselingLogs([]);
    setSchedules([]);
    setSchoolSettings(defaultSchoolSettings);

    setIsLoggedIn(false);
    showToast('Anda telah keluar dari aplikasi', 'info');
  }, [showToast]);

  const { refetch: refetchSync } = useQuery({
    queryKey: ['syncData', currentTeacher?.nip || ''],
    queryFn: async () => {
      const nip = currentTeacher?.nip || '';
      const res = await fetch(`/api/sync${nip ? `?nip=${encodeURIComponent(nip)}` : ''}`, { cache: 'no-store' });
      return res.json();
    },
    enabled: false,
  });

  const syncData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await refetchSync();
      if (data && data.success) {
        const filtered = data.teachers?.length > 0 ? mapTeachers(data.teachers) : [defaultAdminTeacher];
        setTeachers(filtered);

        const finalStudents = data.students ? mapStudents(data.students) : [];
        if (data.students) setStudents(finalStudents);

        const mappedClasses = mapClasses(data.classes || []);
        if (data.classes) setClasses(mappedClasses);

        const mappedJournals = mapJournals(data.journals || []);
        if (data.journals) setJournals(mappedJournals);

        if (data.attendance) setAttendance(data.attendance);
        const mappedModules = mapModules(data.modules || []);
        if (data.modules) setModules(mappedModules);
        if (data.flashcards) setFlashcards(data.flashcards);

        const mappedAssignments = mapAssignments(data.assignments || []);
        if (data.assignments) setAssignments(mappedAssignments);
        if (data.grades) setGrades(data.grades);
        
        const mappedCounseling = mapCounselingLogs(data.counselingLogs || []);
        if (data.counselingLogs) setCounselingLogs(mappedCounseling);
        if (data.schedules) setSchedules(data.schedules);
        if (data.schoolSettings) setSchoolSettings(data.schoolSettings);

        saveAppCache({
          teachers: filtered,
          students: finalStudents,
          classes: mappedClasses,
          journals: mappedJournals,
          attendance: data.attendance || [],
          modules: mappedModules,
          flashcards: data.flashcards || [],
          assignments: mappedAssignments,
          grades: data.grades || [],
          counselingLogs: mappedCounseling,
          schedules: data.schedules || [],
          schoolSettings: data.schoolSettings
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
        if (cache.counselingLogs) setCounselingLogs(cache.counselingLogs);
        if (cache.schedules) setSchedules(cache.schedules);
        if (cache.schoolSettings) setSchoolSettings(cache.schoolSettings);
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
    counselingLogs,
    setCounselingLogs,
    schedules,
    setSchedules,
    schoolSettings,
    setSchoolSettings,
    toasts,
    isLoading,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    showToast,
    logout,
    syncData
  };
}
