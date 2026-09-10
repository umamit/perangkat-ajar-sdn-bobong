import React from "react";
import { Card } from "@/components/ui/card";

export function GradeSummaryCards({ stats }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Rerata Kelas</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{stats.average}</span>
          </div>
          <div className="p-2 rounded-xl bg-cyan-50 text-primary"><i className="ri-line-chart-line text-base" /></div>
        </div>
      </Card>
      <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Nilai Tertinggi</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.max}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><i className="ri-arrow-up-circle-line text-base" /></div>
        </div>
      </Card>
      <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Nilai Terendah</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">{stats.min}</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600"><i className="ri-arrow-down-circle-line text-base" /></div>
        </div>
      </Card>
      <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Persentase Ketuntasan</span>
            <span className="text-2xl font-black text-amber-500 mt-1 block">{stats.passingRate}%</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-500"><i className="ri-shield-check-line text-base" /></div>
        </div>
      </Card>
    </div>
  );
}
