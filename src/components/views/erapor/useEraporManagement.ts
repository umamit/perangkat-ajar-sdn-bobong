import { useState, useMemo, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { getTeacherAssignedClass } from "@/lib/utils";
import { buildStudentRaporData } from "@/modules/erapor/calculateStudentRapor";
import { DEFAULT_EXTRACURRICULARS } from "@/modules/erapor/raporSubjectTopics";
import { ExtracurricularRapor } from "@/types/erapor";
import { downloadEraporPDF } from "@/modules/generateEraporPDF";

export function useEraporManagement() {
  const { students, classes, teachers, grades, attendance, schoolSettings, currentTeacher, showToast } = useApp();
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const [selectedClassState, setSelectedClassState] = useState<string>(lockedClass || classes[0]?.id || "1A");
  const selectedClass = lockedClass || selectedClassState;
  const setSelectedClass = lockedClass ? () => {} : setSelectedClassState;

  const normalizeClass = (c: string) => (c ? c.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() : "");

  const classStudents = useMemo(() => {
    return students
      .filter(s => normalizeClass(s.classId) === normalizeClass(selectedClass) || s.classId === selectedClass)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedClass]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [customNotesMap, setCustomNotesMap] = useState<Record<string, string>>({});
  const [customEkskulMap, setCustomEkskulMap] = useState<Record<string, ExtracurricularRapor[]>>({});
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (classStudents.length > 0 && !classStudents.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(classStudents[0].id);
    } else if (classStudents.length === 0) {
      setSelectedStudentId("");
    }
  }, [classStudents, selectedStudentId]);

  const currentStudent = useMemo(() => {
    return classStudents.find(s => s.id === selectedStudentId) || classStudents[0] || null;
  }, [classStudents, selectedStudentId]);

  const raporData = useMemo(() => {
    if (!currentStudent) return null;
    const customNote = customNotesMap[currentStudent.id];
    const customEkskul = customEkskulMap[currentStudent.id];
    return buildStudentRaporData(
      currentStudent, classes, teachers, grades, attendance, schoolSettings, customNote, customEkskul
    );
  }, [currentStudent, classes, teachers, grades, attendance, schoolSettings, customNotesMap, customEkskulMap]);

  const handleUpdateNotes = (note: string) => {
    if (!currentStudent) return;
    setCustomNotesMap(prev => ({ ...prev, [currentStudent.id]: note }));
  };

  const handleUpdateEkskul = (idx: number, field: keyof ExtracurricularRapor, val: string) => {
    if (!currentStudent) return;
    const currentList = customEkskulMap[currentStudent.id] || DEFAULT_EXTRACURRICULARS.map(item => ({ ...item }));
    const updated = currentList.map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    setCustomEkskulMap(prev => ({ ...prev, [currentStudent.id]: updated }));
  };

  const handlePrintCurrentPDF = async () => {
    if (!raporData) return showToast("Pilih siswa terlebih dahulu", "error");
    setDownloading(true);
    try {
      showToast(`Menyiapkan berkas PDF e-Rapor ${raporData.name}...`, "info");
      await downloadEraporPDF(raporData);
      showToast(`e-Rapor ${raporData.name} berhasil diunduh!`, "success");
    } catch {
      showToast("Gagal membuat PDF e-Rapor", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handleNextStudent = () => {
    const idx = classStudents.findIndex(s => s.id === selectedStudentId);
    if (idx >= 0 && idx < classStudents.length - 1) setSelectedStudentId(classStudents[idx + 1].id);
  };

  const handlePrevStudent = () => {
    const idx = classStudents.findIndex(s => s.id === selectedStudentId);
    if (idx > 0) setSelectedStudentId(classStudents[idx - 1].id);
  };

  return {
    classes, lockedClass, selectedClass, setSelectedClass,
    classStudents, selectedStudentId, setSelectedStudentId,
    currentStudent, raporData, downloading,
    handleUpdateNotes, handleUpdateEkskul, handlePrintCurrentPDF, handleNextStudent, handlePrevStudent
  };
}
