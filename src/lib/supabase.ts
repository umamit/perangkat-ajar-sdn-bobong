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
    const [tRes, cRes, sRes] = await Promise.all([
      supabase.from('teachers').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('students').select('*')
    ]);
    return {
      teachers: tRes.data || [],
      classes: cRes.data || [],
      students: sRes.data || []
    };
  } catch (e) {
    console.warn('[Supabase Sync Error]', e);
    return { teachers: [], classes: [], students: [] };
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

export async function uploadAvatarToSupabaseStorage(file: File, nip?: string) {
  try {
    return '/assets/logo-sdn-bobong.png';
  } catch (e) {
    return '/assets/logo-sdn-bobong.png';
  }
}
