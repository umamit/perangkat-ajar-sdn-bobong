import { useState, useMemo, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { saveGradeToSupabase } from "@/lib/supabase";
import { downloadNilaiPDF } from "@/modules/generateNilaiPDF";
import { exportNilaiExcel } from "@/modules/exportNilaiExcel";
import { getTeacherAssignedClass } from "@/lib/utils";
import { StudentCurriculumGrade, GradeFieldPath } from "./gradeCurriculumTypes";
import { computeCompleteGrade } from "./gradeCalculator";

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

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesClass = selectedClass === "ALL" || normalizeClass(s.classId) === normalizeClass(selectedClass) || s.classId === selectedClass;
      return matchesClass;
    });
  }, [students, selectedClass]);

  // Transform grades into full curriculum rows
  const gradesData: StudentCurriculumGrade[] = useMemo(() => {
    return filteredStudents.map(s => {
      const studentGrades = grades.filter(g => (g.student_id === s.id || g.studentId === s.id) && g.subject === selectedSubject);
      const getScore = (type: string) => {
        const item = studentGrades.find(g => g.type === type);
        return item ? Number(item.score) : undefined;
      };

      const rawRow: StudentCurriculumGrade = {
        studentId: s.id,
        name: s.name,
        nis: s.nis || "-",
        classId: s.classId || "-",
        f_lm1: { tp1: getScore("F_LM1_TP1"), tp2: getScore("F_LM1_TP2"), tp3: getScore("F_LM1_TP3") },
        f_lm2: { tp1: getScore("F_LM2_TP1"), tp2: getScore("F_LM2_TP2"), tp3: getScore("F_LM2_TP3") },
        f_lm3: { tp1: getScore("F_LM3_TP1"), tp2: getScore("F_LM3_TP2"), tp3: getScore("F_LM3_TP3") },
        f_lm4: { tp1: getScore("F_LM4_TP1"), tp2: getScore("F_LM4_TP2") },
        f_lm5: { tp1: getScore("F_LM5_TP1"), tp2: getScore("F_LM5_TP2"), tp3: getScore("F_LM5_TP3") },
        s_lm1: getScore("S_LM1"),
        s_lm2: getScore("S_LM2"),
        s_lm3: getScore("S_LM3"),
        s_lm4: getScore("S_LM4"),
        s_lm5: getScore("S_LM5"),
        uh: getScore("UH"),
        sts: getScore("STS"),
        sas: getScore("SAS"),
      };

      return computeCompleteGrade(rawRow);
    });
  }, [filteredStudents, grades, selectedSubject]);

  const handleCellChange = useCallback(async (studentId: string, path: GradeFieldPath, value: number) => {
    // Map path into database type code
    const typeCode = path.toUpperCase().replace(".", "_");

    setGrades(prev => {
      const idx = prev.findIndex(g => (g.student_id === studentId || g.studentId === studentId) && g.subject === selectedSubject && g.type === typeCode);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], score: value };
        return updated;
      }
      return [...prev, { student_id: studentId, studentId, classId: selectedClass, class_id: selectedClass, subject: selectedSubject, type: typeCode, score: value }];
    });

    try {
      await saveGradeToSupabase({
        student_id: studentId,
        subject: selectedSubject,
        type: typeCode,
        score: value,
        class_id: selectedClass === "ALL" ? "" : selectedClass,
        teacher_nip: currentTeacher?.nip || "",
      });
    } catch {}
  }, [selectedSubject, selectedClass, currentTeacher?.nip, setGrades]);

  const handleExportExcel = () => {
    exportNilaiExcel(filteredStudents, selectedClass, gradesData);
    showToast("Rekap nilai Excel berhasil diunduh!", "success");
  };

  const handleDownloadPDF = () => {
    downloadNilaiPDF({
      className: selectedClass,
      students: filteredStudents,
      teacherName: currentTeacher?.name,
      teacherNip: currentTeacher?.nip,
      teacherSubject: selectedSubject,
    });
    showToast("Rekap nilai PDF berhasil diunduh!", "success");
  };

  return {
    students, classes, currentTeacher, showToast, grades, setGrades,
    selectedClass, setSelectedClass, lockedClass,
    selectedSubject, setSelectedSubject,
    activeTab, setActiveTab,
    filteredStudents, gradesData,
    handleCellChange, handleExportExcel, handleDownloadPDF,
    normalizeClass,
  };
}
