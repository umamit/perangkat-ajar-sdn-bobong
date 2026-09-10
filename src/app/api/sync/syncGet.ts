import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function handleSyncGet(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieHeader = request.headers.get("cookie") || "";
    const cookieNip = cookieHeader
      .split("; ")
      .find(row => row.startsWith("sdn_bobong_nip="))
      ?.split("=")[1] || "";
      
    const nip = cookieNip || searchParams.get("nip") || "";
    const supabase = getSupabase();

    let journalQuery = supabase.from("journals").select("*");
    let moduleQuery = supabase.from("modules").select("*");
    let assignmentQuery = supabase.from("assignments").select("*");
    let flashcardQuery = supabase.from("flashcards").select("*");
    let gradeQuery = supabase.from("grades").select("*");
    let counselingQuery = supabase.from("counseling_logs").select("*");
    let scheduleQuery = supabase.from("schedules").select("*");

    const isKepsekNip = nip === "199610272019032006";

    if (nip && !isKepsekNip) {
      journalQuery = journalQuery.eq("teacher_nip", nip);
      moduleQuery = moduleQuery.eq("teacher_nip", nip);
      assignmentQuery = assignmentQuery.eq("teacher_nip", nip);
      flashcardQuery = flashcardQuery.eq("teacher_nip", nip);
      gradeQuery = gradeQuery.eq("teacher_nip", nip);
    } else if (!nip) {
      const emptyUuid = "00000000-0000-0000-0000-000000000000";
      journalQuery = journalQuery.eq("id", emptyUuid);
      moduleQuery = moduleQuery.eq("id", emptyUuid);
      assignmentQuery = assignmentQuery.eq("id", emptyUuid);
      flashcardQuery = flashcardQuery.eq("id", emptyUuid);
      gradeQuery = gradeQuery.eq("id", emptyUuid);
      counselingQuery = counselingQuery.eq("id", emptyUuid);
      scheduleQuery = scheduleQuery.eq("id", emptyUuid);
    }

    const [
      teachersRes, classesRes, studentsRes, journalsRes, attendanceRes,
      modulesRes, gradesRes, flashcardsRes, assignmentsRes, counselingRes,
      schedulesRes, settingsRes
    ] = await Promise.allSettled([
      supabase.from("teachers").select("*"),
      supabase.from("classes").select("*"),
      supabase.from("students").select("*"),
      journalQuery,
      supabase.from("attendance").select("*"),
      moduleQuery,
      gradeQuery,
      flashcardQuery,
      assignmentQuery,
      counselingQuery,
      scheduleQuery,
      supabase.from("school_settings").select("*")
    ]);

    const getValue = (res: PromiseSettledResult<any>) =>
      res.status === "fulfilled" && res.value && !res.value.error ? res.value.data : [];

    const teachersList = getValue(teachersRes).map((t: any) => {
      if (t) {
        const { password, ...rest } = t;
        return rest;
      }
      return t;
    });

    const settingsData = getValue(settingsRes);
    const schoolSettings = settingsData.length > 0 ? settingsData[0] : {
      id: "global",
      school_name: "SD Negeri Bobong",
      npsn: "60101234",
      academic_year: "2026/2027",
      semester: "Ganjil",
      headmaster_name: "Husnita Usman, M.Pd",
      headmaster_nip: "199610272019032006"
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
      teachers: [], classes: [], students: [], journals: [],
      attendance: [], modules: [], grades: [], flashcards: [],
      assignments: [], counselingLogs: [], schedules: [], schoolSettings: null
    }, { status: 500 });
  }
}
