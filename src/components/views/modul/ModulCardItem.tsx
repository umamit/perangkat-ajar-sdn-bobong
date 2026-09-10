import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ModulCardItem({ m, classes, teachers, currentTeacher, handleDelete, handleDownloadPDF }: any) {
  const isOwner = currentTeacher?.nip === "199610272019032006" || currentTeacher?.nip === (m.teacherNip || m.teacher_nip);
  return (
    <Card className="rounded-2xl border border-white/85 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/20">
      <CardHeader className="pb-2 bg-white/35 border-b border-slate-100/50">
        <div className="flex justify-between items-center">
          <Badge variant="default" className="font-black text-[10px] rounded-lg px-2.5 py-0.5">
            {classes.find((c: any) => c.id === (m.classId || m.class_id))?.name || m.grade || m.phase || "Fase A"}
          </Badge>
          <div className="flex items-center gap-1.5">
            {isOwner && (
              <button onClick={() => m.id && handleDelete(m.id)} className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors" title="Hapus Modul">
                <i className="ri-delete-bin-line text-sm" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <i className="ri-file-text-line text-base" />
            </div>
          </div>
        </div>
        <CardTitle className="text-sm font-extrabold text-slate-800 mt-3 line-clamp-1">{m.title}</CardTitle>
        {currentTeacher?.nip === "199610272019032006" && (
          <div className="text-[10px] font-black text-primary mt-1 flex items-center gap-1">
            <i className="ri-user-line text-[10px]" />
            <span>Oleh: {teachers.find((t: any) => t.nip === (m.teacherNip || m.teacher_nip))?.name || ("Guru (NIP: " + (m.teacherNip || m.teacher_nip) + ")")}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4 text-xs pt-4">
        <div className="space-y-1">
          <span className="font-black text-slate-400 text-[10px] uppercase tracking-wider block">Tujuan Pembelajaran (TP):</span>
          <p className="text-slate-600 font-semibold line-clamp-2 leading-relaxed">{m.tp || "Mengidentifikasi kosakata dasar"}</p>
        </div>
        <div className="space-y-1">
          <span className="font-black text-slate-400 text-[10px] uppercase tracking-wider block">Alur Tujuan Pembelajaran (ATP):</span>
          <p className="text-slate-600 font-semibold line-clamp-2 leading-relaxed">{m.atp || "Menyimak, menirukan, dan merespon instruksi sederhana"}</p>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 font-bold">
          <span className="text-slate-500 text-[10px] font-black uppercase">Waktu: {m.duration || "2 x 35 Menit"}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(m)} className="h-8 rounded-lg text-[10px] font-black text-rose-700 border-rose-300 hover:bg-rose-50/50 gap-1">
              <i className="ri-file-pdf-2-line text-rose-600" /> PDF
            </Button>
            {(m.file_url || m.fileUrl) && (
              <Button variant="outline" size="sm" onClick={() => window.open(m.file_url || m.fileUrl, "_blank")} className="h-8 rounded-lg text-[10px] font-black text-emerald-700 border-emerald-200 hover:bg-emerald-50/50 gap-1">
                <i className="ri-file-download-line text-emerald-600" /> Berkas
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
