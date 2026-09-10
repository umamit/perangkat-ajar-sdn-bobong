import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function handleSyncPost(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const supabase = getSupabase();

    const cookieHeader = request.headers.get("cookie") || "";
    const cookieNip = cookieHeader
      .split("; ")
      .find(row => row.startsWith("sdn_bobong_nip="))
      ?.split("=")[1] || "";
    const headerNip = request.headers.get("x-teacher-nip") || "";
    const activeNip = cookieNip || headerNip || payload?.teacher_nip || payload?.teacherNip || "";
    const isKepsek = activeNip === "199610272019032006";

    const verifyOwnership = (itemTeacherNip: string | null | undefined) => {
      if (!isKepsek && itemTeacherNip && activeNip && itemTeacherNip !== activeNip) {
        throw new Error("Unauthorized: Anda tidak memiliki akses untuk mengubah data ini.");
      }
    };

    switch (action) {
      case "saveSchoolSettings":
        if (!isKepsek) return NextResponse.json({ success: false, error: "Hanya Kepala Sekolah" }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from("school_settings").upsert(payload)).error });
      case "saveTeacher":
        if (!isKepsek && payload.nip !== activeNip) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from("teachers").upsert(payload, { onConflict: "nip" })).error });
      case "deleteTeacher":
        if (!isKepsek) return NextResponse.json({ success: false, error: "Hanya Kepala Sekolah" }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from("teachers").delete().eq("nip", payload.nip)).error });
      case "saveStudent":
        return NextResponse.json({ success: !(await supabase.from("students").upsert(payload)).error });
      case "deleteStudent":
        if (!isKepsek) return NextResponse.json({ success: false, error: "Hanya Kepala Sekolah" }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from("students").delete().eq("id", payload.id)).error });
      case "saveCounselingLog":
        if (!isKepsek) return NextResponse.json({ success: false, error: "Hanya Kepala Sekolah" }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from("counseling_logs").upsert(payload)).error });
      case "deleteCounselingLog":
        if (!isKepsek) return NextResponse.json({ success: false, error: "Hanya Kepala Sekolah" }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from("counseling_logs").delete().eq("id", payload.id)).error });
      case "saveJournal":
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("journals").upsert(payload)).error });
      case "deleteJournal": {
        const { data } = await supabase.from("journals").select("teacher_nip").eq("id", payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("journals").delete().eq("id", payload.id)).error });
      }
      case "saveFlashcard":
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("flashcards").upsert(payload)).error });
      case "deleteFlashcard": {
        const { data } = await supabase.from("flashcards").select("teacher_nip").eq("id", payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("flashcards").delete().eq("id", payload.id)).error });
      }
      case "deleteFlashcardDeck": {
        const { title, teacher_nip } = payload;
        verifyOwnership(teacher_nip);
        let query = supabase.from("flashcards").delete().eq("title", title);
        if (!isKepsek) query = query.eq("teacher_nip", activeNip);
        return NextResponse.json({ success: !(await query).error });
      }
      case "saveAssignment":
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("assignments").upsert(payload)).error });
      case "deleteAssignment": {
        const { data } = await supabase.from("assignments").select("teacher_nip").eq("id", payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("assignments").delete().eq("id", payload.id)).error });
      }
      case "saveModule":
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("modules").upsert(payload)).error });
      case "deleteModule": {
        const { data } = await supabase.from("modules").select("teacher_nip").eq("id", payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("modules").delete().eq("id", payload.id)).error });
      }
      case "saveClass":
        if (!isKepsek) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from("classes").upsert(payload)).error });
      case "deleteClass":
        if (!isKepsek) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        return NextResponse.json({ success: !(await supabase.from("classes").delete().eq("id", payload.id)).error });
      case "saveGrade":
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("grades").upsert(payload)).error });
      case "deleteGrade": {
        const { studentId, type } = payload;
        let query = supabase.from("grades").delete().eq("student_id", studentId);
        if (type) query = query.eq("type", type);
        return NextResponse.json({ success: !(await query).error });
      }
      case "saveAttendance":
        return NextResponse.json({ success: !(await supabase.from("attendance").upsert(payload, { onConflict: "student_id,date" })).error });
      case "deleteAttendance":
        return NextResponse.json({ success: !(await supabase.from("attendance").delete().eq("student_id", payload.studentId).eq("date", payload.date)).error });
      case "saveSchedule":
        verifyOwnership(payload.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("schedules").upsert(payload)).error });
      case "deleteSchedule": {
        const { data } = await supabase.from("schedules").select("teacher_nip").eq("id", payload.id).single();
        if (data) verifyOwnership(data.teacher_nip);
        return NextResponse.json({ success: !(await supabase.from("schedules").delete().eq("id", payload.id)).error });
      }
      default:
        return NextResponse.json({ success: false, error: "Aksi tidak dikenal" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("[API Mutation Error]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
