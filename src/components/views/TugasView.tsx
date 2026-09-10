import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskTableDesktop } from "./tugas/TaskTableDesktop";
import { TaskCardsMobile } from "./tugas/TaskCardsMobile";
import { TaskFormModal } from "./tugas/TaskFormModal";
import { useTaskManagement } from "./tugas/useTaskManagement";

export function TugasView() {
  const t = useTaskManagement();
  const itemList = t.assignments || [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Manajemen Tugas & Bank Soal</h3>
          <p className="text-xs text-slate-500 font-semibold">Daftar penugasan & repositori soal Kurikulum Merdeka (Word, PDF, Excel, PPT, ZIP)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={t.handleCopyPublicLink} className="text-xs font-black bg-cyan-50/80 text-primary-dark border border-cyan-200/60 hover:bg-cyan-100/80 rounded-xl gap-1.5 shrink-0" title="Salin link publik">
            <i className="ri-share-forward-line text-sm text-cyan-600" /> Bagikan Link Publik
          </Button>
          <Button size="sm" onClick={() => t.setShowModal(true)} className="gap-1.5 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 shrink-0">
            <i className="ri-file-upload-line" /> Buat Tugas / Unggah Soal
          </Button>
        </div>
      </div>

      <Card className="hidden md:block rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <TaskTableDesktop tasks={itemList} onDelete={t.handleDelete} canDelete={t.canDelete} onVerify={t.handleVerify} isKepsek={t.isKepsek} />
        </CardContent>
      </Card>

      <TaskCardsMobile tasks={itemList} onDelete={t.handleDelete} canDelete={t.canDelete} onVerify={t.handleVerify} isKepsek={t.isKepsek} />

      <TaskFormModal open={t.showModal} onOpenChange={t.setShowModal} classes={t.classes} onSave={t.handleSave} />
    </div>
  );
}
