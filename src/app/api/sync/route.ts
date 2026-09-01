import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Retrieve NIP securely from cookie first, fall back to query param
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieNip = cookieHeader
      .split('; ')
      .find(row => row.startsWith('sdn_bobong_nip='))
      ?.split('=')[1] || '';
      
    const nip = cookieNip || searchParams.get('nip') || '';

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
      schedulesRes,
      settingsRes
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
      scheduleQuery,
      supabase.from('school_settings').select('*')
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

    const settingsData = getValue(settingsRes);
    const schoolSettings = settingsData.length > 0 ? settingsData[0] : {
      id: 'global',
      school_name: 'SD Negeri Bobong',
      npsn: '60101234',
      academic_year: '2026/2027',
      semester: 'Ganjil',
      headmaster_name: 'Husnita Usman, M.Pd',
      headmaster_nip: '199610272019032006'
    };

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
      schedules: getValue(schedulesRes),
      schoolSettings
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
      schedules: [],
      schoolSettings: null
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const supabase = getSupabase();

    // Authenticate NIP via cookie with header/payload fallback for standalone PWA apps
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieNip = cookieHeader
      .split('; ')
      .find(row => row.startsWith('sdn_bobong_nip='))
      ?.split('=')[1] || '';
    const headerNip = request.headers.get('x-teacher-nip') || '';
    const activeNip = cookieNip || headerNip || payload?.teacher_nip || payload?.teacherNip || '';

    const isKepsek = activeNip === '199610272019032006';

    // Helper to check ownership for mutations
    const verifyOwnership = (itemTeacherNip: string | null | undefined) => {
      if (!isKepsek && itemTeacherNip && activeNip && itemTeacherNip !== activeNip) {
        throw new Error('Unauthorized: Anda tidak memiliki akses untuk mengubah data ini.');
      }
    };

    switch (action) {
      case 'saveSchoolSettings':
        if (!isKepsek) {
          return NextResponse.json({ success: false, error: 'Hanya Kepala Sekolah yang dapat mengubah pengaturan sekolah.' }, { status: 403 });
        }
        return NextResponse.json({ success: !(await supabase.from('school_settings').upsert(payload)).error });
      case 'saveTeacher':
        if (!isKepsek && payload.nip !== cookieNip) {
          return NextResponse.json({ success: false, error: 'Unauthorized NIP mutation' }, { status: 403 });
        }
        return NextResponse.json({ success: !(await supabase.from('teachers').upsert(payload, { onConflict: 'nip' })).error });
      case 'deleteTeacher':
        if (!isKepsek) {
          return NextResponse.json({ success: false, error: 'Hanya Kepala Sekolah yang dapat menghapus guru.' }, { status: 403 });
        }
        return NextResponse.json({ success: !(await supabase.from('teachers').delete().eq('nip', payload.nip)).error });
      case 'saveStudent':
        return NextResponse.json({ success: !(await supabase.from('students').upsert(payload)).error });
      case 'deleteStudent':
        if (!isKepsek) {
          return NextResponse.json({ success: false, error: 'Hanya Kepala Sekolah/Admin yang dapat menghapus siswa.' }, { status: 403 });
        }
        return NextResponse.json({ success: !(await supabase.from('students').delete().eq('id', payload.id)).error });
      case 'saveCounselingLog':
        if (!isKepsek) {
          return NextResponse.json({ success: false, error: 'Hanya Kepala Sekolah/Admin yang dapat mengubah catatan BK.' }, { status: 403 });
        }
        return NextResponse.json({ success: !(await supabase.from('counseling_logs').upsert(payload)).error });
      case 'deleteCounselingLog': {
        if (!isKepsek) {
          return NextResponse.json({ success: false, error: 'Hanya Kepala Sekolah/Admin yang dapat menghapus catatan BK.' }, { status: 403 });
        }
        return NextResponse.json({ success: !(await supabase.from('counseling_logs').delete().eq('id', payload.id)).error });
      }
      case 'saveJournal':
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('journals').upsert(payload)).error });
      case 'deleteJournal': {
        const { data } = await supabase.from('journals').select('teacher_nip').eq('id', payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('journals').delete().eq('id', payload.id)).error });
      }
      case 'saveFlashcard':
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('flashcards').upsert(payload)).error });
      case 'deleteFlashcard': {
        const { data } = await supabase.from('flashcards').select('teacher_nip').eq('id', payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('flashcards').delete().eq('id', payload.id)).error });
      }
      case 'deleteFlashcardDeck': {
        const { title, teacher_nip } = payload;
        verifyOwnership(teacher_nip);
        let query = supabase.from('flashcards').delete().eq('title', title);
        if (!isKepsek) {
          query = query.eq('teacher_nip', cookieNip);
        }
        return NextResponse.json({ success: !(await query).error });
      }
      case 'saveAssignment':
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('assignments').upsert(payload)).error });
      case 'deleteAssignment': {
        const { data } = await supabase.from('assignments').select('teacher_nip').eq('id', payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('assignments').delete().eq('id', payload.id)).error });
      }
      case 'saveModule':
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('modules').upsert(payload)).error });
      case 'deleteModule': {
        const { data } = await supabase.from('modules').select('teacher_nip').eq('id', payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('modules').delete().eq('id', payload.id)).error });
      }
      case 'saveClass':
        if (!isKepsek) return NextResponse.json({ success: false, error: 'Unauthorized class modification' }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from('classes').upsert(payload)).error });
      case 'deleteClass':
        if (!isKepsek) return NextResponse.json({ success: false, error: 'Unauthorized class deletion' }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from('classes').delete().eq('id', payload.id)).error });
      case 'saveGrade':
        // Grade records have student IDs. We can allow upsert, but let's check ownership
        verifyOwnership(payload.teacher_nip);
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
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('schedules').upsert(payload)).error });
      case 'deleteSchedule': {
        const { data } = await supabase.from('schedules').select('teacher_nip').eq('id', payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from('schedules').delete().eq('id', payload.id)).error });
      }
      default:
        return NextResponse.json({ success: false, error: 'Aksi tidak dikenal' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('[API Mutation Error]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

