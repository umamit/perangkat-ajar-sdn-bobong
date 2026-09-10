import React from "react";
import { Card } from "@/components/ui/card";

export function GradeDistributionHeatmap({ distribution, studentsWithAverages }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
      <Card className="md:col-span-5 rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <i className="ri-bar-chart-horizontal-line text-primary" /> Distribusi Nilai Siswa
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Grafik sebaran pencapaian kognitif kelas</p>
        </div>
        <div className="space-y-3.5 pt-2">
          {distribution.map((d: any, idx: number) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span>{d.label}</span>
                <span>{d.count} Siswa ({d.pct}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={"h-full rounded-full transition-all duration-1000 " + d.color} style={{ width: d.pct + "%" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="md:col-span-7 rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <i className="ri-road-map-line text-[#2A9D5C]" /> Peta Ketuntasan Belajar Siswa
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Deteksi visual untuk siswa perlu bimbingan khusus</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[35vh] overflow-y-auto pr-1">
          {studentsWithAverages.map((s: any) => {
            let color = "bg-rose-50 text-rose-700 border-rose-100", desc = "Perlu Bimbingan";
            if (s.average >= 80) { color = "bg-emerald-50 text-emerald-700 border-emerald-100"; desc = "Sangat Baik / Baik"; }
            else if (s.average >= 75) { color = "bg-amber-50 text-amber-700 border-amber-100"; desc = "Tuntas / Cukup"; }
            return (
              <div key={s.id} className={"p-2.5 border rounded-xl flex flex-col justify-between gap-1 shadow-sm/5 transition-all hover:scale-[1.01] " + color}>
                <div className="flex justify-between items-start gap-1">
                  <span className="font-black text-xs truncate max-w-[85%]" title={s.name}>{s.name}</span>
                  <span className="font-black text-xs shrink-0">{s.average}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold opacity-80 mt-1">
                  <span>{s.nis}</span>
                  <span>{desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
