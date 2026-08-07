// TypeScript Type Definitions for Perangkat Ajar SD Negeri Bobong

export interface Teacher {
  id?: string;
  nip: string;
  name: string;
  role: string;
  subject: string;
  password?: string;
  avatar: string;
  school?: string;
  kecamatan?: string;
  semester?: string;
  isActive?: boolean;
}

export interface ClassInfo {
  id: string;
  name: string;
  count?: number;
  room: string;
  phase: string;
}

export interface Student {
  id: string;
  uuid?: string;
  nis?: string;
  name: string;
  classId: string;
  gender: string;
  scoreFormatif?: number;
  scoreSumatif?: number;
  scoreSts?: number;
  scoreSas?: number;
}

export interface TimetableSlot {
  day: string;
  time: string;
  classId: string;
  topic: string;
}

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  notes?: string;
}

export interface GradeRecord {
  id?: string;
  studentId: string;
  classId: string;
  subject: string;
  type: 'Formatif' | 'Sumatif';
  score: number;
  topic?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  time: string;
  classId: string;
  topic: string;
  notes: string;
  attendance: string;
  teacherNip?: string;
}

export interface ModuleAjar {
  id: string;
  grade: string;
  phase: string;
  title: string;
  tp: string;
  atp: string;
  cp: string;
  target: string;
  duration: string;
  materials: string[];
  steps: string[];
  assessment: string;
  teacherNip?: string;
}

export interface FlashcardItem {
  id: number;
  word: string;
  translate: string;
  example: string;
  category: string;
  icon?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface TaskItem {
  id: string;
  title: string;
  classId: string;
  dueDate: string;
  type: string;
  status: string;
  description: string;
  teacherNip?: string;
}

export interface AppData {
  teacher: Teacher;
  teachers: Teacher[];
  classes: ClassInfo[];
  students: Student[];
  timetable: TimetableSlot[];
  journals: JournalEntry[];
  modules: ModuleAjar[];
  flashcards: FlashcardItem[];
  quizQuestions: QuizQuestion[];
  tasks?: TaskItem[];
  attendance?: any[];
  schedules?: any[];
}

declare global {
  interface Window {
    supabase: any;
    appData: AppData;
    getSupabase: () => any;
    syncFromSupabase: () => Promise<void>;
    saveStudentToSupabase: (s: Student) => Promise<void>;
    deleteStudentFromSupabase: (nis: string) => Promise<void>;
    saveJournalToSupabase: (j: JournalEntry) => Promise<void>;
    saveTeacherToSupabase: (t: Teacher) => Promise<void>;
    deleteTeacherFromSupabase: (nip: string) => Promise<void>;
  }
}
