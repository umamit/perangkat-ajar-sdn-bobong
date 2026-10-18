import { Student, GradeRecord, AttendanceRecord, ClassInfo, Teacher, SchoolSettings } from "@/types";
import { StudentRaporData, SubjectGradeRapor, ExtracurricularRapor } from "@/types/erapor";
import { SUBJECTS } from "@/components/views/nilai/useGradeManagement";
import { computeCompleteGrade } from "@/components/views/nilai/gradeCalculator";
import { StudentCurriculumGrade } from "@/components/views/nilai/gradeCurriculumTypes";
import { SUBJECT_TOPICS, DEFAULT_EXTRACURRICULARS } from "./raporSubjectTopics";

export function calculateSubjectFinalScore(student: Student, subject: string, grades: GradeRecord[]): number {
  const sGrades = grades.filter(g => (g.student_id === student.id || g.studentId === student.id) && g.subject === subject);
  const getScore = (type: string) => {
    const item = sGrades.find(g => g.type === type);
    return item ? Number(item.score) : undefined;
  };

  const rawRow: StudentCurriculumGrade = {
    studentId: student.id, name: student.name, nis: student.nis || "-", classId: student.classId || "-",
    f_lm1: { tp1: getScore("F_LM1_TP1"), tp2: getScore("F_LM1_TP2"), tp3: getScore("F_LM1_TP3") },
    f_lm2: { tp1: getScore("F_LM2_TP1"), tp2: getScore("F_LM2_TP2"), tp3: getScore("F_LM2_TP3") },
    f_lm3: { tp1: getScore("F_LM3_TP1"), tp2: getScore("F_LM3_TP2"), tp3: getScore("F_LM3_TP3") },
    f_lm4: { tp1: getScore("F_LM4_TP1"), tp2: getScore("F_LM4_TP2") },
    f_lm5: { tp1: getScore("F_LM5_TP1"), tp2: getScore("F_LM5_TP2") },
    s_lm1: getScore("S_LM1"), s_lm2: getScore("S_LM2"), s_lm3: getScore("S_LM3"),
    s_lm4: getScore("S_LM4"), s_lm5: getScore("S_LM5"),
    uh: getScore("Formatif") ?? getScore("UH"),
    sts: getScore("STS") ?? student.scoreSts ?? 0,
    sas: getScore("SAS") ?? student.scoreSas ?? 0,
  };

  const computed = computeCompleteGrade(rawRow);
  if (computed.nilaiAkhir && computed.nilaiAkhir > 0) return computed.nilaiAkhir;

  const fallbackScores = [student.scoreFormatif, student.scoreSumatif, student.scoreSts, student.scoreSas]
    .filter((v): v is number => typeof v === "number" && v > 0);
  if (fallbackScores.length > 0 && subject === "Bahasa Inggris") {
    return Math.round(fallbackScores.reduce((a, b) => a + b, 0) / fallbackScores.length);
  }
  return 0;
}

export function buildStudentRaporData(
  student: Student, classes: ClassInfo[], teachers: Teacher[],
  grades: GradeRecord[], attendance: AttendanceRecord[],
  schoolSettings?: SchoolSettings, customNotes?: string,
  customEkskul?: ExtracurricularRapor[]
): StudentRaporData {
  const cls = classes.find(c => c.id === student.classId);
  const religion = (student.religion || "Islam").toLowerCase();

  const activeSubjects = SUBJECTS.filter(subj => {
    if (subj === "Pendidikan Agama Kristen" && !religion.includes("kristen") && !religion.includes("protestan") && !religion.includes("katolik")) return false;
    if (subj === "Pendidikan Agama Islam" && (religion.includes("kristen") || religion.includes("protestan") || religion.includes("katolik"))) return false;
    return true;
  });

  const subjects: SubjectGradeRapor[] = activeSubjects.map((subject, idx) => {
    const score = calculateSubjectFinalScore(student, subject, grades);
    const topic = SUBJECT_TOPICS[subject] || { high: "menguasai materi pembelajaran dengan baik", guidance: "pendalaman materi lebih lanjut" };
    const predikat = score >= 88 ? "sangat baik" : score >= 75 ? "baik" : "cukup baik";
    const highText = score > 0
      ? `Menunjukkan penguasaan yang ${predikat} dalam ${topic.high}.`
      : `Belum terdapat rekaman nilai akhir pada mata pelajaran ${subject}.`;
    const guidanceText = score > 0 && score < 92
      ? `Perlu penguatan dan bimbingan lebih lanjut pada aspek ${topic.guidance}.`
      : score >= 92 ? `Pertahankan prestasi dan penguasaan konsep secara konsisten.` : `-`;

    return {
      no: idx + 1, subject, finalScore: score,
      competencyHigh: highText, competencyGuidance: guidanceText,
      fullDescription: `${highText} ${guidanceText !== "-" ? guidanceText : ""}`.trim()
    };
  });

  const sAtt = attendance.filter(a => (a.student_id === student.id || a.studentId === student.id));
  const sakit = sAtt.filter(a => a.status === "Sakit").length;
  const izin = sAtt.filter(a => a.status === "Izin").length;
  const alpa = sAtt.filter(a => a.status === "Alpa").length;

  const homeroomTeacher = teachers.find(t => t.role?.toLowerCase().includes(`wali kelas ${student.classId.toLowerCase()}`)) ||
    teachers.find(t => t.role?.toLowerCase().includes("wali kelas"));

  return {
    studentId: student.id, name: student.name, nis: student.nis || "-", nisn: student.nisn || "-",
    classId: student.classId, className: cls?.name || `Kelas ${student.classId}`,
    phase: cls?.phase || (["1A", "1B", "2A", "2B"].includes(student.classId) ? "Fase A" : ["3A", "3B", "4A", "4B"].includes(student.classId) ? "Fase B" : "Fase C"),
    semester: schoolSettings?.semester === "Genap" ? "2 (Genap)" : "1 (Ganjil)",
    academicYear: schoolSettings?.academic_year || "2026/2027",
    schoolName: schoolSettings?.school_name || "SD Negeri Bobong",
    npsn: schoolSettings?.npsn || "60101234",
    schoolAddress: "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791",
    subjects,
    extracurriculars: customEkskul || DEFAULT_EXTRACURRICULARS,
    attendance: { sakit, izin, alpa },
    homeroomNotes: customNotes || `Ananda ${student.name} menunjukkan sikap positif, semangat belajar yang baik, serta aktif mengikuti kegiatan pembelajaran di kelas. Terus tingkatkan kedisiplinan dan rajin membaca di rumah.`,
    homeroomTeacherName: homeroomTeacher?.name || "Wali Kelas",
    homeroomTeacherNip: homeroomTeacher?.nip || "-",
    headmasterName: schoolSettings?.headmaster_name || "Husnita Usman, M.Pd",
    headmasterNip: schoolSettings?.headmaster_nip || "199610272019032006"
  };
}
