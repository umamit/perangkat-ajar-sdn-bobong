"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { downloadRekapJurnalPDF, RekapJournalItem } from "@/modules/generateRekapJurnalPDF";
import { RekapJurnalFilters } from "./RekapJurnalFilters";

export function RekapJurnalSection() {
  const { journals, teachers, showToast } = useApp();
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();

  const [selectedMonth, setSelectedMonth] = useState(String(currentMonthIdx + 1));
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [selectedTeacherNip, setSelectedTeacherNip] = useState("ALL");
  const [printing, setPrinting] = useState(false);

  const months = [
    { value: "1", label: "Januari" }, { value: "2", label: "Februari" }, { value: "3", label: "Maret" },
    { value: "4", label: "April" }, { value: "5", label: "Mei" }, { value: "6", label: "Juni" },
    { value: "7", label: "Juli" }, { value: "8", label: "Agustus" }, { value: "9", label: "September" },
    { value: "10", label: "Oktober" }, { value: "11", label: "November" }, { value: "12", label: "Desember" }
  ];
  const years = [String(currentYear - 1), String(currentYear), String(currentYear + 1)];

  const handleCetakPDF = async () => {
    setPrinting(true);
    try {
      const filtered = journals.filter(j => {
        if (!j.date) return false;
        const d = new Date(j.date);
        return d.getMonth() + 1 === Number(selectedMonth) && d.getFullYear() === Number(selectedYear) && (selectedTeacherNip === "ALL" || j.teacherNip === selectedTeacherNip);
      });
      if (filtered.length === 0) { showToast("Tidak ada data jurnal pada periode yang dipilih.", "error"); setPrinting(false); return; }
      const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
      const rekapItems: RekapJournalItem[] = sorted.map(j => {
        const t = teachers.find(teach => teach.nip === j.teacherNip);
        let fDate = j.date;
        try { fDate = new Date(j.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" }); } catch {}
        return { date: fDate, teacherName: t?.name || "Guru Mata Pelajaran", classId: "Kelas " + j.classId, topic: j.topic, notes: j.notes };
      });
      const mLabel = months.find(m => m.value === selectedMonth)?.label || "";
      const tName = selectedTeacherNip === "ALL" ? undefined : teachers.find(t => t.nip === selectedTeacherNip)?.name;
      showToast("Menghasilkan berkas rekapitulasi...", "info");
      await downloadRekapJurnalPDF({ journals: rekapItems, periodStr: mLabel + " " + selectedYear, filterTeacherName: tName });
      showToast("Rekapitulasi Jurnal Berhasil Diunduh!", "success");
    } catch { showToast("Gagal menghasilkan rekapitulasi PDF.", "error"); }
    finally { setPrinting(false); }
  };

  return (
    <Card className="rounded-[24px] border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden text-left text-xs">
      <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
        <CardTitle className="text-base font-black text-slate-800 flex items-center gap-2">
          <i className="ri-file-pdf-2-line text-[#2A9D5C]" /> Cetak Rekap Jurnal Mengajar Guru
        </CardTitle>
        <p className="text-[10px] text-slate-455 font-bold">Fasilitas administrasi Kepala Sekolah untuk mengunduh kompilasi jurnal guru.</p>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <RekapJurnalFilters selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedTeacherNip={selectedTeacherNip} setSelectedTeacherNip={setSelectedTeacherNip} months={months} years={years} teachers={teachers} />
        <div className="pt-2">
          <Button onClick={handleCetakPDF} disabled={printing} className="w-full sm:w-auto px-6 rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 flex items-center gap-2">
            {printing ? "Memproses PDF..." : <><i className="ri-printer-line text-sm" /> Unduh Rekap Jurnal Harian (PDF)</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
