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
  // Detail pelengkap
  nisn?: string;
  nik?: string;
  birthInfo?: string;
  parentName?: string;
  religion?: string;
  parentJob?: string;
  address?: string;
  admissionYear?: string;
  class_id?: string;
}

export interface TimetableSlot {
  day: string;
  time: string;
  classId: string;
  topic: string;
}

export interface Schedule {
  id?: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  classId: string;
  subject: string;
  teacherNip?: string;
  // Supabase snake_case aliases
  class_id?: string;
  time_start?: string;
  time_end?: string;
  teacher_nip?: string;
}

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  notes?: string;
  // Supabase snake_case aliases
  student_id?: string;
  class_id?: string;
}

export interface GradeRecord {
  id?: string;
  studentId: string;
  classId: string;
  subject: string;
  type: 'Formatif' | 'Sumatif' | 'STS' | 'SAS';
  score: number;
  topic?: string;
  // Supabase snake_case aliases
  student_id?: string;
  class_id?: string;
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
  fileUrl?: string;
  // Supabase snake_case aliases
  file_url?: string;
  teacher_nip?: string;
  class_id?: string;
}

export interface FlashcardItem {
  id: number | string;
  word: string;
  translate: string;
  example: string;
  category: string;
  icon?: string;
  // Optional legacy/Supabase fields
  meaning?: string;
  phase?: string;
  title?: string;
  teacher_nip?: string | null;
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

export interface CounselingLog {
  id?: string;
  studentId: string;
  date: string;
  category: 'Bimbingan' | 'Konseling' | 'Kunjungan Rumah' | 'Telepon Orang Tua';
  notes: string;
  followUp?: string;
  teacherNip?: string;
  created_at?: string;
}

export interface SchoolSettings {
  id: string;
  school_name: string;
  npsn: string;
  academic_year: string;
  semester: string;
  headmaster_name: string;
  headmaster_nip: string;
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
  attendance?: AttendanceRecord[];
  schedules?: Schedule[];
  counselingLogs?: CounselingLog[];
  schoolSettings?: SchoolSettings;
}

declare global {
  interface Window {
    appData: AppData;
  }
}
