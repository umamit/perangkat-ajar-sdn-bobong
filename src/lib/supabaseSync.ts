import { getSupabase } from './supabase';

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
