"use client";

import React, { useMemo } from "react";
import { Student } from "@/types";
import { GradeSummaryCards } from "./GradeSummaryCards";
import { GradeDistributionHeatmap } from "./GradeDistributionHeatmap";

interface GradeAnalysisProps {
  filteredStudents: Student[];
  selectedSubject: string;
  grades: any[];
}

export function GradeAnalysis({ filteredStudents, selectedSubject, grades }: GradeAnalysisProps) {
  const studentsWithAverages = useMemo(() => {
    return filteredStudents.map(s => {
      const fVal = grades.find(g => g.student_id === s.id && g.subject === selectedSubject && g.type === "Formatif")?.score || 0;
      const sVal = grades.find(g => g.student_id === s.id && g.subject === selectedSubject && g.type === "STS")?.score || 0;
      const aVal = grades.find(g => g.student_id === s.id && g.subject === selectedSubject && g.type === "SAS")?.score || 0;
      const average = Math.round((Number(fVal) * 0.4) + (Number(sVal) * 0.3) + (Number(aVal) * 0.3));
      return { id: s.id, name: s.name, nis: s.nis || "-", average, fVal: Number(fVal), sVal: Number(sVal), aVal: Number(aVal) };
    });
  }, [filteredStudents, selectedSubject, grades]);

  const stats = useMemo(() => {
    if (studentsWithAverages.length === 0) return { average: 0, max: 0, min: 0, passingRate: 0 };
    const scores = studentsWithAverages.map(s => s.average);
    const sum = scores.reduce((a, b) => a + b, 0);
    const passing = studentsWithAverages.filter(s => s.average >= 75).length;
    return {
      average: Math.round(sum / scores.length), max: Math.max(...scores), min: Math.min(...scores),
      passingRate: Math.round((passing / studentsWithAverages.length) * 100)
    };
  }, [studentsWithAverages]);

  const distribution = useMemo(() => {
    const total = studentsWithAverages.length;
    const cats = {
      sangatBaik: { count: 0, label: "90 - 100 (Sangat Baik)", color: "bg-primary" },
      baik: { count: 0, label: "80 - 89 (Baik)", color: "bg-emerald-600" },
      tuntas: { count: 0, label: "75 - 79 (Cukup)", color: "bg-amber-500" },
      remedial: { count: 0, label: "< 75 (Perlu Bimbingan)", color: "bg-rose-500" }
    };
    studentsWithAverages.forEach(s => {
      if (s.average >= 90) cats.sangatBaik.count++;
      else if (s.average >= 80) cats.baik.count++;
      else if (s.average >= 75) cats.tuntas.count++;
      else cats.remedial.count++;
    });
    const getPct = (cnt: number) => total > 0 ? Math.round((cnt / total) * 100) : 0;
    return [
      { ...cats.sangatBaik, pct: getPct(cats.sangatBaik.count) },
      { ...cats.baik, pct: getPct(cats.baik.count) },
      { ...cats.tuntas, pct: getPct(cats.tuntas.count) },
      { ...cats.remedial, pct: getPct(cats.remedial.count) }
    ];
  }, [studentsWithAverages]);

  if (filteredStudents.length === 0) {
    return (
      <div className="text-center text-slate-500 py-12 text-xs font-bold bg-white/70 backdrop-blur-md rounded-2xl border border-slate-100">
        <i className="ri-folder-info-line text-3xl opacity-60 mb-2 block" />
        Pilih rombel kelas terlebih dahulu untuk melihat analisis nilai.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left text-xs text-slate-800">
      <GradeSummaryCards stats={stats} />
      <GradeDistributionHeatmap distribution={distribution} studentsWithAverages={studentsWithAverages} />
    </div>
  );
}
