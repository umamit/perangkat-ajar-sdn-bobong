import { Student, CounselingLog } from "@/types";
import { postSyncMutation } from "./postSyncMutation";

export * from "./postSyncMutation";
export * from "./deleteMutations";

export async function saveCounselingLogToSupabase(log: CounselingLog) {
  const payload = {
    id: log.id,
    student_id: log.studentId,
    date: log.date,
    category: log.category,
    notes: log.notes,
    follow_up: log.followUp || null,
    teacher_nip: log.teacherNip || null,
  };
  return postSyncMutation("saveCounselingLog", payload);
}

export async function saveStudentToSupabase(student: Student) {
  const payload = {
    id: student.id,
    nis: student.nis,
    name: student.name,
    class_id: student.classId,
    gender: student.gender,
    nisn: student.nisn || null,
    nik: student.nik || null,
    tempat_tanggal_lahir: student.birthInfo || null,
    nama_orang_tua: student.parentName || null,
    agama: student.religion || null,
    pekerjaan_orang_tua: student.parentJob || null,
    alamat: student.address || null,
    tahun_masuk: student.admissionYear || null,
  };
  return postSyncMutation("saveStudent", payload);
}

export async function saveTeacherToSupabase(teacher: any) {
  return postSyncMutation("saveTeacher", teacher, teacher.nip);
}

export async function saveJournalToSupabase(journal: any) {
  const payload = {
    id: journal.id,
    date: journal.date,
    time_slot: journal.time || journal.time_slot || "",
    class_id: journal.classId || journal.class_id,
    topic: journal.topic,
    notes: journal.notes || "",
    attendance_summary: journal.attendance || journal.attendance_summary || "",
    teacher_nip: journal.teacherNip || journal.teacher_nip,
  };
  return postSyncMutation("saveJournal", payload, payload.teacher_nip);
}

export async function saveFlashcardToSupabase(flashcard: any) {
  const payload = {
    id: flashcard.id,
    title: flashcard.title || flashcard.category || "General",
    word: flashcard.word,
    meaning: flashcard.meaning || flashcard.translate,
    phase: flashcard.phase,
    teacher_nip: flashcard.teacherNip || flashcard.teacher_nip || null,
  };
  return postSyncMutation("saveFlashcard", payload, payload.teacher_nip || undefined);
}

export async function saveAssignmentToSupabase(assignment: any) {
  const payload = {
    id: assignment.id,
    title: (assignment.title || "").trim(),
    class_id: assignment.classId || assignment.class_id,
    due_date: assignment.dueDate || assignment.due_date,
    status: assignment.status || "Aktif",
    teacher_nip: assignment.teacherNip || assignment.teacher_nip,
    file_url: assignment.fileUrl || assignment.file_url || null,
    file_name: assignment.fileName || assignment.file_name || null,
    description: (assignment.description || "").trim() || null,
    type: assignment.type || "Formatif",
  };
  return postSyncMutation("saveAssignment", payload, payload.teacher_nip);
}

export async function saveModuleToSupabase(moduleData: any) {
  const payload = {
    id: moduleData.id,
    title: moduleData.title,
    phase: moduleData.phase,
    class_id: moduleData.classId || moduleData.class_id,
    tp: moduleData.tp,
    atp: moduleData.atp,
    duration: moduleData.duration,
    file_url: moduleData.fileUrl || moduleData.file_url,
    teacher_nip: moduleData.teacherNip || moduleData.teacher_nip,
  };
  return postSyncMutation("saveModule", payload, payload.teacher_nip);
}

export async function saveClassToSupabase(classData: any) {
  return postSyncMutation("saveClass", classData);
}

export async function saveGradeToSupabase(studentIdOrGrade: any, type?: string, score?: number, classId?: string) {
  const payload = typeof studentIdOrGrade === "object" ? studentIdOrGrade : {
    student_id: studentIdOrGrade,
    type: type,
    score: score,
    class_id: classId,
  };
  return postSyncMutation("saveGrade", payload);
}

export async function saveAttendanceToSupabase(records: any[]) {
  return postSyncMutation("saveAttendance", records);
}

export async function saveSchoolSettingsToSupabase(settings: any) {
  return postSyncMutation("saveSchoolSettings", settings);
}
