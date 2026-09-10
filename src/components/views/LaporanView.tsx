"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { downloadLaporanPDFWithPdfLib } from "@/modules/generatePDFLib";
import { getTeacherAssignedClass } from "@/lib/utils";
import { RekapJurnalSection } from "./laporan/RekapJurnalSection";
import { StudentDetailTable } from "./laporan/StudentDetailTable";
import { LaporanCharts } from "./laporan/LaporanCharts";
import { useLaporanCalculations } from "./laporan/useLaporanCalculations";

export function LaporanView() {
  const { students, classes, journals, attendance, currentTeacher, showToast, grades, schoolSettings } = useApp();
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const isGuruMapel = currentTeacher?.role === "Guru Mata Pelajaran";

  const SUBJECTS = ["Matematika", "Bahasa Indonesia", "IPAS", "Pendidikan Pancasila", "Seni Budaya", "PJOK", "Pendidikan Agama Islam", "Pendidikan Agama Kristen", "Bahasa Inggris", "Muatan Lokal"];
  const getDefaultSubject = () => {
    const r = (currentTeacher?.subject || "").toLowerCase();
    if (r.includes("bahasa inggris")) return "Bahasa Inggris";
    if (r.includes("pjok")) return "PJOK";
    if (r.includes("kristen")) return "Pendidikan Agama Kristen";
    if (r.includes("agama")) return "Pendidikan Agama Islam";
    return "Matematika";
  };

  const [selectedSubject, setSelectedSubject] = useState(getDefaultSubject());
  const [selectedClassExplorer, setSelectedClassExplorer] = useState(lockedClass || "1A");

  const calc = useLaporanCalculations({ students, classes, journals, attendance, currentTeacher, grades, schoolSettings, selectedSubject, selectedClassExplorer });

  const handleDownloadPDF = async () => {
    try {
      showToast("Memproses & Mengunduh Berkas PDF...", "info");
      await downloadLaporanPDFWithPdfLib({
        totalStudents: calc.filteredStudents.length, totalClasses: calc.filteredClasses.length,
        totalJournals: journals.length, totalAttendance: calc.filteredAttendance.length,
        teacherName: currentTeacher?.name, teacherNip: currentTeacher?.nip, teacherRole: currentTeacher?.role,
        classStats: calc.classStats, studentDetails: calc.studentDetails, selectedClassName: selectedClassExplorer,
        monthlyAttendanceData: calc.monthlyAttendanceData, schoolSettings
      });
      showToast("Berkas PDF Laporan berhasil diunduh!", "success");
    } catch { showToast("Gagal membuat berkas PDF", "error"); }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Laporan Rekapitulasi & Administrasi Kelas</h3>
          <p className="text-xs text-slate-500 font-semibold">Ringkasan serta grafik performa rombel sekolah</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-black bg-rose-50/80 text-rose-700 border border-rose-200/60 hover:bg-rose-100/80 rounded-xl gap-1.5">
          <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Detail
        </Button>
      </div>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Subjek Nilai:</span>
            {isGuruMapel ? (
              <Badge variant="default" className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">{selectedSubject}</Badge>
            ) : (
              <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Detail Kelas Explorer:</span>
            {lockedClass ? (
              <Badge variant="default" className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">Kelas {lockedClass}</Badge>
            ) : (
              <select value={selectedClassExplorer} onChange={e => setSelectedClassExplorer(e.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </div>
        </div>
      </Card>

      <LaporanCharts averageAttendanceRate={calc.averageAttendanceRate} monthlyAttendanceData={calc.monthlyAttendanceData} selectedClassExplorer={selectedClassExplorer} />

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
            <i className="ri-table-line text-primary" /> Rincian Siswa Rombel {selectedClassExplorer}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <StudentDetailTable students={calc.studentDetails} subjectName={selectedSubject} />
        </CardContent>
      </Card>

      {calc.isKepsek && <RekapJurnalSection />}
    </div>
  );
}
