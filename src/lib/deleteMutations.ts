import { postSyncMutation } from "./postSyncMutation";

export async function deleteStudentFromSupabase(id: string) {
  return postSyncMutation("deleteStudent", { id });
}

export async function deleteTeacherFromSupabase(nip: string) {
  return postSyncMutation("deleteTeacher", { nip }, nip);
}

export async function deleteJournalFromSupabase(id: string) {
  return postSyncMutation("deleteJournal", { id });
}

export async function deleteFlashcardFromSupabase(id: string) {
  return postSyncMutation("deleteFlashcard", { id });
}

export async function deleteAssignmentFromSupabase(id: string) {
  return postSyncMutation("deleteAssignment", { id });
}

export async function deleteGradeFromSupabase(studentId: string, type?: string) {
  return postSyncMutation("deleteGrade", { studentId, type });
}

export async function deleteAttendanceFromSupabase(studentId: string, date: string) {
  return postSyncMutation("deleteAttendance", { studentId, date });
}

export async function deleteCounselingLogFromSupabase(id: string) {
  return postSyncMutation("deleteCounselingLog", { id });
}

export async function deleteModuleFromSupabase(id: string) {
  return postSyncMutation("deleteModule", { id });
}

export async function deleteClassFromSupabase(id: string) {
  return postSyncMutation("deleteClass", { id });
}
