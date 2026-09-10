import {
  saveStudentToSupabase,
  deleteStudentFromSupabase,
  saveJournalToSupabase,
  deleteJournalFromSupabase,
  saveAssignmentToSupabase,
  deleteAssignmentFromSupabase,
  saveModuleToSupabase,
  saveGradeToSupabase,
  saveAttendanceToSupabase,
  saveCounselingLogToSupabase,
  deleteCounselingLogFromSupabase,
  saveSchoolSettingsToSupabase
} from "./supabase";
import { PendingMutation } from "./offlineTypes";

export async function executePendingMutation(item: PendingMutation): Promise<boolean> {
  switch (item.action) {
    case "saveStudent":
      return await saveStudentToSupabase(item.payload as any);
    case "deleteStudent":
      return await deleteStudentFromSupabase(item.payload as string);
    case "saveJournal":
      return await saveJournalToSupabase(item.payload as any);
    case "deleteJournal":
      return await deleteJournalFromSupabase(item.payload as string);
    case "saveAssignment":
      return await saveAssignmentToSupabase(item.payload as any);
    case "deleteAssignment":
      return await deleteAssignmentFromSupabase(item.payload as string);
    case "saveModule":
      return await saveModuleToSupabase(item.payload as any);
    case "saveGrade":
      return await saveGradeToSupabase(item.payload as any);
    case "saveAttendance":
      return await saveAttendanceToSupabase(item.payload as any);
    case "saveCounselingLog":
      return await saveCounselingLogToSupabase(item.payload as any);
    case "deleteCounselingLog":
      return await deleteCounselingLogFromSupabase(item.payload as string);
    case "saveSchoolSettings":
      return await saveSchoolSettingsToSupabase(item.payload as any);
    default:
      return true;
  }
}
