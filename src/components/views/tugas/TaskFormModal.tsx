import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClassInfo } from "@/types";
import { TaskFileInputField } from "./TaskFileInputField";

interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: ClassInfo[];
  onSave: (data: {
    title: string; classId: string; type: string; dueDate: string; description: string; file: File | null;
  }) => Promise<boolean>;
}

export function TaskFormModal({ open, onOpenChange, classes, onSave }: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id || "1A");
  const [type, setType] = useState("Formatif");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setTitle(""); setClassId(classes[0]?.id || "1A"); setType("Formatif");
    setDueDate(new Date().toISOString().split("T")[0]); setDescription(""); setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSaving(true);
    const success = await onSave({ title, classId, type, dueDate, description, file: selectedFile });
    setSaving(false);
    if (success) { resetForm(); onOpenChange(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-task-line text-primary" /> Tambah Penugasan & Bank Soal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          <div className="space-y-1.5 text-xs text-left">
            <Label htmlFor="taskTitle" className="font-bold text-slate-600">Judul Penugasan / Soal</Label>
            <Input id="taskTitle" value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Asesmen Sumatif Bab 3 Grammar" required className="h-10 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="taskClass" className="font-bold text-slate-600">Target Kelas</Label>
              <select id="taskClass" value={classId} onChange={e => setClassId(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="taskType" className="font-bold text-slate-600">Jenis Soal</Label>
              <select id="taskType" value={type} onChange={e => setType(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20">
                <option value="Formatif">Formatif (LM)</option>
                <option value="Sumatif">Sumatif (STS/SAS)</option>
                <option value="Proyek">Proyek P5</option>
                <option value="Latihan">Latihan Mandiri</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-left">
            <Label htmlFor="taskDueDate" className="font-bold text-slate-600">Tenggat Waktu</Label>
            <Input id="taskDueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="h-10 rounded-xl" />
          </div>

          <TaskFileInputField selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

          <div className="space-y-1.5 text-xs text-left">
            <Label htmlFor="taskDesc" className="font-bold text-slate-600">Instruksi / Deskripsi Soal</Label>
            <textarea id="taskDesc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Tuliskan petunjuk pengerjaan tugas..." rows={3} required className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed" />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10 text-xs font-bold">Batal</Button>
            <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
              {saving ? "Menyimpan..." : "Simpan Penugasan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
