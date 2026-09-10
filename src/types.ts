import { Teacher, ClassInfo, TimetableSlot, Schedule, JournalEntry, SchoolSettings } from "./types/academic";
import { Student, AttendanceRecord, GradeRecord, ModuleAjar, FlashcardItem, QuizQuestion, TaskItem, CounselingLog } from "./types/learning";

export * from "./types/academic";
export * from "./types/learning";

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
