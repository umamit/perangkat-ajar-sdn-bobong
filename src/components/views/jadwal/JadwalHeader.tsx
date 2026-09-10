'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface JadwalHeaderProps {
  isKepsek: boolean;
  lockedClass: string | null;
  selectedClass: string;
  printing: boolean;
  hasSchedules: boolean;
  onPrint: () => void;
  onAdd: () => void;
}

export function JadwalHeader({
  isKepsek,
  lockedClass,
  selectedClass,
  printing,
  hasSchedules,
  onPrint,
  onAdd,
}: JadwalHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <i className="ri-calendar-2-line text-primary" />
          Jadwal Pelajaran
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          {isKepsek ? 'Lihat jadwal pelajaran semua kelas' : `Jadwal mengajar kelas ${lockedClass || selectedClass}`}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          disabled={printing || !hasSchedules}
          className="text-xs font-black bg-rose-50/80 backdrop-blur-sm text-rose-700 border border-rose-200/60 hover:bg-rose-100/80 shadow-xs gap-1.5 rounded-xl"
        >
          {printing ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-printer-line text-rose-600" />}
          Cetak PDF
        </Button>
        <Button
          size="sm"
          onClick={onAdd}
          className="text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 gap-1.5 rounded-xl"
        >
          <i className="ri-add-line text-sm" /> Tambah Slot
        </Button>
      </div>
    </div>
  );
}
