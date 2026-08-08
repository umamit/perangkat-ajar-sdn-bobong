'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Student } from '@/types';

interface GradeAnalysisProps {
  filteredStudents: Student[];
  selectedSubject: string;
  grades: any[];
}

export function GradeAnalysis({ filteredStudents, selectedSubject, grades }: GradeAnalysisProps) {
  // 1. Calculate student averages
  const studentsWithAverages = useMemo(() => {
    return filteredStudents.map(s => {
      const fVal = grades.find(g => g.student_id === s.id && g.subject === selectedSubject && g.type === 'Formatif')?.score || 0;
      const sVal = grades.find(g => g.student_id === s.id && g.subject === selectedSubject && g.type === 'STS')?.score || 0;
      const aVal = grades.find(g => g.student_id === s.id && g.subject === selectedSubject && g.type === 'SAS')?.score || 0;

      // Formula: Formatif 40% + STS 30% + SAS 30%
      const average = Math.round((Number(fVal) * 0.4) + (Number(sVal) * 0.3) + (Number(aVal) * 0.3));

      return {
        id: s.id,
        name: s.name,
        nis: s.nis || '-',
        average,
        fVal: Number(fVal),
        sVal: Number(sVal),
        aVal: Number(aVal)
      };
    });
  }, [filteredStudents, selectedSubject, grades]);

  // 2. Class statistics
  const stats = useMemo(() => {
    if (studentsWithAverages.length === 0) {
      return { average: 0, max: 0, min: 0, passingRate: 0 };
    }

    const scores = studentsWithAverages.map(s => s.average);
    const sum = scores.reduce((a, b) => a + b, 0);
    const average = Math.round(sum / scores.length);
    const max = Math.max(...scores);
    const min = Math.min(...scores);

    const passingCount = studentsWithAverages.filter(s => s.average >= 75).length;
    const passingRate = Math.round((passingCount / studentsWithAverages.length) * 100);

    return { average, max, min, passingRate };
  }, [studentsWithAverages]);

  // 3. Score distribution
  const distribution = useMemo(() => {
    const total = studentsWithAverages.length;
    const categories = {
      sangatBaik: { count: 0, label: '90 - 100 (Sangat Baik)', color: 'bg-primary' },
      baik: { count: 0, label: '80 - 89 (Baik)', color: 'bg-emerald-600' },
      tuntas: { count: 0, label: '75 - 79 (Cukup)', color: 'bg-amber-500' },
      remedial: { count: 0, label: '< 75 (Perlu Bimbingan)', color: 'bg-rose-500' }
    };

    studentsWithAverages.forEach(s => {
      if (s.average >= 90) categories.sangatBaik.count++;
      else if (s.average >= 80) categories.baik.count++;
      else if (s.average >= 75) categories.tuntas.count++;
      else categories.remedial.count++;
    });

    const getPercent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

    return [
      { ...categories.sangatBaik, pct: getPercent(categories.sangatBaik.count) },
      { ...categories.baik, pct: getPercent(categories.baik.count) },
      { ...categories.tuntas, pct: getPercent(categories.tuntas.count) },
      { ...categories.remedial, pct: getPercent(categories.remedial.count) }
    ];
  }, [studentsWithAverages]);

  if (filteredStudents.length === 0) {
    return (
      <div className="text-center text-slate-450 py-12 text-xs font-bold bg-white/70 backdrop-blur-md rounded-2xl border border-slate-100">
        <i className="ri-folder-info-line text-3xl opacity-60 mb-2 block" />
        Pilih rombel kelas terlebih dahulu untuk melihat analisis nilai.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left text-xs text-slate-800">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Rerata Kelas</span>
              <span className="text-2xl font-black text-slate-800 mt-1 block">{stats.average}</span>
            </div>
            <div className="p-2 rounded-xl bg-cyan-50 text-primary">
              <i className="ri-line-chart-line text-base" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Nilai Tertinggi</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.max}</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <i className="ri-arrow-up-circle-line text-base" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Nilai Terendah</span>
              <span className="text-2xl font-black text-rose-600 mt-1 block">{stats.min}</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <i className="ri-arrow-down-circle-line text-base" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Persentase Ketuntasan</span>
              <span className="text-2xl font-black text-amber-500 mt-1 block">{stats.passingRate}%</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
              <i className="ri-shield-check-line text-base" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* 2. Horizontal Distribution Chart */}
        <Card className="md:col-span-5 rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <i className="ri-bar-chart-horizontal-line text-primary" /> Distribusi Nilai Siswa
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Grafik sebaran pencapaian kognitif kelas</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {distribution.map((d, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                  <span>{d.label}</span>
                  <span>{d.count} Siswa ({d.pct}%)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${d.color}`}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 3. Heatmap / Peta Nilai Rapor */}
        <Card className="md:col-span-7 rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <i className="ri-road-map-line text-[#2A9D5C]" /> Peta Ketuntasan Belajar Siswa
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Deteksi cepat visual untuk siswa perlu bimbingan khusus</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[35vh] overflow-y-auto pr-1">
            {studentsWithAverages.map((s, idx) => {
              let colorClasses = 'bg-rose-50 text-rose-700 border-rose-100';
              let desc = 'Perlu Bimbingan';
              if (s.average >= 80) {
                colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                desc = 'Sangat Baik / Baik';
              } else if (s.average >= 75) {
                colorClasses = 'bg-amber-50 text-amber-700 border-amber-100';
                desc = 'Tuntas / Cukup';
              }

              return (
                <div key={s.id} className={`p-2.5 border rounded-xl flex flex-col justify-between gap-1 shadow-sm/5 transition-all hover:scale-[1.01] ${colorClasses}`}>
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-black text-xs truncate max-w-[85%]" title={s.name}>{s.name}</span>
                    <span className="font-black text-xs shrink-0">{s.average}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold opacity-80 mt-1">
                    <span>{s.nis}</span>
                    <span>{desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
