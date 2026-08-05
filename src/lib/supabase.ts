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

export async function syncFromSupabase() {
  try {
    const supabase = getSupabase();
    const [tRes, cRes, sRes, aRes, jRes, mRes, fRes, assRes] = await Promise.allSettled([
      supabase.from('teachers').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('students').select('*'),
      supabase.from('attendance').select('*'),
      supabase.from('journals').select('*'),
      supabase.from('modules').select('*'),
      supabase.from('flashcards').select('*'),
      supabase.from('assignments').select('*')
    ]);

    const getValue = (res: PromiseSettledResult<any>) =>
      res.status === 'fulfilled' && res.value && !res.value.error ? res.value.data : [];

    return {
      teachers: getValue(tRes),
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
    const { error } = await supabase.from('journals').upsert(journal);
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
    const { error } = await supabase.from('assignments').upsert(assignment);
    return !error;
  } catch (e) {
    console.warn('[Save Assignment Error]', e);
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
