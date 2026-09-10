import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TaskItem } from "@/types";
import { saveAssignmentToSupabase, deleteAssignmentFromSupabase } from "@/lib/supabase";
import { uploadFileToSupabase } from "@/lib/supabaseStorage";

export function useTaskManagement() {
  const { assignments, setAssignments, currentTeacher, classes, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const isKepsek = currentTeacher?.nip === "199610272019032006";

  const canDelete = (item: TaskItem) => isKepsek || !item.teacherNip || item.teacherNip === currentTeacher?.nip;

  const handleDelete = async (item: TaskItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus penugasan "${item.title}"?`)) return;
    try {
      if (await deleteAssignmentFromSupabase(item.id)) {
        setAssignments(prev => prev.filter(a => a.id !== item.id));
        showToast(`Penugasan "${item.title}" berhasil dihapus`, "success");
      } else { showToast("Gagal menghapus penugasan dari cloud", "error"); }
    } catch { showToast("Terjadi kesalahan saat menghapus penugasan", "error"); }
  };

  const handleSave = async (data: { title: string; classId: string; type: string; dueDate: string; description: string; file: File | null; }) => {
    let uploadedUrl: string | undefined, fileName: string | undefined;
    if (data.file) {
      const nip = currentTeacher?.nip || "public";
      const cleanName = data.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `soal/${nip}/${Date.now()}_${cleanName}`;
      const res = await uploadFileToSupabase("documents", storagePath, data.file);
      if (res.success && res.url) { uploadedUrl = res.url; fileName = data.file.name; }
      else { showToast(`Gagal mengunggah berkas: ${res.error || "Terjadi kesalahan"}`, "error"); return false; }
    }

    const newItem: TaskItem = {
      id: crypto.randomUUID(), title: data.title.trim(), classId: data.classId, type: data.type,
      dueDate: data.dueDate, status: "Aktif", description: data.description.trim(),
      teacherNip: currentTeacher?.nip, fileUrl: uploadedUrl, fileName
    };
    try {
      if (await saveAssignmentToSupabase(newItem)) {
        setAssignments(prev => [newItem, ...prev]);
        showToast(`Penugasan "${data.title}" berhasil disimpan`, "success");
        return true;
      }
      showToast("Gagal menyimpan penugasan ke cloud", "error");
      return false;
    } catch { showToast("Terjadi kesalahan saat menyimpan", "error"); return false; }
  };

  const handleVerify = async (item: TaskItem) => {
    try {
      const updated: TaskItem = { ...item, status: "Aktif" };
      if (await saveAssignmentToSupabase(updated)) {
        setAssignments(prev => prev.map(a => a.id === item.id ? updated : a));
        showToast(`Penugasan "${item.title}" berhasil disetujui & aktif!`, "success");
      } else { showToast("Gagal memverifikasi penugasan", "error"); }
    } catch { showToast("Terjadi kesalahan saat memverifikasi", "error"); }
  };

  const handleCopyPublicLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.origin + "/unggah-soal");
    showToast("Tautan unggah soal publik berhasil disalin!", "success");
  };

  return { assignments, classes, isKepsek, showModal, setShowModal, canDelete, handleDelete, handleSave, handleVerify, handleCopyPublicLink };
}
