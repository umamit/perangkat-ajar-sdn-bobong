import { Student, Teacher, JournalEntry, ClassInfo, AttendanceRecord, ModuleAjar, FlashcardItem, TaskItem, GradeRecord, CounselingLog, Schedule, SchoolSettings } from "@/types";

export interface AppCacheData {
  teachers: Teacher[];
  students: Student[];
  classes: ClassInfo[];
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  modules: ModuleAjar[];
  flashcards: FlashcardItem[];
  assignments: TaskItem[];
  grades: GradeRecord[];
  counselingLogs?: CounselingLog[];
  schedules?: Schedule[];
  schoolSettings?: SchoolSettings;
}

export interface PendingMutation {
  id: string;
  action: string;
  payload: unknown;
  timestamp: number;
}
