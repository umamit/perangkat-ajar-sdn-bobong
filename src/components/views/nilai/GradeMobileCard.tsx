import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function GradeMobileCard({ s, idx, formatif, sts, sas, finalGrade, onGradeChange, onOpenAiDialog }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex gap-2.5 items-center">
          <span className="text-xs font-bold text-slate-400 bg-slate-50 w-5 h-5 rounded-full flex items-center justify-center">{idx + 1}</span>
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{s.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-500 font-bold">NIS: {s.nis || "-"}</span>
              <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Kelas {s.classId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Formatif</span>
          <Input type="number" min={0} max={100} value={formatif} onChange={e => onGradeChange(s.id, "Formatif", parseInt(e.target.value))} className="w-full text-center h-8 text-xs font-black rounded-lg focus:ring-primary/20 bg-white" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">STS</span>
          <Input type="number" min={0} max={100} value={sts} onChange={e => onGradeChange(s.id, "STS", parseInt(e.target.value))} className="w-full text-center h-8 text-xs font-black rounded-lg focus:ring-primary/20 bg-white" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">SAS</span>
          <Input type="number" min={0} max={100} value={sas} onChange={e => onGradeChange(s.id, "SAS", parseInt(e.target.value))} className="w-full text-center h-8 text-xs font-black rounded-lg focus:ring-primary/20 bg-white" />
        </div>
      </div>

      <div className="flex justify-between items-center pt-1 border-t border-slate-100/60 mt-1">
        <Badge variant={finalGrade >= 75 ? "success" : "warning"} className="text-[10px] font-black rounded-lg px-2.5 py-1">
          Akhir: {finalGrade} {finalGrade >= 75 ? "(Tuntas)" : "(Bimbingan)"}
        </Badge>
        <Button size="sm" variant="outline" onClick={() => onOpenAiDialog({ open: true, studentName: s.name, studentClass: s.classId, score: finalGrade })} className="h-8 px-3 text-[10px] font-extrabold text-primary border-primary/20 hover:bg-cyan-50/50 rounded-lg gap-1">
          <i className="ri-magic-line" /> AI Deskripsi
        </Button>
      </div>
    </div>
  );
}
