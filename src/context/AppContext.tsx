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
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  syncData: () => Promise<void>;
  isLoading: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
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
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeRoleMode, setActiveRoleMode] = useState<string>('guru_inggris');
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(defaultTeacher);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
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
        if (data.classes) {
          setClasses(data.classes.map((c: any) => ({
            id: c.id,
            name: c.name,
            phase: c.phase || 'Fase A',
            room: c.room || 'Ruang Kelas'
          })));
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
      }
    } catch (err) {
      console.warn('[Supabase Sync Error]', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('sdn_bobong_auth='));
    if (cookie && cookie.split('=')[1] === 'true') {
      setIsLoggedIn(true);
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
        toasts,
        showToast,
        syncData,
        isLoading,
        sidebarOpen,
        setSidebarOpen
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
