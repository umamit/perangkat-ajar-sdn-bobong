import { Student, CounselingLog } from '@/types';

// Central helper for all sync mutations to guarantee PWA authentication persistence
export async function postSyncMutation(action: string, payload: any, nip?: string): Promise<boolean> {
  try {
    const teacherNip = nip || payload?.teacher_nip || payload?.teacherNip || payload?.nip || '';
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-teacher-nip': teacherNip,
      },
      body: JSON.stringify({ action, payload }),
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn(`[Sync Error in ${action}]`, e);
    return false;
  }
}

export async function deleteStudentFromSupabase(id: string) {
  return postSyncMutation('deleteStudent', { id });
}

export async function deleteTeacherFromSupabase(nip: string) {
  return postSyncMutation('deleteTeacher', { nip }, nip);
}

export async function deleteJournalFromSupabase(id: string) {
  return postSyncMutation('deleteJournal', { id });
}

export async function deleteFlashcardFromSupabase(id: string) {
  return postSyncMutation('deleteFlashcard', { id });
}

export async function deleteAssignmentFromSupabase(id: string) {
  return postSyncMutation('deleteAssignment', { id });
}

export async function deleteGradeFromSupabase(studentId: string, type?: string) {
  return postSyncMutation('deleteGrade', { studentId, type });
}

export async function deleteAttendanceFromSupabase(studentId: string, date: string) {
  return postSyncMutation('deleteAttendance', { studentId, date });
}

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
  return postSyncMutation('saveCounselingLog', payload);
}

export async function deleteCounselingLogFromSupabase(id: string) {
  return postSyncMutation('deleteCounselingLog', { id });
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
  return postSyncMutation('saveStudent', payload);
}

export async function saveTeacherToSupabase(teacher: any) {
  return postSyncMutation('saveTeacher', teacher, teacher.nip);
}

export async function saveJournalToSupabase(journal: any) {
  const payload = {
    id: journal.id,
    date: journal.date,
    time_slot: journal.time || journal.time_slot || '',
    class_id: journal.classId || journal.class_id,
    topic: journal.topic,
    notes: journal.notes || '',
    attendance_summary: journal.attendance || journal.attendance_summary || '',
    teacher_nip: journal.teacherNip || journal.teacher_nip,
  };
  return postSyncMutation('saveJournal', payload, payload.teacher_nip);
}

export async function saveFlashcardToSupabase(flashcard: any) {
  const payload = {
    id: flashcard.id,
    title: flashcard.title || flashcard.category || 'General',
    word: flashcard.word,
    meaning: flashcard.meaning || flashcard.translate,
    phase: flashcard.phase,
    teacher_nip: flashcard.teacherNip || flashcard.teacher_nip || null,
  };
  return postSyncMutation('saveFlashcard', payload, payload.teacher_nip || undefined);
}

export async function saveAssignmentToSupabase(assignment: any) {
  const payload = {
    id: assignment.id,
    title: assignment.title,
    class_id: assignment.classId || assignment.class_id,
    due_date: assignment.dueDate || assignment.due_date,
    status: assignment.status,
    teacher_nip: assignment.teacherNip || assignment.teacher_nip,
  };
  return postSyncMutation('saveAssignment', payload, payload.teacher_nip);
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
  return postSyncMutation('saveModule', payload, payload.teacher_nip);
}

export async function deleteModuleFromSupabase(id: string) {
  return postSyncMutation('deleteModule', { id });
}

export async function saveClassToSupabase(classData: any) {
  return postSyncMutation('saveClass', classData);
}

export async function deleteClassFromSupabase(id: string) {
  return postSyncMutation('deleteClass', { id });
}

export async function saveGradeToSupabase(studentIdOrGrade: any, type?: string, score?: number, classId?: string) {
  const payload = typeof studentIdOrGrade === 'object' ? studentIdOrGrade : {
    student_id: studentIdOrGrade,
    type: type,
    score: score,
    class_id: classId,
  };
  return postSyncMutation('saveGrade', payload);
}

export async function saveAttendanceToSupabase(records: any[]) {
  return postSyncMutation('saveAttendance', records);
}

export async function saveSchoolSettingsToSupabase(settings: any) {
  return postSyncMutation('saveSchoolSettings', settings);
}
