import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { saveGradeToSupabase } from "@/lib/supabase";
import { addToOfflineQueue } from "@/lib/offlineSync";
import { downloadNilaiPDF } from "@/modules/generateNilaiPDF";
import { exportNilaiExcel } from "@/modules/exportNilaiExcel";
import { getTeacherAssignedClass } from "@/lib/utils";

export const SUBJECTS = [
  "Matematika", "Bahasa Indonesia", "IPAS", "Pendidikan Pancasila",
  "Seni Budaya", "PJOK", "Pendidikan Agama Islam", "Pendidikan Agama Kristen",
  "Bahasa Inggris", "Muatan Lokal"
];

export function useGradeManagement() {
  const { students, classes, currentTeacher, showToast, grades, setGrades } = useApp();
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const [selectedClassState, setSelectedClassState] = useState(lockedClass || "ALL");
  const [activeTab, setActiveTab] = useState<"input" | "analisis">("input");
  const selectedClass = lockedClass || selectedClassState;
  const setSelectedClass = lockedClass ? () => {} : setSelectedClassState;

  const [aiDialog, setAiDialog] = useState({ open: false, studentName: "", studentClass: "", score: 0 });

  const isGuruMapel = currentTeacher?.role === "Guru Mata Pelajaran";
  const getNormalizedDefaultSubject = () => {
    const rawSubj = (currentTeacher?.subject || "").toLowerCase();
    if (rawSubj.includes("bahasa inggris")) return "Bahasa Inggris";
    if (rawSubj.includes("pjok")) return "PJOK";
    if (rawSubj.includes("kristen")) return "Pendidikan Agama Kristen";
    if (rawSubj.includes("agama")) return "Pendidikan Agama Islam";
    return "Matematika";
  };
  const [selectedSubject, setSelectedSubject] = useState(getNormalizedDefaultSubject());

  const normalizeClass = (c: string) => (c ? c.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() : "");

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === "ALL" || normalizeClass(s.classId) === normalizeClass(selectedClass) || s.classId === selectedClass;
    return matchesClass;
  });

  const getStudentScore = (studentId: string, type: "Formatif" | "STS" | "SAS") => {
    const record = grades.find(g => g.student_id === studentId && g.subject === selectedSubject && g.type === type);
    return record ? Number(record.score) : 0;
  };

  const handleGradeChange = async (studentId: string, type: "Formatif" | "STS" | "SAS", val: number) => {
    const num = Math.min(100, Math.max(0, val || 0));
    setGrades(prev => {
      const idx = prev.findIndex(g => g.student_id === studentId && g.subject === selectedSubject && g.type === type);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], score: num };
        return updated;
      }
      return [...prev, { student_id: studentId, studentId, classId: selectedClass, class_id: selectedClass, subject: selectedSubject, type, score: num }];
    });

    const targetStudent = students.find(s => s.id === studentId || s.nis === studentId);
    if (!targetStudent) return;
    const existing = grades.find(g => g.student_id === studentId && g.subject === selectedSubject && g.type === type);
    const payload: any = { student_id: studentId, type, score: num, class_id: targetStudent.classId, subject: selectedSubject, teacher_nip: currentTeacher?.nip || "" };
    if (existing?.id) payload.id = existing.id;
    const ok = await saveGradeToSupabase(payload);
    if (!ok && typeof navigator !== "undefined" && !navigator.onLine) {
      addToOfflineQueue("saveGrade", payload);
    }
  };

  const getStudentsWithGrades = () => filteredStudents.map(s => ({
    ...s,
    scoreFormatif: getStudentScore(s.id, "Formatif"),
    scoreSts: getStudentScore(s.id, "STS"),
    scoreSas: getStudentScore(s.id, "SAS"),
  }));

  const handleDownloadPDF = async () => {
    if (filteredStudents.length === 0) return showToast("Tidak ada data nilai untuk dicetak", "error");
    try {
      showToast("Memproses Berkas PDF Daftar Nilai...", "info");
      await downloadNilaiPDF({
        className: selectedClass, students: getStudentsWithGrades(),
        teacherName: currentTeacher?.name, teacherNip: currentTeacher?.nip,
        teacherRole: currentTeacher?.role, teacherSubject: selectedSubject,
      });
      showToast("PDF Daftar Nilai Berhasil Diunduh!", "success");
    } catch { showToast("Gagal mencetak PDF Daftar Nilai", "error"); }
  };

  const handleExportExcel = () => {
    if (filteredStudents.length === 0) return showToast("Tidak ada data nilai untuk diekspor", "error");
    try {
      showToast("Mengunduh File Excel Daftar Nilai...", "info");
      exportNilaiExcel(getStudentsWithGrades(), selectedClass);
      showToast("Excel Daftar Nilai Berhasil Diunduh!", "success");
    } catch { showToast("Gagal mengekspor file Excel", "error"); }
  };

  return {
    students, classes, currentTeacher, grades, lockedClass, selectedClass, setSelectedClass,
    activeTab, setActiveTab, aiDialog, setAiDialog, isGuruMapel, selectedSubject, setSelectedSubject,
    normalizeClass, filteredStudents, getStudentScore, handleGradeChange, handleDownloadPDF, handleExportExcel
  };
}
