import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabase();

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
      supabase.from('journals').select('*'),
      supabase.from('attendance').select('*'),
      supabase.from('modules').select('*'),
      supabase.from('grades').select('*'),
      supabase.from('flashcards').select('*'),
      supabase.from('assignments').select('*')
    ]);

    const getValue = (res: PromiseSettledResult<any>) =>
      res.status === 'fulfilled' && res.value && !res.value.error ? res.value.data : [];

    return NextResponse.json({
      success: true,
      teachers: getValue(teachersRes),
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
