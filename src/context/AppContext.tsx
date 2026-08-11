'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { Student, Teacher, JournalEntry, ClassInfo, AttendanceRecord, ModuleAjar, FlashcardItem, TaskItem, GradeRecord, CounselingLog, Schedule, SchoolSettings } from '@/types';
import { useAppState, ToastMessage } from './useAppState';
import { flushOfflineQueue } from '@/lib/offlineSync';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

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
  classes: ClassInfo[];
  setClasses: React.Dispatch<React.SetStateAction<ClassInfo[]>>;
  journals: JournalEntry[];
  setJournals: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  modules: ModuleAjar[];
  setModules: React.Dispatch<React.SetStateAction<ModuleAjar[]>>;
  flashcards: FlashcardItem[];
  setFlashcards: React.Dispatch<React.SetStateAction<FlashcardItem[]>>;
  assignments: TaskItem[];
  setAssignments: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  grades: GradeRecord[];
  setGrades: React.Dispatch<React.SetStateAction<GradeRecord[]>>;
  counselingLogs: CounselingLog[];
  setCounselingLogs: React.Dispatch<React.SetStateAction<CounselingLog[]>>;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  schoolSettings: SchoolSettings;
  setSchoolSettings: React.Dispatch<React.SetStateAction<SchoolSettings>>;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  syncData: () => Promise<void>;
  isLoading: boolean;
  isInitializing: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  const { syncData, showToast } = state;

  useEffect(() => {
    syncData();

    // Listen to online events to trigger sync
    const handleOnline = () => {
      flushOfflineQueue(showToast).then(() => {
        syncData();
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
      }
    };
  }, [syncData, showToast]);

  return (
    <AppContext.Provider value={state}>
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
