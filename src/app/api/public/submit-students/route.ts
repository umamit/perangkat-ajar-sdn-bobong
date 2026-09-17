import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderName, classId, students } = body;

    if (!classId || !students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ success: false, message: "Data siswa atau kelas tidak valid" }, { status: 400 });
    }

    const supabase = getSupabase();
    const preparedRows = students.map((s: any) => ({
      id: s.id || crypto.randomUUID(),
      name: s.name.trim(),
      nis: s.nis ? String(s.nis).trim() : crypto.randomUUID(),
      class_id: classId,
      gender: s.gender === "P" ? "P" : "L",
      status: "Aktif",
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from("students")
      .upsert(preparedRows, { onConflict: "id" })
      .select();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || preparedRows.length,
      classId,
      senderName
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Internal server error" }, { status: 500 });
  }
}
