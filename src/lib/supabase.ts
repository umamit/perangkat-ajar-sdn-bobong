import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
  }
  return supabaseClient;
}

export { syncFromSupabase } from './supabaseSync';


export async function deleteStudentFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteStudent', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Student Error]', e);
    return false;
  }
}

export async function deleteTeacherFromSupabase(nip: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteTeacher', payload: { nip } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Teacher Error]', e);
    return false;
  }
}

export async function deleteJournalFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteJournal', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Journal Error]', e);
    return false;
  }
}

export async function deleteFlashcardFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteFlashcard', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Flashcard Error]', e);
    return false;
  }
}

export async function deleteAssignmentFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteAssignment', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Assignment Error]', e);
    return false;
  }
}

export async function deleteGradeFromSupabase(studentId: string, type?: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteGrade', payload: { studentId, type } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Grade Error]', e);
    return false;
  }
}

export async function deleteAttendanceFromSupabase(studentId: string, date: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteAttendance', payload: { studentId, date } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Attendance Error]', e);
    return false;
  }
}

import { Student, CounselingLog } from '@/types';

export async function saveCounselingLogToSupabase(log: CounselingLog) {
  try {
    const payload = {
      id: log.id,
      student_id: log.studentId,
      date: log.date,
      category: log.category,
      notes: log.notes,
      follow_up: log.followUp || null,
      teacher_nip: log.teacherNip || null
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveCounselingLog', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Counseling Log Error]', e);
    return false;
  }
}

export async function deleteCounselingLogFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteCounselingLog', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Counseling Log Error]', e);
    return false;
  }
}

export async function saveStudentToSupabase(student: Student) {
  try {
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
      tahun_masuk: student.admissionYear || null
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveStudent', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Student Error]', e);
    return false;
  }
}

export async function saveTeacherToSupabase(teacher: any) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveTeacher', payload: teacher })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Teacher Error]', e);
    return false;
  }
}

export async function saveJournalToSupabase(journal: any) {
  try {
    const payload = {
      id: journal.id,
      date: journal.date,
      time_slot: journal.time || journal.time_slot || '',
      class_id: journal.classId || journal.class_id,
      topic: journal.topic,
      notes: journal.notes || '',
      attendance_summary: journal.attendance || journal.attendance_summary || '',
      teacher_nip: journal.teacherNip || journal.teacher_nip
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveJournal', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Journal Error]', e);
    return false;
  }
}

export async function saveFlashcardToSupabase(flashcard: any) {
  try {
    const payload = {
      id: flashcard.id,
      title: flashcard.title || flashcard.category || 'General',
      word: flashcard.word,
      meaning: flashcard.meaning || flashcard.translate,
      phase: flashcard.phase,
      teacher_nip: flashcard.teacherNip || flashcard.teacher_nip || null
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveFlashcard', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Flashcard Error]', e);
    return false;
  }
}

export async function saveAssignmentToSupabase(assignment: any) {
  try {
    const payload = {
      id: assignment.id,
      title: assignment.title,
      class_id: assignment.classId || assignment.class_id,
      due_date: assignment.dueDate || assignment.due_date,
      status: assignment.status,
      teacher_nip: assignment.teacherNip || assignment.teacher_nip
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveAssignment', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Assignment Error]', e);
    return false;
  }
}

export async function saveModuleToSupabase(moduleData: any) {
  try {
    const payload = {
      id: moduleData.id,
      title: moduleData.title,
      phase: moduleData.phase,
      class_id: moduleData.classId || moduleData.class_id,
      tp: moduleData.tp,
      atp: moduleData.atp,
      duration: moduleData.duration,
      file_url: moduleData.fileUrl || moduleData.file_url,
      teacher_nip: moduleData.teacherNip || moduleData.teacher_nip
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveModule', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Module Error]', e);
    return false;
  }
}

export async function deleteModuleFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteModule', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Module Error]', e);
    return false;
  }
}

export async function saveClassToSupabase(classData: any) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveClass', payload: classData })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Class Error]', e);
    return false;
  }
}

export async function deleteClassFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteClass', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Class Error]', e);
    return false;
  }
}

export async function saveGradeToSupabase(studentIdOrGrade: any, type?: string, score?: number, classId?: string) {
  try {
    const payload = typeof studentIdOrGrade === 'object' ? studentIdOrGrade : {
      student_id: studentIdOrGrade,
      type: type,
      score: score,
      class_id: classId
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveGrade', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Grade Error]', e);
    return false;
  }
}

export async function saveAttendanceToSupabase(records: any[]) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveAttendance', payload: records })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Attendance Error]', e);
    return false;
  }
}

export async function uploadFileToSupabase(bucketName: string, path: string, file: File): Promise<string | null> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.storage.from(bucketName).upload(path, file, {
      upsert: true
    });
    if (error) {
      console.warn(`[Storage Upload Error in ${bucketName}]`, error);
      return null;
    }
    const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(path);
    return publicData?.publicUrl || null;
  } catch (e) {
    console.warn(`[Storage Exception in ${bucketName}]`, e);
    return null;
  }
}

export async function uploadAvatarToSupabaseStorage(file: File, nip?: string): Promise<string> {
  const fileName = `${nip || 'unknown'}_${Date.now()}.png`;
  const url = await uploadFileToSupabase('avatars', fileName, file);
  return url || '/assets/logo-sdn-bobong.png';
}
