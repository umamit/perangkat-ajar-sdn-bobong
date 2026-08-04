import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabase();

    const [teachersRes, classesRes, studentsRes, journalsRes, attendanceRes, modulesRes, gradesRes] = await Promise.all([
      supabase.from('teachers').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('students').select('*'),
      supabase.from('journals').select('*'),
      supabase.from('attendance').select('*'),
      supabase.from('modules').select('*'),
      supabase.from('grades').select('*'),
    ]);

    return NextResponse.json({
      success: true,
      teachers: teachersRes.data || [],
      classes: classesRes.data || [],
      students: studentsRes.data || [],
      journals: journalsRes.data || [],
      attendance: attendanceRes.data || [],
      modules: modulesRes.data || [],
      grades: gradesRes.data || []
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
