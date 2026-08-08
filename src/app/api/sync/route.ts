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
    let counselingQuery = supabase.from('counseling_logs').select('*');
    let scheduleQuery = supabase.from('schedules').select('*');

    const isKepsekNip = nip === '199610272019032006';

    if (nip && !isKepsekNip) {
      journalQuery = journalQuery.eq('teacher_nip', nip);
      moduleQuery = moduleQuery.eq('teacher_nip', nip);
      assignmentQuery = assignmentQuery.eq('teacher_nip', nip);
      flashcardQuery = flashcardQuery.eq('teacher_nip', nip);
      gradeQuery = gradeQuery.eq('teacher_nip', nip);
      counselingQuery = counselingQuery.eq('teacher_nip', nip);
    } else if (!nip) {
      // If no NIP is active/logged in, return empty sets for security
      journalQuery = journalQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      moduleQuery = moduleQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      assignmentQuery = assignmentQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      flashcardQuery = flashcardQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      gradeQuery = gradeQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      counselingQuery = counselingQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      scheduleQuery = scheduleQuery.eq('id', '00000000-0000-0000-0000-000000000000');
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
      assignmentsRes,
      counselingRes,
      schedulesRes
    ] = await Promise.allSettled([
      supabase.from('teachers').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('students').select('*'),
      journalQuery,
      supabase.from('attendance').select('*'),
      moduleQuery,
      gradeQuery,
      flashcardQuery,
      assignmentQuery,
      counselingQuery,
      scheduleQuery
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
      assignments: getValue(assignmentsRes),
      counselingLogs: getValue(counselingRes),
      schedules: getValue(schedulesRes)
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
      assignments: [],
      counselingLogs: [],
      schedules: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const supabase = getSupabase();

    switch (action) {
      case 'saveTeacher':
        return NextResponse.json({ success: !(await supabase.from('teachers').upsert(payload)).error });
      case 'deleteTeacher':
        return NextResponse.json({ success: !(await supabase.from('teachers').delete().eq('nip', payload.nip)).error });
      case 'saveStudent':
        return NextResponse.json({ success: !(await supabase.from('students').upsert(payload)).error });
      case 'deleteStudent':
        return NextResponse.json({ success: !(await supabase.from('students').delete().eq('id', payload.id)).error });
      case 'saveCounselingLog':
        return NextResponse.json({ success: !(await supabase.from('counseling_logs').upsert(payload)).error });
      case 'deleteCounselingLog':
        return NextResponse.json({ success: !(await supabase.from('counseling_logs').delete().eq('id', payload.id)).error });
      case 'saveJournal':
        return NextResponse.json({ success: !(await supabase.from('journals').upsert(payload)).error });
      case 'deleteJournal':
        return NextResponse.json({ success: !(await supabase.from('journals').delete().eq('id', payload.id)).error });
      case 'saveFlashcard':
        return NextResponse.json({ success: !(await supabase.from('flashcards').upsert(payload)).error });
      case 'deleteFlashcard':
        return NextResponse.json({ success: !(await supabase.from('flashcards').delete().eq('id', payload.id)).error });
      case 'saveAssignment':
        return NextResponse.json({ success: !(await supabase.from('assignments').upsert(payload)).error });
      case 'deleteAssignment':
        return NextResponse.json({ success: !(await supabase.from('assignments').delete().eq('id', payload.id)).error });
      case 'saveModule':
        return NextResponse.json({ success: !(await supabase.from('modules').upsert(payload)).error });
      case 'deleteModule':
        return NextResponse.json({ success: !(await supabase.from('modules').delete().eq('id', payload.id)).error });
      case 'saveClass':
        return NextResponse.json({ success: !(await supabase.from('classes').upsert(payload)).error });
      case 'deleteClass':
        return NextResponse.json({ success: !(await supabase.from('classes').delete().eq('id', payload.id)).error });
      case 'saveGrade':
        return NextResponse.json({ success: !(await supabase.from('grades').upsert(payload)).error });
      case 'deleteGrade': {
        const { studentId, type } = payload;
        let query = supabase.from('grades').delete().eq('student_id', studentId);
        if (type) query = query.eq('type', type);
        return NextResponse.json({ success: !(await query).error });
      }
      case 'saveAttendance':
        return NextResponse.json({ success: !(await supabase.from('attendance').upsert(payload, { onConflict: 'student_id,date' })).error });
      case 'deleteAttendance':
        return NextResponse.json({ success: !(await supabase.from('attendance').delete().eq('student_id', payload.studentId).eq('date', payload.date)).error });
      case 'saveSchedule':
        return NextResponse.json({ success: !(await supabase.from('schedules').upsert(payload)).error });
      case 'deleteSchedule':
        return NextResponse.json({ success: !(await supabase.from('schedules').delete().eq('id', payload.id)).error });
      default:
        return NextResponse.json({ success: false, error: 'Aksi tidak dikenal' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('[API Mutation Error]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

