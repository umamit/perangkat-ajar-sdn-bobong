'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';
import { INITIAL_DATA } from '@/data';
import { Student, Teacher, JournalEntry, AppData } from '@/types';

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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeRoleMode, setActiveRoleMode] = useState<string>('guru_inggris');
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(INITIAL_DATA.teacher);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_DATA.teachers || []);
  const [students, setStudents] = useState<Student[]>(INITIAL_DATA.students || []);
  const [classes, setClasses] = useState<any[]>(INITIAL_DATA.classes || []);
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_DATA.journals || []);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>(INITIAL_DATA.modules || []);
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
        if (data.teachers) {
          const map = new Map<string, Teacher>();
          (INITIAL_DATA.teachers || []).forEach(t => map.set(t.nip, t));
          data.teachers.forEach((t: any) => {
            if (t && t.nip) {
              map.set(t.nip, {
                nip: t.nip,
                name: t.name,
                role: t.role || 'Guru Mata Pelajaran',
                subject: t.subject || 'Bahasa Inggris',
                password: t.password || 'sdnbobong',
                avatar: t.avatar_url || '/assets/logo-sdn-bobong.png'
              });
            }
          });
          setTeachers(Array.from(map.values()));
        }
        if (data.students && data.students.length > 0) {
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
          setClasses(data.classes.map((c: any) => ({
            id: c.id,
            name: c.name,
            phase: c.phase || 'Fase A',
            room: c.room || 'Ruang Kelas'
          })));
        }
        if (data.journals && data.journals.length > 0) {
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
        if (data.attendance && data.attendance.length > 0) {
          setAttendance(data.attendance);
        }
        if (data.modules && data.modules.length > 0) {
          setModules(data.modules);
        }
      }
    } catch (err) {
      console.warn('[Sync Error]', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check cookie / auth state
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
