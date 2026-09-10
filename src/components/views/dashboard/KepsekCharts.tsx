import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function KepsekCharts({ classAverages, journalByTeacher }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4 animate-fade-in">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <i className="ri-graduation-cap-line text-cyan-600" /> Rerata Nilai Rapor Kelas
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Grafik rata-rata nilai seluruh siswa per kelas</p>
        </div>
        <div className="p-2 h-[150px] w-full text-[10px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classAverages} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontWeight: "bold", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: any) => [`${value} Poin`, "Rata-rata Nilai"]} contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "10px", fontWeight: "bold" }} cursor={{ fill: "#f1f5f9", opacity: 0.4 }} />
              <Bar dataKey="avg" fill="#12a5b8" radius={[5, 5, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4 animate-fade-in">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <i className="ri-book-2-line text-primary" /> Progres Jurnal Per Guru
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Jumlah entri jurnal yang tercatat per guru</p>
        </div>
        <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
          {journalByTeacher.length === 0 && <p className="text-xs text-slate-400 text-center py-4 font-semibold">Belum ada data guru</p>}
          {journalByTeacher.map((t: any, i: number) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span className="truncate max-w-[70%]" title={t.name}>{t.name}</span>
                <span>{t.count} jurnal</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${t.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
