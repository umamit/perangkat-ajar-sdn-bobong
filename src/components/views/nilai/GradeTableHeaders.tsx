import React from 'react';

export function GradeTableHeaders() {
  return (
    <thead>
      {/* Level 1 Header */}
      <tr className="bg-slate-100 text-slate-700 text-xs font-bold border-b border-slate-200">
        <th rowSpan={3} className="sticky left-0 z-20 bg-slate-100 px-3 py-2 border-r border-slate-200 w-12 text-center">No</th>
        <th rowSpan={3} className="sticky left-12 z-20 bg-slate-100 px-3 py-2 border-r border-slate-200 min-w-[180px] text-left">Nama Siswa</th>
        <th colSpan={14} className="px-3 py-1.5 border-r border-slate-200 text-center bg-sky-50 text-sky-900">Penilaian Formatif</th>
        <th colSpan={5} className="px-3 py-1.5 border-r border-slate-200 text-center bg-emerald-50 text-emerald-900">Sumatif</th>
        <th rowSpan={3} className="px-3 py-2 border-r border-slate-200 text-center w-20 bg-amber-50/50">Rata-Rata</th>
        <th rowSpan={3} className="px-3 py-2 border-r border-slate-200 text-center w-16">UH</th>
        <th rowSpan={3} className="px-3 py-2 border-r border-slate-200 text-center w-16">STS</th>
        <th rowSpan={3} className="px-3 py-2 border-r border-slate-200 text-center w-16">SAS</th>
        <th rowSpan={3} className="px-3 py-2 text-center w-20 bg-primary/10 text-primary font-black">Nilai Akhir</th>
      </tr>

      {/* Level 2 Header: Lingkup Materi */}
      <tr className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
        <th colSpan={3} className="px-1 py-1 border-r border-slate-200 text-center bg-sky-50/60">L. Materi 1</th>
        <th colSpan={3} className="px-1 py-1 border-r border-slate-200 text-center bg-sky-50/60">L. Materi 2</th>
        <th colSpan={3} className="px-1 py-1 border-r border-slate-200 text-center bg-sky-50/60">L. Materi 3</th>
        <th colSpan={2} className="px-1 py-1 border-r border-slate-200 text-center bg-sky-50/60">L. Materi 4</th>
        <th colSpan={3} className="px-1 py-1 border-r border-slate-200 text-center bg-sky-50/60">L. Materi 5</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-14 bg-emerald-50/60">LM 1</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-14 bg-emerald-50/60">LM 2</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-14 bg-emerald-50/60">LM 3</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-14 bg-emerald-50/60">LM 4</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-14 bg-emerald-50/60">LM 5</th>
      </tr>

      {/* Level 3 Header: Tujuan Pembelajaran (TP) */}
      <tr className="bg-white text-slate-500 text-[10px] font-bold border-b border-slate-200">
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP1</th>
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP2</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-12">TP3</th>
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP1</th>
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP2</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-12">TP3</th>
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP1</th>
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP2</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-12">TP3</th>
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP1</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-12">TP2</th>
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP1</th>
        <th className="px-1 py-1 border-r border-slate-100 text-center w-12">TP2</th>
        <th className="px-1 py-1 border-r border-slate-200 text-center w-12">TP3</th>
        <th className="border-r border-slate-200 bg-emerald-50/30"></th>
        <th className="border-r border-slate-200 bg-emerald-50/30"></th>
        <th className="border-r border-slate-200 bg-emerald-50/30"></th>
        <th className="border-r border-slate-200 bg-emerald-50/30"></th>
        <th className="border-r border-slate-200 bg-emerald-50/30"></th>
      </tr>
    </thead>
  );
}
