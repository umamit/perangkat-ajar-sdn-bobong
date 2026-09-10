'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ModulFormFieldsProps {
  classes: any[];
  form: {
    title: string;
    classId: string;
    duration: string;
    tp: string;
    cp: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    title: string;
    classId: string;
    duration: string;
    tp: string;
    cp: string;
  }>>;
  setSelectedFile: (file: File | null) => void;
}

export function ModulFormFields({
  classes,
  form,
  setForm,
  setSelectedFile,
}: ModulFormFieldsProps) {
  return (
    <>
      <div className="space-y-1.5 text-xs text-left">
        <Label htmlFor="modulTitle" className="font-bold text-slate-600">Judul Modul / Topik</Label>
        <Input
          id="modulTitle"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Contoh: Unit 3 - My Family"
          required
          className="h-10 rounded-xl"
        />
      </div>
      <div className="space-y-1.5 text-xs text-left">
        <Label htmlFor="modulClass" className="font-bold text-slate-600">Target Kelas</Label>
        <select
          id="modulClass"
          value={form.classId}
          onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20"
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5 text-xs text-left">
        <Label htmlFor="modulDuration" className="font-bold text-slate-600">Alokasi Waktu</Label>
        <Input
          id="modulDuration"
          value={form.duration}
          onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
          required
          className="h-10 rounded-xl"
        />
      </div>
      <div className="space-y-1.5 text-xs text-left">
        <Label htmlFor="modulTarget" className="font-bold text-slate-600">Tujuan Pembelajaran (TP)</Label>
        <textarea
          id="modulTarget"
          value={form.tp}
          onChange={e => setForm(f => ({ ...f, tp: e.target.value }))}
          placeholder="Tujuan pembelajaran yang ingin dicapai..."
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
          rows={2}
          required
        />
      </div>
      <div className="space-y-1.5 text-xs text-left">
        <Label htmlFor="modulCP" className="font-bold text-slate-600">Capaian Pembelajaran (CP)</Label>
        <textarea
          id="modulCP"
          value={form.cp}
          onChange={e => setForm(f => ({ ...f, cp: e.target.value }))}
          placeholder="Ringkasan CP / instruksi materi..."
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
          rows={2}
          required
        />
      </div>
      <div className="space-y-1.5 text-xs text-left">
        <Label htmlFor="modulFile" className="font-bold text-slate-600">Unggah Berkas Asli (PDF/Word/Zip) - Opsional</Label>
        <Input
          id="modulFile"
          type="file"
          accept=".pdf,.docx,.doc,.zip"
          onChange={e => setSelectedFile(e.target.files?.[0] || null)}
          className="h-10 rounded-xl pt-2"
        />
      </div>
    </>
  );
}
