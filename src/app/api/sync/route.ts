import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { INITIAL_DATA } from '@/data';

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

    const teachers = (teachersRes.data && teachersRes.data.length > 0) ? teachersRes.data : INITIAL_DATA.teachers;
    const classes = (classesRes.data && classesRes.data.length > 0) ? classesRes.data : INITIAL_DATA.classes;
    const students = (studentsRes.data && studentsRes.data.length > 0) ? studentsRes.data : INITIAL_DATA.students;
    const journals = (journalsRes.data && journalsRes.data.length > 0) ? journalsRes.data : (INITIAL_DATA.journals || []);
    const attendance = (attendanceRes.data && attendanceRes.data.length > 0) ? attendanceRes.data : [];
    const modules = (modulesRes.data && modulesRes.data.length > 0) ? modulesRes.data : (INITIAL_DATA.modules || []);
    const grades = (gradesRes.data && gradesRes.data.length > 0) ? gradesRes.data : [];

    return NextResponse.json({
      success: true,
      teachers,
      classes,
      students,
      journals,
      attendance,
      modules,
      grades
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      teachers: INITIAL_DATA.teachers,
      classes: INITIAL_DATA.classes,
      students: INITIAL_DATA.students,
      journals: INITIAL_DATA.journals || [],
      attendance: [],
      modules: INITIAL_DATA.modules || [],
      grades: []
    });
  }
}
