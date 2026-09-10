import React from "react";
import { Card } from "@/components/ui/card";

export function TeacherActivityChecklistCard({ teacherActivityToday }: any) {
  return (
    <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4 animate-fade-in">
      <div>
        <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
          <i className="ri-todo-line text-primary" /> Checklist Keaktifan Guru Hari Ini
        </h4>
        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Status pengisian presensi kelas & jurnal mengajar hari ini</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-56 overflow-y-auto pr-1">
        {teacherActivityToday.map((t: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-colors">
            <div className="truncate max-w-[60%]">
              <p className="text-[11px] font-black text-slate-700 truncate" title={t.name}>{t.name}</p>
              <p className="text-[9px] text-slate-400 font-semibold truncate" title={t.role}>{t.role || "Guru Mata Pelajaran"}</p>
            </div>
            <div className="flex gap-1.5 text-[9px] font-black">
              {t.isWali && (
                <span className={"px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 " + (t.attendanceFilled ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100")}>
                  <i className={t.attendanceFilled ? "ri-checkbox-circle-fill text-[10px]" : "ri-close-circle-fill text-[10px]"} /> Presensi
                </span>
              )}
              <span className={"px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 " + (t.journalFilled ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100")}>
                <i className={t.journalFilled ? "ri-checkbox-circle-fill text-[10px]" : "ri-close-circle-fill text-[10px]"} /> Jurnal
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
