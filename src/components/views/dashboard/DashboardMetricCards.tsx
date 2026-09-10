import React from "react";

export function DashboardMetricCards({ totalStudents, totalClasses, totalModules, totalJournals, lockedClass }: any) {
  const metrics = [
    { label: "Total Siswa", val: totalStudents, icon: "ri-user-smile-line", color: "text-primary bg-cyan-50/80 border-cyan-100", subL: "Terverifikasi", subR: "SDN Bobong" },
    { label: "Kelas Binaan", val: totalClasses, icon: "ri-building-4-line", color: "text-emerald-600 bg-emerald-50/80 border-emerald-100", subL: lockedClass ? ("Kelas " + lockedClass) : "Fase A, B & C", subR: totalClasses + " Rombel" },
    { label: "Modul Ajar SD", val: totalModules, icon: "ri-file-paper-2-line", color: "text-amber-600 bg-amber-50/80 border-amber-100", subL: "Kurikulum Merdeka", subR: "Lengkap" },
    { label: "Jurnal Terisi", val: totalJournals, icon: "ri-book-mark-line", color: "text-rose-600 bg-rose-50/80 border-rose-100", subL: "Catatan Harian", subR: "Aktif" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2">
      {metrics.map((m, i) => (
        <div key={i} className="glass-card group relative p-6 overflow-hidden rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{m.label}</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{m.val}</h3>
            </div>
            <div className={"w-12 h-12 rounded-xl border flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300 " + m.color}>
              <i className={m.icon} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-extrabold text-slate-500">
            <span>{m.subL}</span>
            <span className="text-emerald-600">{m.subR}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
