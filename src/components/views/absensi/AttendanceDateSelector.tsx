'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AttendanceDateSelectorProps {
  selectedClass: string;
  setSelectedClass: (c: string) => void;
  lockedClass?: string | null;
  classes: any[];
  date: string;
  setDate: (d: string) => void;
  onSave: () => void;
  onClassChangeReset: () => void;
}

export function AttendanceDateSelector({
  selectedClass,
  setSelectedClass,
  lockedClass,
  classes,
  date,
  setDate,
  onSave,
  onClassChangeReset,
}: AttendanceDateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
          Pilih Kelas:
        </label>
        {lockedClass ? (
          <div className="h-9 flex items-center">
            <Badge variant="default" className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              Kelas {lockedClass} (Binaan)
            </Badge>
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedClass}
              onChange={e => {
                setSelectedClass(e.target.value);
                onClassChangeReset();
              }}
              className="w-full h-9 rounded-apple-md border border-slate-200/80 bg-white/70 backdrop-blur-md px-3 pr-8 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer shadow-xs transition-all"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-base" />
          </div>
        )}
      </div>
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
          Tanggal Presensi:
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex items-end">
        <Button
          onClick={onSave}
          className="w-full h-9 text-xs font-black rounded-xl bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 gap-1"
        >
          <i className="ri-save-line text-sm" /> Simpan Presensi Hari Ini
        </Button>
      </div>
    </div>
  );
}
