import { TaskItem, CounselingLog, ModuleAjar } from "@/types";

interface RawAssignment {
  id: string;
  title: string;
  class_id: string;
  due_date: string;
  status?: string;
  teacher_nip?: string;
  file_url?: string;
  file_name?: string;
  description?: string;
  type?: string;
}

interface RawCounselingLog {
  id: string;
  student_id: string;
  date: string;
  category: "Bimbingan" | "Konseling" | "Kunjungan Rumah" | "Telepon Orang Tua";
  notes: string;
  follow_up?: string;
  teacher_nip?: string;
  created_at?: string;
}

export interface RawModule {
  id: string;
  grade?: string;
  phase?: string;
  title: string;
  tp?: string;
  atp?: string;
  cp?: string;
  duration?: string;
  teacher_nip?: string;
  file_url?: string;
  class_id?: string;
}

export function mapAssignments(raw: RawAssignment[]): TaskItem[] {
  return raw.map((a): TaskItem => {
    let cleanTitle = a.title || "";
    let fileUrl: string | undefined = a.file_url;
    let fileName: string | undefined = a.file_name;
    let assignmentType = a.type || "Formatif";
    let description = a.description || "";

    const metaMatch = cleanTitle.match(/\s*__META__\[(.*?)\]$/);
    if (metaMatch) {
      cleanTitle = cleanTitle.replace(metaMatch[0], "").trim();
      const metaPairs = metaMatch[1].split("|");
      for (const pair of metaPairs) {
        const [k, ...vParts] = pair.split(":");
        const v = vParts.join(":");
        if (k === "FILE_URL" && !fileUrl) fileUrl = v;
        if (k === "FILE_NAME" && !fileName) {
          try { fileName = decodeURIComponent(v); } catch { fileName = v; }
        }
        if (k === "TYPE" && !a.type) assignmentType = v;
        if (k === "DESC" && !a.description) {
          try { description = decodeURIComponent(v); } catch { description = v; }
        }
      }
    }

    let fileType: string | undefined;
    const targetFile = fileName || fileUrl || "";
    if (targetFile.match(/\.pdf$/i)) fileType = "pdf";
    else if (targetFile.match(/\.(docx|doc)$/i)) fileType = "word";
    else if (targetFile.match(/\.(xlsx|xls|csv)$/i)) fileType = "excel";
    else if (targetFile.match(/\.(pptx|ppt)$/i)) fileType = "ppt";
    else if (targetFile.match(/\.(zip|rar|7z)$/i)) fileType = "zip";

    return {
      id: a.id,
      title: cleanTitle,
      classId: a.class_id,
      dueDate: a.due_date,
      type: assignmentType,
      status: a.status || "Aktif",
      description: description,
      teacherNip: a.teacher_nip,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType
    };
  });
}

export function mapCounselingLogs(raw: RawCounselingLog[]): CounselingLog[] {
  return raw.map((l): CounselingLog => ({
    id: l.id,
    studentId: l.student_id,
    date: l.date,
    category: l.category,
    notes: l.notes,
    followUp: l.follow_up || "",
    teacherNip: l.teacher_nip || "",
    created_at: l.created_at
  }));
}

export function mapModules(raw: RawModule[]): ModuleAjar[] {
  return raw.map((m): ModuleAjar => ({
    id: m.id,
    grade: m.grade || "",
    phase: m.phase || "Fase A",
    title: m.title,
    tp: m.tp || "",
    atp: m.atp || "",
    cp: m.cp || "",
    target: "",
    duration: m.duration || "2 x 35 Menit",
    materials: [],
    steps: [],
    assessment: "",
    teacherNip: m.teacher_nip || "",
    fileUrl: m.file_url || "",
    classId: m.class_id || "",
    file_url: m.file_url || "",
    teacher_nip: m.teacher_nip || "",
    class_id: m.class_id || ""
  }));
}
