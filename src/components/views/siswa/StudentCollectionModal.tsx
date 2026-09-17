'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface StudentCollectionModalProps {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  classes: any[];
  students: any[];
  normalizeClass: (c: string) => string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function StudentCollectionModal({
  isOpen,
  onOpenChange,
  classes,
  students,
  normalizeClass,
  showToast,
}: StudentCollectionModalProps) {
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '1A');

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const collectionUrl = `${origin}/unggah-siswa?kelas=${selectedClass}`;

  const studentCount = students.filter(
    (s) => normalizeClass(s.classId) === normalizeClass(selectedClass)
  ).length;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(collectionUrl);
      showToast(`Tautan Kelas ${selectedClass} berhasil disalin!`, 'success');
    }
  };

  const handleCopyWhatsapp = () => {
    const text = `*PEMBERITAHUAN PEMBARUAN DATA SISWA KELAS ${selectedClass}*\nSD NEGERI BOBONG\n\nKepada Bapak/Ibu Wali Kelas ${selectedClass}, mohon untuk memperbarui/mengunggah data siswa tahun ajaran baru melalui tautan berikut:\n${collectionUrl}\n\nTerima kasih atas kerja samanya.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`Pesan WhatsApp untuk Kelas ${selectedClass} berhasil disalin!`, 'success');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-share-forward-line text-primary" /> Pengumpulan Data Siswa Per Kelas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 text-xs text-slate-700 space-y-1">
            <p className="font-black text-cyan-900 flex items-center gap-1.5">
              <i className="ri-information-line text-sm" /> Tautan Publik Khusus Wali Kelas
            </p>
            <p className="font-semibold text-slate-600">
              Wali kelas dapat mengunggah daftar siswa baru (via Excel/CSV) secara mandiri dari HP/Laptop tanpa perlu login ke sistem.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Pilih Kelas Target:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
            >
              {classes.map((c) => {
                const count = students.filter(
                  (s) => normalizeClass(s.classId) === normalizeClass(c.id)
                ).length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} (Saat ini: {count} Siswa)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block">Tautan Khusus:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={collectionUrl}
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 select-all outline-none"
              />
              <Button size="sm" onClick={handleCopyLink} className="h-8 rounded-lg text-xs font-bold bg-primary text-white shrink-0">
                Salin
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs">
              <span className="text-slate-500">Jumlah data sekarang: </span>
              <span className="font-bold text-slate-800">{studentCount} Siswa</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyWhatsapp}
                className="text-xs font-black bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 rounded-xl gap-1.5"
              >
                <i className="ri-whatsapp-line text-emerald-600 text-sm" /> Salin Teks WA
              </Button>
              <a
                href={collectionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-black bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <i className="ri-external-link-line text-sm" /> Buka
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
