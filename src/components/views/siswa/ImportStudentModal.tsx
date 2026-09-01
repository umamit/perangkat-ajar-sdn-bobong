'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImportStudentModalProps {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  classes: any[];
  selectedClass: string;
  onImport: (file: File) => Promise<void>;
}

export function ImportStudentModal({
  isOpen,
  onOpenChange,
  classes,
  selectedClass,
  onImport
}: ImportStudentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-upload-2-line text-primary" /> Impor Langsung Data Siswa
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="bg-cyan-50/70 border border-cyan-200/80 p-4 rounded-2xl text-[11px] space-y-1.5 text-slate-700 backdrop-blur-sm">
            <p className="font-black text-cyan-800 flex items-center gap-1.5">
              <i className="ri-information-line text-sm" /> IMPOR LANGSUNG MASSAL:
            </p>
            <p className="leading-relaxed font-semibold">
              Pilih file Excel (.xlsx, .xls) atau CSV (.csv). Seluruh data siswa akan otomatis langsung dimasukkan ke <strong>Kelas {selectedClass !== 'ALL' ? selectedClass : (classes[0]?.id || '1A')}</strong>.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-200 p-8 text-center rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-300 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl shadow-inner mb-3">
              <i className="ri-file-excel-2-line" />
            </div>
            <p className="text-xs font-black text-slate-700 mb-1">Pilih File Excel / CSV untuk Memulai</p>
            <p className="text-[10px] text-slate-400 font-bold mb-4">Mendukung format kolom Nama, NISN, Kelas, Jenis Kelamin</p>
            <input
              type="file"
              id="directImportFile"
              accept=".xlsx, .xls, .csv"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  onImport(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <Button type="button" onClick={() => document.getElementById('directImportFile')?.click()} className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 px-5">
              Pilih & Impor File
            </Button>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10 text-xs font-bold w-full sm:w-auto">
              Batal
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
