"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CounselingLog, Student } from "@/types";
import { saveCounselingLogToSupabase, deleteCounselingLogFromSupabase } from "@/lib/supabase";
import { CounselingHistoryList } from "./CounselingHistoryList";
import { CounselingFormModal } from "./CounselingFormModal";

interface CounselingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function CounselingModal({ isOpen, onOpenChange, student }: CounselingModalProps) {
  const { counselingLogs, setCounselingLogs, currentTeacher, showToast } = useApp();
  const [saving, setSaving] = useState(false);
  const isKepsek = currentTeacher?.nip === "199610272019032006";

  if (!student) return null;
  const studentLogs = counselingLogs.filter(l => l.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date));

  const handleSave = async (formData: { date: string; category: any; notes: string; followUp: string }) => {
    setSaving(true);
    const newLog: CounselingLog = {
      id: crypto.randomUUID(), studentId: student.id, date: formData.date, category: formData.category,
      notes: formData.notes.trim(), followUp: formData.followUp.trim() || undefined, teacherNip: currentTeacher?.nip || ""
    };
    setCounselingLogs(prev => [newLog, ...prev]);
    showToast("Catatan BK berhasil disimpan di memori.", "success");
    const success = await saveCounselingLogToSupabase(newLog);
    if (!success) {
      const { addToOfflineQueue } = require("@/lib/offlineSync");
      addToOfflineQueue("saveCounselingLog", newLog);
      showToast("Koneksi lambat, data disimpan offline.", "info");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan bimbingan ini?")) return;
    setCounselingLogs(prev => prev.filter(log => log.id !== id));
    showToast("Catatan BK terhapus.", "success");
    const success = await deleteCounselingLogFromSupabase(id);
    if (!success) {
      const { addToOfflineQueue } = require("@/lib/offlineSync");
      addToOfflineQueue("deleteCounselingLog", id);
      showToast("Koneksi terganggu, penghapusan akan diulang.", "error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-heart-pulse-line text-primary text-lg" />
            Catatan BK & Orang Tua: <span className="text-primary-dark">{student.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-3 text-xs">
          <CounselingHistoryList studentLogs={studentLogs} isKepsek={isKepsek} handleDelete={handleDelete} />
          {isKepsek && <CounselingFormModal saving={saving} onSave={handleSave} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
