import React from 'react';

interface StatCardsProps {
  currentHadir: number;
  pctHadir: number;
  currentIzin: number;
  pctIzin: number;
  currentSakit: number;
  pctSakit: number;
  currentAlpa: number;
  pctAlpa: number;
  currentUnselected: number;
}

export function StatCards({
  currentHadir, pctHadir, currentIzin, pctIzin,
  currentSakit, pctSakit, currentAlpa, pctAlpa, currentUnselected
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
        <span className="text-[11px] font-bold text-emerald-700 uppercase block">Hadir</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-xl font-black text-emerald-900">{currentHadir}</span>
          <span className="text-xs font-bold text-emerald-700">({pctHadir}%)</span>
        </div>
      </div>
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
        <span className="text-[11px] font-bold text-amber-700 uppercase block">Izin</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-xl font-black text-amber-900">{currentIzin}</span>
          <span className="text-xs font-bold text-amber-700">({pctIzin}%)</span>
        </div>
      </div>
      <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200">
        <span className="text-[11px] font-bold text-orange-700 uppercase block">Sakit</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-xl font-black text-orange-900">{currentSakit}</span>
          <span className="text-xs font-bold text-orange-700">({pctSakit}%)</span>
        </div>
      </div>
      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
        <span className="text-[11px] font-bold text-rose-700 uppercase block">Alpa</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-xl font-black text-rose-900">{currentAlpa}</span>
          <span className="text-xs font-bold text-rose-700">({pctAlpa}%)</span>
        </div>
      </div>
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 col-span-2 sm:col-span-1">
        <span className="text-[11px] font-bold text-slate-500 uppercase block">Belum Diisi</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-xl font-black text-slate-700">{currentUnselected}</span>
          <span className="text-xs font-bold text-slate-500">Siswa</span>
        </div>
      </div>
    </div>
  );
}
