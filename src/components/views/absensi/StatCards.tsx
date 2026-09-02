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
      {/* Hadir Stat Card */}
      <div className="p-4 rounded-apple-lg bg-white/80 backdrop-blur-xl border border-white/90 shadow-xs relative overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">Hadir</span>
          <div className="w-7 h-7 rounded-apple-sm bg-emerald-50/90 text-emerald-600 border border-emerald-100/80 flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-sm" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-black text-slate-800 tracking-tight">{currentHadir}</span>
          <span className="text-xs font-bold text-emerald-600">({pctHadir}%)</span>
        </div>
      </div>

      {/* Izin Stat Card */}
      <div className="p-4 rounded-apple-lg bg-white/80 backdrop-blur-xl border border-white/90 shadow-xs relative overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">Izin</span>
          <div className="w-7 h-7 rounded-apple-sm bg-amber-50/90 text-amber-600 border border-amber-100/80 flex items-center justify-center">
            <i className="ri-file-text-line text-sm" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-black text-slate-800 tracking-tight">{currentIzin}</span>
          <span className="text-xs font-bold text-amber-600">({pctIzin}%)</span>
        </div>
      </div>

      {/* Sakit Stat Card */}
      <div className="p-4 rounded-apple-lg bg-white/80 backdrop-blur-xl border border-white/90 shadow-xs relative overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-orange-700 uppercase tracking-wider block">Sakit</span>
          <div className="w-7 h-7 rounded-apple-sm bg-orange-50/90 text-orange-600 border border-orange-100/80 flex items-center justify-center">
            <i className="ri-heart-pulse-line text-sm" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-black text-slate-800 tracking-tight">{currentSakit}</span>
          <span className="text-xs font-bold text-orange-600">({pctSakit}%)</span>
        </div>
      </div>

      {/* Alpa Stat Card */}
      <div className="p-4 rounded-apple-lg bg-white/80 backdrop-blur-xl border border-white/90 shadow-xs relative overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider block">Alpa</span>
          <div className="w-7 h-7 rounded-apple-sm bg-rose-50/90 text-rose-600 border border-rose-100/80 flex items-center justify-center">
            <i className="ri-close-circle-line text-sm" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-black text-slate-800 tracking-tight">{currentAlpa}</span>
          <span className="text-xs font-bold text-rose-600">({pctAlpa}%)</span>
        </div>
      </div>

      {/* Belum Diisi Stat Card */}
      <div className="p-4 rounded-apple-lg bg-white/80 backdrop-blur-xl border border-white/90 shadow-xs relative overflow-hidden col-span-2 sm:col-span-1 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Belum Diisi</span>
          <div className="w-7 h-7 rounded-apple-sm bg-slate-100/90 text-slate-500 border border-slate-200/80 flex items-center justify-center">
            <i className="ri-user-search-line text-sm" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-black text-slate-800 tracking-tight">{currentUnselected}</span>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase">Siswa</span>
        </div>
      </div>
    </div>
  );
}
