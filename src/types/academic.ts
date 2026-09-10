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
  class_id?: string;
  time_start?: string;
  time_end?: string;
  teacher_nip?: string;
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

export type Journal = JournalEntry;

export interface SchoolSettings {
  id: string;
  school_name: string;
  npsn: string;
  academic_year: string;
  semester: string;
  headmaster_name: string;
  headmaster_nip: string;
}
