import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nip = searchParams.get('nip') || '';

    const supabase = getSupabase();

    // Prepare queries
    let journalQuery = supabase.from('journals').select('*');
    let moduleQuery = supabase.from('modules').select('*');
    let assignmentQuery = supabase.from('assignments').select('*');
    let flashcardQuery = supabase.from('flashcards').select('*');
    let gradeQuery = supabase.from('grades').select('*');

    const isKepsekNip = nip === '199610272019032006';

    if (nip && !isKepsekNip) {
      journalQuery = journalQuery.eq('teacher_nip', nip);
      moduleQuery = moduleQuery.eq('teacher_nip', nip);
      assignmentQuery = assignmentQuery.eq('teacher_nip', nip);
      flashcardQuery = flashcardQuery.eq('teacher_nip', nip);
      gradeQuery = gradeQuery.eq('teacher_nip', nip);
    } else if (!nip) {
      // If no NIP is active/logged in, return empty sets for security
      journalQuery = journalQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      moduleQuery = moduleQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      assignmentQuery = assignmentQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      flashcardQuery = flashcardQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      gradeQuery = gradeQuery.eq('id', '00000000-0000-0000-0000-000000000000');
    }

    const [
      teachersRes,
      classesRes,
      studentsRes,
      journalsRes,
      attendanceRes,
      modulesRes,
      gradesRes,
      flashcardsRes,
      assignmentsRes
    ] = await Promise.allSettled([
      supabase.from('teachers').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('students').select('*'),
      journalQuery,
      supabase.from('attendance').select('*'),
      moduleQuery,
      gradeQuery,
      flashcardQuery,
      assignmentQuery
    ]);

    const getValue = (res: PromiseSettledResult<any>) =>
      res.status === 'fulfilled' && res.value && !res.value.error ? res.value.data : [];

    // Map teachers to omit the password field for client security
    const teachersList = getValue(teachersRes).map((t: any) => {
      if (t) {
        const { password, ...rest } = t;
        return rest;
      }
      return t;
    });

    return NextResponse.json({
      success: true,
      teachers: teachersList,
      classes: getValue(classesRes),
      students: getValue(studentsRes),
      journals: getValue(journalsRes),
      attendance: getValue(attendanceRes),
      modules: getValue(modulesRes),
      grades: getValue(gradesRes),
      flashcards: getValue(flashcardsRes),
      assignments: getValue(assignmentsRes)
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      teachers: [],
      classes: [],
      students: [],
      journals: [],
      attendance: [],
      modules: [],
      grades: [],
      flashcards: [],
      assignments: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const supabase = getSupabase();

    if (action === 'saveTeacher') {
      const { error } = await supabase.from('teachers').upsert(payload);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'deleteTeacher') {
      const { nip } = payload;
      const { error } = await supabase.from('teachers').delete().eq('nip', nip);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'saveStudent') {
      const { error } = await supabase.from('students').upsert(payload);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'deleteStudent') {
      const { id } = payload;
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (err: any) {
    console.error('[API Mutation Error]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

