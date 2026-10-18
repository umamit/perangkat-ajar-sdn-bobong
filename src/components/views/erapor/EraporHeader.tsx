import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassInfo, Student } from "@/types";

interface EraporHeaderProps {
  classes: ClassInfo[];
  lockedClass?: string | null;
  selectedClass: string;
  setSelectedClass: (c: string) => void;
  classStudents: Student[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  downloading: boolean;
  onPrintPDF: () => void;
  onPrevStudent: () => void;
  onNextStudent: () => void;
}

export function EraporHeader({
  classes, lockedClass, selectedClass, setSelectedClass,
  classStudents, selectedStudentId, setSelectedStudentId,
  downloading, onPrintPDF, onPrevStudent, onNextStudent
}: EraporHeaderProps) {
  const currentIdx = classStudents.findIndex(s => s.id === selectedStudentId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            e-Rapor Siswa Kurikulum Merdeka
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Laporan Hasil Belajar Peserta Didik (Standar Panduan Asesmen Kemendikbudristek)
          </p>
        </div>

        <Button
          size="sm"
          disabled={downloading || !selectedStudentId}
          onClick={onPrintPDF}
          className="gap-1.5 rounded-xl font-black text-xs bg-gradient-to-b from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/20 border border-white/30 hover:brightness-105 h-10 px-4"
        >
          <i className="ri-file-pdf-2-line text-base" />
          {downloading ? "Menyiapkan Rapor..." : "Cetak Lembar Rapor PDF"}
        </Button>
      </div>

      <div className="p-4 rounded-2xl border border-white/80 bg-white/75 backdrop-blur-md shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Kelas:</span>
            {lockedClass ? (
              <Badge variant="default" className="text-[11px] font-black px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                Kelas {lockedClass} (Wali Kelas)
              </Badge>
            ) : (
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <span className="text-xs font-bold text-slate-600">Pilih Siswa:</span>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="h-10 min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
            >
              {classStudents.length === 0 ? (
                <option value="">-- Belum ada siswa di kelas ini --</option>
              ) : (
                classStudents.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {idx + 1}. {s.name} ({s.nis || "Tanpa NIS"})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 mr-1">
            {classStudents.length > 0 ? `Siswa ${currentIdx + 1} dari ${classStudents.length}` : "0 Siswa"}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentIdx <= 0}
            onClick={onPrevStudent}
            className="h-9 px-3 rounded-xl text-xs font-bold gap-1"
          >
            <i className="ri-arrow-left-s-line" /> Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentIdx < 0 || currentIdx >= classStudents.length - 1}
            onClick={onNextStudent}
            className="h-9 px-3 rounded-xl text-xs font-bold gap-1"
          >
            Berikutnya <i className="ri-arrow-right-s-line" />
          </Button>
        </div>
      </div>
    </div>
  );
}
