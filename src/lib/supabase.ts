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

export async function syncFromSupabase(nip?: string) {
  try {
    const supabase = getSupabase();
    let journalQuery = supabase.from('journals').select('*');
    let moduleQuery = supabase.from('modules').select('*');
    let assignmentQuery = supabase.from('assignments').select('*');

    if (nip) {
      journalQuery = journalQuery.eq('teacher_nip', nip);
      moduleQuery = moduleQuery.eq('teacher_nip', nip);
      assignmentQuery = assignmentQuery.eq('teacher_nip', nip);
    } else {
      // Force empty sets if no NIP is passed to preserve privacy
      journalQuery = journalQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      moduleQuery = moduleQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      assignmentQuery = assignmentQuery.eq('id', '00000000-0000-0000-0000-000000000000');
    }

    const [tRes, cRes, sRes, aRes, jRes, mRes, fRes, assRes] = await Promise.allSettled([
      supabase.from('teachers').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('students').select('*'),
      supabase.from('attendance').select('*'),
      journalQuery,
      moduleQuery,
      supabase.from('flashcards').select('*'),
      assignmentQuery
    ]);

    const getValue = (res: PromiseSettledResult<any>) =>
      res.status === 'fulfilled' && res.value && !res.value.error ? res.value.data : [];

    // Omit teacher passwords on the returned object just in case
    const teachersList = getValue(tRes).map((t: any) => {
      if (t) {
        const { password, ...rest } = t;
        return rest;
      }
      return t;
    });

    return {
      teachers: teachersList,
      classes: getValue(cRes),
      students: getValue(sRes),
      attendance: getValue(aRes),
      journals: getValue(jRes),
      modules: getValue(mRes),
      flashcards: getValue(fRes),
      assignments: getValue(assRes)
    };
  } catch (e) {
    console.warn('[Supabase Sync Error]', e);
    return { teachers: [], classes: [], students: [], attendance: [], journals: [], modules: [], flashcards: [], assignments: [] };
  }
}

export async function deleteStudentFromSupabase(id: string) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('students').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('[Delete Student Error]', e);
    return false;
  }
}

export async function deleteTeacherFromSupabase(nip: string) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('teachers').delete().eq('nip', nip);
    return !error;
  } catch (e) {
    console.warn('[Delete Teacher Error]', e);
    return false;
  }
}

export async function deleteJournalFromSupabase(id: string) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('journals').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('[Delete Journal Error]', e);
    return false;
  }
}

export async function deleteFlashcardFromSupabase(id: string) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('flashcards').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('[Delete Flashcard Error]', e);
    return false;
  }
}

export async function deleteAssignmentFromSupabase(id: string) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('[Delete Assignment Error]', e);
    return false;
  }
}

export async function deleteGradeFromSupabase(studentId: string, type?: string) {
  try {
    const supabase = getSupabase();
    let query = supabase.from('grades').delete().eq('student_id', studentId);
    if (type) query = query.eq('type', type);
    const { error } = await query;
    return !error;
  } catch (e) {
    console.warn('[Delete Grade Error]', e);
    return false;
  }
}

export async function deleteAttendanceFromSupabase(studentId: string, date: string) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('attendance').delete().eq('student_id', studentId).eq('date', date);
    return !error;
  } catch (e) {
    console.warn('[Delete Attendance Error]', e);
    return false;
  }
}

export async function saveStudentToSupabase(student: any) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('students').upsert(student);
    return !error;
  } catch (e) {
    console.warn('[Save Student Error]', e);
    return false;
  }
}

export async function saveTeacherToSupabase(teacher: any) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('teachers').upsert(teacher);
    return !error;
  } catch (e) {
    console.warn('[Save Teacher Error]', e);
    return false;
  }
}

export async function saveJournalToSupabase(journal: any) {
  try {
    const supabase = getSupabase();
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
    const { error } = await supabase.from('journals').upsert(payload);
    return !error;
  } catch (e) {
    console.warn('[Save Journal Error]', e);
    return false;
  }
}

export async function saveFlashcardToSupabase(flashcard: any) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('flashcards').upsert(flashcard);
    return !error;
  } catch (e) {
    console.warn('[Save Flashcard Error]', e);
    return false;
  }
}

export async function saveAssignmentToSupabase(assignment: any) {
  try {
    const supabase = getSupabase();
    const payload = {
      id: assignment.id,
      title: assignment.title,
      class_id: assignment.classId || assignment.class_id,
      due_date: assignment.dueDate || assignment.due_date,
      status: assignment.status,
      teacher_nip: assignment.teacherNip || assignment.teacher_nip
    };
    const { error } = await supabase.from('assignments').upsert(payload);
    return !error;
  } catch (e) {
    console.warn('[Save Assignment Error]', e);
    return false;
  }
}

export async function saveModuleToSupabase(moduleData: any) {
  try {
    const supabase = getSupabase();
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
    const { error } = await supabase.from('modules').upsert(payload);
    return !error;
  } catch (e) {
    console.warn('[Save Module Error]', e);
    return false;
  }
}

export async function deleteModuleFromSupabase(id: string) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('modules').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('[Delete Module Error]', e);
    return false;
  }
}

export async function saveClassToSupabase(classData: any) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('classes').upsert(classData);
    return !error;
  } catch (e) {
    console.warn('[Save Class Error]', e);
    return false;
  }
}

export async function deleteClassFromSupabase(id: string) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('classes').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.warn('[Delete Class Error]', e);
    return false;
  }
}

export async function saveGradeToSupabase(studentIdOrGrade: any, type?: string, score?: number, classId?: string) {
  try {
    const supabase = getSupabase();
    const payload = typeof studentIdOrGrade === 'object' ? studentIdOrGrade : {
      student_id: studentIdOrGrade,
      type: type,
      score: score,
      class_id: classId
    };
    const { error } = await supabase.from('grades').upsert(payload);
    return !error;
  } catch (e) {
    console.warn('[Save Grade Error]', e);
    return false;
  }
}

export async function saveAttendanceToSupabase(records: any[]) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('attendance').upsert(records, { onConflict: 'student_id,date' });
    return !error;
  } catch (e) {
    console.warn('[Save Attendance Error]', e);
    return false;
  }
}

export async function uploadAvatarToSupabaseStorage(file: File, nip?: string) {
  try {
    return '/assets/logo-sdn-bobong.png';
  } catch (e) {
    return '/assets/logo-sdn-bobong.png';
  }
}
