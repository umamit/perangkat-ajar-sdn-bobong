import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { deleteStudentFromSupabase, saveStudentToSupabase } from "@/lib/supabase";
import { getTeacherAssignedClass } from "@/lib/utils";
import { studentSchema, initialStudentForm } from "./studentSchema";
import { downloadSiswaPDF } from "@/modules/generateSiswaPDF";
import { exportSiswaExcel } from "@/modules/exportSiswaExcel";
import { parseStudentImport } from "@/modules/parseStudentImport";

export function useStudentManagement() {
  const { students, classes, currentTeacher, showToast, setStudents, syncData, selectedClassFilter, setSelectedClassFilter, isLoading } = useApp();
  const [search, setSearch] = useState("");
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const selectedClass = lockedClass || selectedClassFilter;
  const setSelectedClass = lockedClass ? () => {} : setSelectedClassFilter;
  const isKepsek = !!(currentTeacher?.role?.toLowerCase().includes("kepala sekolah") || currentTeacher?.role?.toLowerCase().includes("admin") || currentTeacher?.nip === "199610272019032006");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCounselingModal, setShowCounselingModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedCounselingStudent, setSelectedCounselingStudent] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [addForm, setAddForm] = useState({ ...initialStudentForm, classId: lockedClass || classes[0]?.id || "1A" });
  const [editForm, setEditForm] = useState({ ...initialStudentForm, id: "" });

  const normalizeClass = (c: string) => (c ? c.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() : "");

  const filteredStudents = students.filter(s => {
    const matchesName = s.name.toLowerCase().includes(search.toLowerCase()) || (s.nis && s.nis.includes(search));
    const matchesClass = selectedClass === "ALL" || normalizeClass(s.classId) === normalizeClass(selectedClass) || s.classId === selectedClass;
    return matchesName && matchesClass;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data siswa ${name}?`)) return;
    try {
      setStudents(prev => prev.filter(s => s.id !== id && s.nis !== id));
      await deleteStudentFromSupabase(id);
      showToast(`Siswa ${name} berhasil dihapus permanen`, "info");
    } catch {
      showToast("Gagal menghapus siswa", "error");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = studentSchema.safeParse(addForm);
    if (!validation.success) return showToast(validation.error.errors[0].message, "error");
    setSaving(true);
    try {
      const generatedId = crypto.randomUUID();
      const newStudent = { ...addForm, id: generatedId, nis: addForm.nis.trim() || generatedId, scoreFormatif: 0, scoreSumatif: 0, scoreSts: 0, scoreSas: 0 };
      if (await saveStudentToSupabase(newStudent)) {
        setStudents(prev => [...prev, newStudent]);
        showToast(`Siswa ${addForm.name} berhasil ditambahkan`, "success");
        setShowAddModal(false);
        setAddForm({ ...initialStudentForm, classId: classes[0]?.id || "1A" });
      } else {
        showToast("Gagal menyimpan siswa ke cloud", "error");
      }
    } catch {
      showToast("Terjadi kesalahan saat menyimpan", "error");
    } finally { setSaving(false); }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = studentSchema.safeParse(editForm);
    if (!validation.success) return showToast(validation.error.errors[0].message, "error");
    setSaving(true);
    try {
      const updatedStudent = { ...editForm, id: editForm.id, nis: editForm.nis.trim() || editForm.id };
      if (await saveStudentToSupabase(updatedStudent)) {
        setStudents(prev => prev.map(s => s.id === editForm.id ? { ...s, ...updatedStudent } : s));
        showToast(`Perubahan data siswa ${editForm.name} berhasil disimpan`, "success");
        setShowEditModal(false);
      } else {
        showToast("Gagal mengupdate data siswa ke cloud", "error");
      }
    } catch {
      showToast("Terjadi kesalahan saat menyimpan", "error");
    } finally { setSaving(false); }
  };

  const handleDirectImport = async (file: File) => {
    const targetClass = selectedClass !== "ALL" ? selectedClass : (classes[0]?.id || "1A");
    await parseStudentImport(file, targetClass, showToast, (newStudents) => {
      setStudents(prev => [...prev, ...newStudents]);
      setShowImportModal(false);
    });
  };

  const handleEditClick = (student: any) => {
    setEditForm({ ...student, id: student.id, gender: student.gender || "L" });
    setShowEditModal(true);
  };

  const handleCounselingClick = (student: any) => {
    setSelectedCounselingStudent(student);
    setShowCounselingModal(true);
  };

  const handleDownloadPDF = async () => {
    if (filteredStudents.length === 0) return showToast("Tidak ada data siswa untuk dicetak", "error");
    try {
      showToast("Memproses Berkas PDF Data Siswa...", "info");
      await downloadSiswaPDF({
        className: selectedClass, students: filteredStudents,
        teacherName: currentTeacher?.name, teacherNip: currentTeacher?.nip, teacherRole: currentTeacher?.role,
      });
      showToast("PDF Data Siswa Berhasil Diunduh!", "success");
    } catch { showToast("Gagal mencetak PDF Data Siswa", "error"); }
  };

  const handleExportExcel = () => {
    if (filteredStudents.length === 0) return showToast("Tidak ada data siswa untuk diekspor", "error");
    try {
      showToast("Mengunduh File Excel Data Siswa...", "info");
      exportSiswaExcel(filteredStudents, selectedClass);
      showToast("Excel Data Siswa Berhasil Diunduh!", "success");
    } catch { showToast("Gagal mengekspor file Excel Data Siswa", "error"); }
  };

  return {
    students, classes, currentTeacher, showToast, setStudents, syncData, isLoading,
    search, setSearch, lockedClass, selectedClass, setSelectedClass, isKepsek,
    showAddModal, setShowAddModal, showEditModal, setShowEditModal,
    showImportModal, setShowImportModal, showCounselingModal, setShowCounselingModal,
    showSyncModal, setShowSyncModal, showCollectionModal, setShowCollectionModal,
    selectedCounselingStudent,
    saving, setSaving, addForm, setAddForm, editForm, setEditForm,
    filteredStudents, handleDelete, handleAddSubmit, handleEditSubmit, handleDirectImport,
    handleEditClick, handleCounselingClick, handleDownloadPDF, handleExportExcel, normalizeClass
  };
}
