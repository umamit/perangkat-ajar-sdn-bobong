import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { saveAssignmentToSupabase, deleteAssignmentFromSupabase, uploadFileToSupabase } from "@/lib/supabase";
import { downloadLkpdPDF } from "@/modules/generateLkpdPDF";
import { LkpdItem } from "@/types/lkpd";

export function useLkpdManagement() {
  const { assignments, setAssignments, currentTeacher, classes, teachers, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "", classId: classes[0]?.id || "1A", tp: "", instructions: ""
  });

  const isKepsek = currentTeacher?.role?.toLowerCase().includes("kepala sekolah") ||
                   currentTeacher?.nip === "199610272019032006";

  const lkpdList: LkpdItem[] = useMemo(() => {
    return (assignments || [])
      .filter(a => a.type === "LKPD")
      .map(a => {
        const cls = classes.find(c => c.id === a.classId);
        const t = teachers.find(tch => tch.nip === a.teacherNip);
        return {
          id: a.id,
          title: a.title,
          classId: a.classId,
          phase: cls?.phase || "Fase A",
          subject: t?.subject || currentTeacher?.subject || "Bahasa Inggris",
          tp: a.description?.split("\n\nPetunjuk: ")[0]?.replace("TP: ", "") || "",
          instructions: a.description?.split("\n\nPetunjuk: ")[1] || a.description || "",
          fileUrl: a.fileUrl,
          fileName: a.fileName,
          teacherNip: a.teacherNip,
          teacherName: t?.name || (a.teacherNip === currentTeacher?.nip ? currentTeacher?.name : "Guru"),
          createdAt: a.dueDate
        };
      });
  }, [assignments, classes, teachers, currentTeacher]);

  const filteredLkpd = useMemo(() => {
    return lkpdList.filter(item => {
      const matchClass = selectedClass === "all" || item.classId === selectedClass;
      const matchTeacher = isKepsek || item.teacherNip === currentTeacher?.nip;
      return matchClass && matchTeacher;
    });
  }, [lkpdList, selectedClass, isKepsek, currentTeacher?.nip]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus LKPD ini?")) return;
    setAssignments(prev => prev.filter(a => a.id !== id));
    if (await deleteAssignmentFromSupabase(id)) {
      showToast("LKPD berhasil dihapus", "success");
    } else {
      showToast("Gagal menghapus LKPD dari database", "error");
    }
  };

  const handleDownloadPdf = async (item: LkpdItem) => {
    try {
      showToast(`Menyiapkan lembar kerja PDF: ${item.title}...`, "info");
      await downloadLkpdPDF(item, currentTeacher);
      showToast("Berkas PDF LKPD berhasil diunduh!", "success");
    } catch {
      showToast("Gagal mengunduh berkas PDF", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.instructions.trim()) {
      return showToast("Judul dan petunjuk aktivitas wajib diisi", "error");
    }
    setSaving(true);
    try {
      let fileUrl = null;
      let fileName = null;
      if (selectedFile) {
        if (selectedFile.size > 15 * 1024 * 1024) {
          showToast("Ukuran berkas maksimal 15MB", "error");
          setSaving(false);
          return;
        }
        const path = `${currentTeacher?.nip || "unknown"}_lkpd_${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const upload = await uploadFileToSupabase("documents", path, selectedFile);
        if (upload.success) {
          fileUrl = upload.url;
          fileName = selectedFile.name;
        } else {
          showToast(`Gagal unggah: ${upload.error}`, "error");
          setSaving(false);
          return;
        }
      }

      const combinedDesc = form.tp.trim()
        ? `TP: ${form.tp.trim()}\n\nPetunjuk: ${form.instructions.trim()}`
        : form.instructions.trim();

      const newAssignment = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        classId: form.classId,
        dueDate: new Date().toISOString().split("T")[0],
        type: "LKPD",
        status: "Aktif",
        description: combinedDesc,
        teacherNip: currentTeacher?.nip,
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined
      };

      if (await saveAssignmentToSupabase(newAssignment)) {
        setAssignments(prev => [newAssignment, ...prev]);
        showToast(`LKPD "${form.title}" berhasil disimpan`, "success");
        setShowModal(false);
        setForm({ title: "", classId: classes[0]?.id || "1A", tp: "", instructions: "" });
        setSelectedFile(null);
      } else {
        showToast("Gagal menyimpan LKPD ke cloud", "error");
      }
    } catch {
      showToast("Terjadi kesalahan saat menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  return {
    filteredLkpd, classes, currentTeacher, isKepsek, selectedClass,
    setSelectedClass, showModal, setShowModal, saving, form, setForm,
    setSelectedFile, handleDelete, handleDownloadPdf, handleSave
  };
}
