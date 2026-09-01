'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FlashcardForm {
  word: string;
  translate: string;
  category: string;
  example: string;
  phase: string;
}

interface FlashcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiMode: boolean;
  setAiMode: (val: boolean) => void;
  aiTopic: string;
  setAiTopic: (val: string) => void;
  generating: boolean;
  onAiGenerate: () => void;
  form: FlashcardForm;
  setForm: (updater: (prev: FlashcardForm) => FlashcardForm) => void;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  subjectLabel?: string;
}

export function FlashcardDialog({
  open, onOpenChange, aiMode, setAiMode, aiTopic, setAiTopic,
  generating, onAiGenerate, form, setForm, saving, onSave, subjectLabel
}: FlashcardDialogProps) {
  const isEnglish = (subjectLabel || '').toLowerCase().includes('inggris');
  const wordPlaceholder = isEnglish ? "Contoh: Classroom atau Lay-up Shoot" : "Contoh: Tawadhu, Fotosintesis, atau Dribbling";
  const meaningPlaceholder = isEnglish ? "Contoh: Ruang Kelas atau Tembakan melayang" : "Contoh: Sikap rendah hati, Fotosintesis tanaman, dll.";
  const topicPlaceholder = isEnglish ? "Contoh: Peralatan makan, Benda kelas, Tubuh manusia" : "Contoh: Rukun Islam, Sistem pencernaan, Gerak lokomotor";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-book-open-line text-primary" /> Tambah Kartu Kosakata (Flashcard)
          </DialogTitle>
          <div className="flex gap-1.5 border-b border-slate-100 pb-2 mt-2">
            <button type="button" onClick={() => setAiMode(false)}
              className={`text-xs font-black pb-1.5 px-3 border-b-2 transition-all ${!aiMode ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
              Input Manual
            </button>
            <button type="button" onClick={() => setAiMode(true)}
              className={`text-xs font-black pb-1.5 px-3 border-b-2 transition-all ${aiMode ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
              Buat dengan AI
            </button>
          </div>
        </DialogHeader>

        {aiMode ? (
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="aiTopic" className="font-bold text-slate-600">Topik Kosakata / Tema</Label>
              <Input id="aiTopic" value={aiTopic} onChange={e => setAiTopic(e.target.value)}
                placeholder={topicPlaceholder} required className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="aiPhase" className="font-bold text-slate-655">Fase / Tingkat</Label>
              <select id="aiPhase" value={form.phase} onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20">
                <option value="Fase A">Fase A (Kelas 1 &amp; 2)</option>
                <option value="Fase B">Fase B (Kelas 3 &amp; 4)</option>
                <option value="Fase C">Fase C (Kelas 5 &amp; 6)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-3 text-xs">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10 text-xs font-bold">Batal</Button>
              <Button type="button" onClick={onAiGenerate} disabled={generating}
                className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 gap-1.5 shadow-md shadow-primary/10">
                {generating ? 'Menyusun...' : 'Generate 5 Kartu'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSave} className="space-y-4 mt-4">
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="flashcardWord" className="font-bold text-slate-600">Kata / Istilah ({subjectLabel || 'Mata Pelajaran'})</Label>
              <Input id="flashcardWord" value={form.word} onChange={e => setForm(f => ({ ...f, word: e.target.value }))}
                placeholder={wordPlaceholder} required className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="flashcardTranslate" className="font-bold text-slate-600">Terjemahan / Arti</Label>
              <Input id="flashcardTranslate" value={form.translate} onChange={e => setForm(f => ({ ...f, translate: e.target.value }))}
                placeholder={meaningPlaceholder} required className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="flashcardCategory" className="font-bold text-slate-600">Kategori Kosakata</Label>
              <Input id="flashcardCategory" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="Contoh: School & Classroom, Teknik Dasar, dll." required className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="flashcardPhase" className="font-bold text-slate-655">Fase / Tingkat</Label>
              <select id="flashcardPhase" value={form.phase} onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20">
                <option value="Fase A">Fase A (Kelas 1 &amp; 2)</option>
                <option value="Fase B">Fase B (Kelas 3 &amp; 4)</option>
                <option value="Fase C">Fase C (Kelas 5 &amp; 6)</option>
              </select>
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="flashcardExample" className="font-bold text-slate-600">Contoh Penggunaan / Kalimat</Label>
              <Input id="flashcardExample" value={form.example} onChange={e => setForm(f => ({ ...f, example: e.target.value }))}
                placeholder="Contoh kalimat penjelas..." className="h-10 rounded-xl" />
            </div>
            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10 text-xs font-bold">Batal</Button>
              <Button type="submit" disabled={saving}
                className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
                {saving ? 'Menyimpan...' : 'Simpan Kartu'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
