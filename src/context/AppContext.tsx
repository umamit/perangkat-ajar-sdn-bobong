'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { Student, Teacher, JournalEntry } from '@/types';
import { useAppState, ToastMessage } from './useAppState';
import { flushOfflineQueue } from '@/lib/offlineSync';

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
