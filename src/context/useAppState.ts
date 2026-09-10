import { useState, useCallback } from "react";
import { Student, Teacher, JournalEntry, ClassInfo, AttendanceRecord, ModuleAjar, FlashcardItem, TaskItem, GradeRecord, CounselingLog, Schedule, SchoolSettings } from "@/types";
import { mapTeachers, mapStudents, mapClasses, mapJournals, mapAssignments, mapCounselingLogs, mapModules, defaultAdminTeacher } from "./syncMappers";
import { useAuthSession, defaultTeacher } from "./useAuthSession";
import { useUiState, ToastMessage } from "./useUiState";

export { defaultTeacher };
export type { ToastMessage };

export const defaultSchoolSettings: SchoolSettings = {
  id: "global",
  school_name: "SD Negeri Bobong",
  npsn: "60101234",
  academic_year: "2026/2027",
  semester: "Ganjil",
  headmaster_name: "Husnita Usman, M.Pd",
  headmaster_nip: "199610272019032006"
};

const initialFlashcards: FlashcardItem[] = [
  { id: 1, word: "Hello / Good Morning", translate: "Halo / Selamat Pagi", example: "", category: "Greetings", phase: "Fase A" },
  { id: 2, word: "Pencil & Book", translate: "Pensil & Buku", example: "", category: "Classroom Objects", phase: "Fase A" },
  { id: 3, word: "One, Two, Three...", translate: "Satu, Dua, Tiga...", example: "", category: "Numbers", phase: "Fase B" }
];

const initialAssignments: TaskItem[] = [
  { id: "1", title: "Tugas 1: Vocabulary Greetings", classId: "1A", dueDate: "2026-08-10", type: "Tugas", status: "Aktif", description: "" }
];

export function useAppState() {
  const auth = useAuthSession();
  const ui = useUiState();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [modules, setModules] = useState<ModuleAjar[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(initialFlashcards);
  const [assignments, setAssignments] = useState<TaskItem[]>(initialAssignments);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [counselingLogs, setCounselingLogs] = useState<CounselingLog[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(defaultSchoolSettings);

  const logout = useCallback(() => {
    document.cookie = "sdn_bobong_auth=; path=/; max-age=0";
    document.cookie = "sdn_bobong_nip=; path=/; max-age=0";
    try {
      localStorage.removeItem("sdn_bobong_auth");
      localStorage.removeItem("sdn_bobong_teacher");
      localStorage.removeItem("sdn_bobong_cache");
      localStorage.removeItem("sdn_bobong_active_view");
    } catch (e) {}

    setTeachers([]);
    setStudents([]);
    setClasses([]);
    setJournals([]);
    setAttendance([]);
    setModules([]);
    ui.setActiveView("dashboard");
    setFlashcards(initialFlashcards);
    setAssignments(initialAssignments);
    setGrades([]);
    setCounselingLogs([]);
    setSchedules([]);
    setSchoolSettings(defaultSchoolSettings);

    auth.setIsLoggedIn(false);
    ui.showToast("Anda telah keluar dari aplikasi", "info");
  }, [ui, auth]);

  const { setIsLoading } = ui;
  const currentNip = auth.currentTeacher?.nip || "";
  const syncData = useCallback(async () => {
    setIsLoading(true);
    try {
      const nip = auth.currentTeacher?.nip || "";
      const res = await fetch(`/api/sync${nip ? `?nip=${encodeURIComponent(nip)}` : ""}`, { cache: "no-store" });
      const data = await res.json();
      if (data && data.success) {
        if (data.teachers?.length > 0) setTeachers(mapTeachers(data.teachers));
        if (data.students) setStudents(mapStudents(data.students));
        if (data.classes) setClasses(mapClasses(data.classes));
        if (data.journals) setJournals(mapJournals(data.journals));
        if (data.attendance) setAttendance(data.attendance);
        if (data.modules) setModules(mapModules(data.modules));
        if (data.flashcards) setFlashcards(data.flashcards);
        if (data.assignments) setAssignments(mapAssignments(data.assignments));
        if (data.grades) setGrades(data.grades);
        if (data.counselingLogs) setCounselingLogs(mapCounselingLogs(data.counselingLogs));
        if (data.schedules) setSchedules(data.schedules);
        if (data.schoolSettings) setSchoolSettings(data.schoolSettings);
      }
    } catch (err) {
      console.warn("[Supabase Sync Error]", err);
    } finally {
      setIsLoading(false);
    }
  }, [auth.currentTeacher?.nip, setIsLoading]);

  return {
    ...auth,
    ...ui,
    teachers, setTeachers,
    students, setStudents,
    classes, setClasses,
    journals, setJournals,
    attendance, setAttendance,
    modules, setModules,
    flashcards, setFlashcards,
    assignments, setAssignments,
    grades, setGrades,
    counselingLogs, setCounselingLogs,
    schedules, setSchedules,
    schoolSettings, setSchoolSettings,
    logout,
    syncData
  };
}
