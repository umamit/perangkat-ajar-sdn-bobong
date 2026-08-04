import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://evslcvjucmnyxkqwfdye.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2xjdmp1Y21ueXhrcXdmZHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjQ4NzYsImV4cCI6MjEwMTI0MDg3Nn0.7b4J7bK8B7G6F5E4D3C2B1A0';

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
