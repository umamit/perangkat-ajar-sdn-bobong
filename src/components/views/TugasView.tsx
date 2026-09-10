import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskItem } from '@/types';
import { saveAssignmentToSupabase, deleteAssignmentFromSupabase } from '@/lib/supabase';
import { uploadFileToSupabase } from '@/lib/supabaseStorage';
import { TaskTableDesktop } from './tugas/TaskTableDesktop';
import { TaskCardsMobile } from './tugas/TaskCardsMobile';
import { TaskFormModal } from './tugas/TaskFormModal';

export function TugasView() {
  const { assignments, setAssignments, currentTeacher, classes, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);

  const isKepsek = currentTeacher?.nip === '199610272019032006';

  const canDelete = (item: TaskItem) => {
    if (isKepsek) return true;
    return !item.teacherNip || item.teacherNip === currentTeacher?.nip;
  };

  const handleDelete = async (item: TaskItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus penugasan "${item.title}"?`)) return;

    try {
      const success = await deleteAssignmentFromSupabase(item.id);
      if (success) {
        setAssignments(prev => prev.filter(a => a.id !== item.id));
        showToast(`Penugasan "${item.title}" berhasil dihapus`, 'success');
      } else {
        showToast('Gagal menghapus penugasan dari cloud', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus penugasan', 'error');
    }
  };

  const handleSave = async (data: {
    title: string;
    classId: string;
    type: string;
    dueDate: string;
    description: string;
    file: File | null;
  }): Promise<boolean> => {
    let uploadedUrl: string | undefined;
    let fileName: string | undefined;

    if (data.file) {
      const nip = currentTeacher?.nip || 'public';
      const cleanName = data.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `soal/${nip}/${Date.now()}_${cleanName}`;

      const uploadResult = await uploadFileToSupabase('documents', storagePath, data.file);
      if (uploadResult.success && uploadResult.url) {
        uploadedUrl = uploadResult.url;
        fileName = data.file.name;
      } else {
        showToast(`Gagal mengunggah berkas: ${uploadResult.error || 'Terjadi kesalahan storage'}`, 'error');
        return false;
      }
    }

    const newAssignment: TaskItem = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      classId: data.classId,
      type: data.type,
      dueDate: data.dueDate,
      status: 'Aktif',
      description: data.description.trim(),
      teacherNip: currentTeacher?.nip,
      fileUrl: uploadedUrl,
      fileName: fileName
    };

    try {
      const success = await saveAssignmentToSupabase(newAssignment);
      if (success) {
        setAssignments(prev => [newAssignment, ...prev]);
        showToast(`Penugasan "${data.title}" berhasil disimpan ke cloud`, 'success');
        return true;
      } else {
        showToast('Gagal menyimpan penugasan ke cloud', 'error');
        return false;
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan penugasan', 'error');
      return false;
    }
  };

  const itemList = assignments || [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Manajemen Tugas &amp; Bank Soal</h3>
          <p className="text-xs text-slate-500 font-semibold">
            Daftar penugasan &amp; repositori soal Kurikulum Merdeka (Word, PDF, Excel, PPT, ZIP)
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowModal(true)}
          className="gap-1.5 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 shrink-0"
        >
          <i className="ri-file-upload-line" /> Buat Tugas / Unggah Soal
        </Button>
      </div>

      {/* Desktop Table Layout */}
      <Card className="hidden md:block rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <TaskTableDesktop tasks={itemList} onDelete={handleDelete} canDelete={canDelete} />
        </CardContent>
      </Card>

      {/* Mobile-First Card Layout */}
      <TaskCardsMobile tasks={itemList} onDelete={handleDelete} canDelete={canDelete} />

      {/* Modal Dialog Form */}
      <TaskFormModal
        open={showModal}
        onOpenChange={setShowModal}
        classes={classes}
        onSave={handleSave}
      />
    </div>
  );
}
