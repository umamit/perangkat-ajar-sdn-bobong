'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Journal } from '@/types';
import { saveJournalToSupabase } from '@/lib/supabase';

interface AddJournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: Array<{ id: string; name: string }>;
  currentTeacher: any;
  onSuccess: (newJournal: Journal) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function AddJournalModal({
  open,
  onOpenChange,
  classes,
  currentTeacher,
  onSuccess,
  showToast,
}: AddJournalModalProps) {
  const [saving, setSaving] = useState(false);
  const [beautifying, setBeautifying] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '07.30 - 08.40',
    classId: classes[0]?.id || '1A',
    topic: '',
    notes: '',
    attendance: 'Hadir Seluruh Siswa'
  });

  const handleBeautifyNotes = async () => {
    if (!form.notes.trim()) {
      showToast('Ketik draf catatan guru terlebih dahulu', 'error');
      return;
    }
    setBeautifying(true);
    try {
      const res = await fetch('/api/ai/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: form.notes,
          mode: 'sempurnakan_jurnal',
          grade: `Kelas ${form.classId}`,
          subject: currentTeacher?.subject || 'Bahasa Inggris'
        }),
      });

      const data = await res.json();
      if (data.result) {
        setForm(f => ({ ...f, notes: data.result }));
        showToast('Catatan jurnal berhasil disempurnakan!', 'success');
      } else if (data.fallbackResponse) {
        setForm(f => ({ ...f, notes: data.fallbackResponse }));
        showToast('Menampilkan draf bawaan (API Key belum diaktifkan)', 'info');
      } else {
        showToast(data.error || 'Gagal menyempurnakan catatan', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi', 'error');
    } finally {
      setBeautifying(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      showToast('Topik pembelajaran wajib diisi', 'error');
      return;
    }

    setSaving(true);
    try {
      const newJournal: Journal = {
        id: crypto.randomUUID(),
        date: form.date,
        time: form.time,
        classId: form.classId,
        topic: form.topic.trim(),
        notes: form.notes.trim(),
        attendance: form.attendance,
        teacherNip: currentTeacher?.nip
      };

      const success = await saveJournalToSupabase(newJournal);
      if (success) {
        onSuccess(newJournal);
        showToast(`Jurnal kelas ${form.classId} berhasil disimpan ke Supabase Cloud`, 'success');
        onOpenChange(false);
        setForm({
          date: new Date().toISOString().split('T')[0],
          time: '07.30 - 08.40',
          classId: classes[0]?.id || '1A',
          topic: '',
          notes: '',
          attendance: 'Hadir Seluruh Siswa'
        });
      } else {
        showToast('Gagal menyimpan jurnal ke cloud', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-white p-5 rounded-2xl shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-book-mark-line text-primary" /> Tambah Jurnal Mengajar Harian
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-1.5 text-xs text-left">
            <Label htmlFor="jurnalDate" className="font-bold text-slate-600">Tanggal Mengajar</Label>
            <Input
              id="jurnalDate"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              required
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5 text-xs text-left">
            <Label htmlFor="jurnalClass" className="font-bold text-slate-600">Kelas</Label>
            <select
              id="jurnalClass"
              value={form.classId}
              onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 h-10"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 text-xs text-left">
            <Label htmlFor="jurnalTopic" className="font-bold text-slate-600">Materi / Topik Pembelajaran</Label>
            <Input
              id="jurnalTopic"
              value={form.topic}
              onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
              placeholder="Contoh: Unit 2 - Family Members"
              required
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5 text-xs text-left">
            <div className="flex justify-between items-center mb-0.5">
              <Label htmlFor="jurnalNotes" className="font-bold text-slate-600">Catatan / Refleksi Guru</Label>
              <button
                type="button"
                onClick={handleBeautifyNotes}
                disabled={beautifying}
                className="text-[9px] text-primary hover:bg-cyan-50/50 font-black flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 transition-all active:scale-95 shadow-2xs cursor-pointer"
              >
                {beautifying ? 'Memproses...' : <><i className="ri-magic-line text-amber-500" /> Perbaiki dengan AI</>}
              </button>
            </div>
            <textarea
              id="jurnalNotes"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Catatan perkembangan atau kendala pembelajaran..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
            />
          </div>
          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10 text-xs font-bold">
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
              {saving ? 'Menyimpan...' : 'Simpan Jurnal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
