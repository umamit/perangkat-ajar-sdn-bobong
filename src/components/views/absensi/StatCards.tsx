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
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-emerald-100 hover:scale-[1.02]">
        <div className="absolute right-2.5 top-2 text-emerald-300/30 text-3xl font-black pointer-events-none">
          <i className="ri-checkbox-circle-line" />
        </div>
        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">Hadir</span>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-2xl font-black text-emerald-950">{currentHadir}</span>
          <span className="text-xs font-bold text-emerald-700">({pctHadir}%)</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-amber-100 hover:scale-[1.02]">
        <div className="absolute right-2.5 top-2 text-amber-300/30 text-3xl font-black pointer-events-none">
          <i className="ri-file-text-line" />
        </div>
        <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">Izin</span>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-2xl font-black text-amber-950">{currentIzin}</span>
          <span className="text-xs font-bold text-amber-700">({pctIzin}%)</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-orange-100 hover:scale-[1.02]">
        <div className="absolute right-2.5 top-2 text-orange-300/30 text-3xl font-black pointer-events-none">
          <i className="ri-heart-pulse-line" />
        </div>
        <span className="text-[10px] font-black text-orange-700 uppercase tracking-wider block">Sakit</span>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-2xl font-black text-orange-950">{currentSakit}</span>
          <span className="text-xs font-bold text-orange-700">({pctSakit}%)</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-rose-100 hover:scale-[1.02]">
        <div className="absolute right-2.5 top-2 text-rose-300/30 text-3xl font-black pointer-events-none">
          <i className="ri-close-circle-line" />
        </div>
        <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider block">Alpa</span>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-2xl font-black text-rose-950">{currentAlpa}</span>
          <span className="text-xs font-bold text-rose-700">({pctAlpa}%)</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/80 shadow-sm relative overflow-hidden col-span-2 sm:col-span-1 transition-all duration-300 hover:shadow-slate-200/50 hover:scale-[1.02]">
        <div className="absolute right-2.5 top-2 text-slate-400/30 text-3xl font-black pointer-events-none">
          <i className="ri-user-search-line" />
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Belum Diisi</span>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-2xl font-black text-slate-800">{currentUnselected}</span>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase">Siswa</span>
        </div>
      </div>
    </div>
  );
}
