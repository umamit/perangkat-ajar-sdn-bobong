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

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  classId: string;
  date: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpa";
  notes?: string;
  student_id?: string;
  class_id?: string;
}

export interface GradeRecord {
  id?: string;
  studentId: string;
  classId: string;
  subject: string;
  type: "Formatif" | "Sumatif" | "STS" | "SAS";
  score: number;
  topic?: string;
  student_id?: string;
  class_id?: string;
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
  classId?: string;
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
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface CounselingLog {
  id?: string;
  studentId: string;
  date: string;
  category: "Bimbingan" | "Konseling" | "Kunjungan Rumah" | "Telepon Orang Tua";
  notes: string;
  followUp?: string;
  teacherNip?: string;
  created_at?: string;
}
