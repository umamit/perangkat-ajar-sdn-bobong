'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddLkpdModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: any[];
  form: {
    title: string;
    classId: string;
    tp: string;
    instructions: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    title: string;
    classId: string;
    tp: string;
    instructions: string;
  }>>;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  setSelectedFile: (file: File | null) => void;
}

export function AddLkpdModal({
  isOpen, onClose, classes, form, setForm, saving, onSave, setSelectedFile
}: AddLkpdModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-article-line text-teal-600" /> Buat Lembar Kerja Siswa (LKPD) Baru
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSave} className="space-y-3.5 mt-2">
          <div className="space-y-1 text-xs text-left">
            <Label htmlFor="lkpdTitle" className="font-bold text-slate-600">Judul / Topik LKPD</Label>
            <Input
              id="lkpdTitle"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Contoh: LKPD 1 - My Classroom Objects"
              required
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1 text-xs text-left">
            <Label htmlFor="lkpdClass" className="font-bold text-slate-600">Target Kelas</Label>
            <select
              id="lkpdClass"
              value={form.classId}
              onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 text-xs text-left">
            <Label htmlFor="lkpdTp" className="font-bold text-slate-600">Tujuan Pembelajaran (TP)</Label>
            <textarea
              id="lkpdTp"
              value={form.tp}
              onChange={e => setForm(f => ({ ...f, tp: e.target.value }))}
              placeholder="Tujuan pembelajaran yang ingin dicapai melalui lembar kerja..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
              rows={2}
            />
          </div>
          <div className="space-y-1 text-xs text-left">
            <Label htmlFor="lkpdInstructions" className="font-bold text-slate-600">Petunjuk Aktivitas Murid</Label>
            <textarea
              id="lkpdInstructions"
              value={form.instructions}
              onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
              placeholder="1. Perhatikan gambar berikut...\n2. Jodohkan kata dengan arti yang tepat."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
              rows={3}
              required
            />
          </div>
          <div className="space-y-1 text-xs text-left">
            <Label htmlFor="lkpdFile" className="font-bold text-slate-600">Lampiran Dokumen PDF/Word (Opsional)</Label>
            <Input
              id="lkpdFile"
              type="file"
              accept=".pdf,.docx,.doc,.zip"
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              className="h-10 rounded-xl pt-2"
            />
          </div>
          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-10 text-xs font-bold">
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105"
            >
              {saving ? 'Menyimpan...' : 'Simpan LKPD'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
