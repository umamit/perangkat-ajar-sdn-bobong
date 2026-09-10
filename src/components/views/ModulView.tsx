import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { saveModuleToSupabase, uploadFileToSupabase, deleteModuleFromSupabase } from "@/lib/supabase";
import { AddModulModal } from "./modul/AddModulModal";
import { downloadModulPDF } from "@/modules/generateModulPDF";
import { ModulCardItem } from "./modul/ModulCardItem";

export function ModulView() {
  const { modules, currentTeacher, classes, teachers, showToast, setModules, syncData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "", classId: classes[0]?.id || "1A", duration: "2 x 35 Menit", tp: "", cp: ""
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus modul ajar ini dari cloud?")) return;
    setModules((prev: any[]) => prev.filter(m => m.id !== id));
    if (await deleteModuleFromSupabase(id)) showToast("Modul ajar berhasil dihapus", "success");
    else { showToast("Gagal menghapus modul dari database cloud", "error"); await syncData(); }
  };

  const handleDownloadPDF = async (m: any) => {
    try {
      showToast(`Memproses Berkas PDF Modul ${m.title}...`, "info");
      await downloadModulPDF({
        modul: { title: m.title, fase: m.grade || m.phase || "Fase A", classId: m.classId || "1A", description: m.tp ? `TP: ${m.tp}\nATP: ${m.atp || "-"}` : undefined },
        teacherName: currentTeacher?.name, teacherNip: currentTeacher?.nip, teacherRole: currentTeacher?.role, teacherSubject: currentTeacher?.subject,
      });
      showToast(`PDF Modul ${m.title} Berhasil Diunduh!`, "success");
    } catch { showToast("Gagal mencetak PDF Modul Ajar", "error"); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.tp.trim() || !form.cp.trim()) return showToast("Semua field wajib diisi", "error");
    setSaving(true);
    try {
      const cls = classes.find(c => c.id === form.classId);
      let fileUrl = null;
      if (selectedFile) {
        if (selectedFile.size > 15 * 1024 * 1024) { showToast("Ukuran berkas modul maksimal 15MB", "error"); setSaving(false); return; }
        const path = `${currentTeacher?.nip || "unknown"}_mod_${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const upload = await uploadFileToSupabase("documents", path, selectedFile);
        if (upload.success) fileUrl = upload.url;
        else { showToast(`Gagal mengunggah berkas: ${upload.error}`, "error"); setSaving(false); return; }
      }
      const newModul: any = {
        id: crypto.randomUUID(), title: form.title.trim(), grade: cls?.name || `Kelas ${form.classId}`,
        classId: form.classId, phase: cls?.phase || "Fase A", duration: form.duration.trim(),
        tp: form.tp.trim(), atp: form.tp.trim(), cp: form.cp.trim(), teacherNip: currentTeacher?.nip, fileUrl: fileUrl || undefined
      };
      if (await saveModuleToSupabase(newModul)) {
        setModules((prev: any[]) => [newModul, ...prev]);
        showToast(`Modul Ajar "${form.title}" berhasil ditambahkan`, "success");
        setShowModal(false);
        setForm({ title: "", classId: classes[0]?.id || "1A", duration: "2 x 35 Menit", tp: "", cp: "" });
        setSelectedFile(null);
      } else showToast("Gagal menyimpan modul ke cloud", "error");
    } catch { showToast("Terjadi kesalahan saat menyimpan", "error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Perangkat & Modul Ajar Kurikulum Merdeka</h3>
          <p className="text-xs text-slate-500 font-semibold">Modul Ajar {currentTeacher?.subject || "Mata Pelajaran"} SD Negeri Bobong</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
          <i className="ri-upload-cloud-line" /> Unggah Modul Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m, idx) => (
          <ModulCardItem key={m.id || idx} m={m} classes={classes} teachers={teachers} currentTeacher={currentTeacher} handleDelete={handleDelete} handleDownloadPDF={handleDownloadPDF} />
        ))}
      </div>

      <AddModulModal isOpen={showModal} onClose={() => setShowModal(false)} classes={classes} form={form} setForm={setForm} saving={saving} onSave={handleSave} setSelectedFile={setSelectedFile} />
    </div>
  );
}
