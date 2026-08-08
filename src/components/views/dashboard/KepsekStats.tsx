'use client';

import React, { useMemo } from 'react';
import { Teacher, Student, ClassInfo, JournalEntry, AttendanceRecord } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface KepsekStatsProps {
  teachers: Teacher[];
  students: Student[];
  classes: ClassInfo[];
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
}

export function KepsekStats({ teachers, students, classes, journals, attendance }: KepsekStatsProps) {
  // --- Summary stats ---
  const totalActiveTeachers = teachers.filter(t => t.nip !== '199610272019032006').length;
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalJournals = journals.length;

  const summaryCards = [
    { label: 'Guru Aktif', value: totalActiveTeachers, icon: 'ri-user-star-line', color: 'text-primary bg-cyan-50' },
    { label: 'Total Siswa', value: totalStudents, icon: 'ri-group-line', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Rombel Kelas', value: totalClasses, icon: 'ri-community-line', color: 'text-amber-500 bg-amber-50' },
    { label: 'Jurnal Tercatat', value: totalJournals, icon: 'ri-book-read-line', color: 'text-violet-600 bg-violet-50' },
  ];

  // --- Journal progress per teacher ---
  const journalByTeacher = useMemo(() => {
    const activeTeachers = teachers.filter(t => t.nip !== '199610272019032006');
    const maxJournals = Math.max(1, ...activeTeachers.map(t => journals.filter(j => j.teacherNip === t.nip).length));
    return activeTeachers.map(t => {
      const count = journals.filter(j => j.teacherNip === t.nip).length;
      return { name: t.name, role: t.role || '-', count, pct: Math.round((count / maxJournals) * 100) };
    }).sort((a, b) => b.count - a.count);
  }, [teachers, journals]);

  // --- Students per class ---
  const studentsByClass = useMemo(() => {
    const maxCount = Math.max(1, ...classes.map(c => students.filter(s => s.classId === c.id || s.classId?.toUpperCase() === c.id?.toUpperCase()).length));
    return classes.map(c => {
      const count = students.filter(s => (s.classId || '').toUpperCase() === c.id.toUpperCase()).length;
      return { name: c.name, count, pct: Math.round((count / maxCount) * 100) };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [classes, students]);

  // --- Attendance rate per class ---
  const attendanceByClass = useMemo(() => {
    return classes.map(c => {
      const classRecords = attendance.filter(a => (a.classId || a.class_id || '').toUpperCase() === c.id.toUpperCase());
      const hadirCount = classRecords.filter(a => a.status === 'Hadir').length;
      const pct = classRecords.length > 0 ? Math.round((hadirCount / classRecords.length) * 100) : 0;
      return { name: c.name, pct, total: classRecords.length };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [classes, attendance]);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-primary/10">
          <i className="ri-pie-chart-2-line text-lg text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 tracking-tight">Statistik Sekolah — Pandangan Kepala Sekolah</h3>
          <p className="text-[10px] text-slate-400 font-semibold">Rekap real-time seluruh aktivitas guru dan kelas</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map((card, i) => (
          <Card key={i} className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">{card.label}</span>
                <span className="text-2xl font-black text-slate-800 mt-1 block">{card.value}</span>
              </div>
              <div className={`p-2 rounded-xl ${card.color}`}>
                <i className={`${card.icon} text-base`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Journal Progress per Teacher */}
        <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <i className="ri-book-2-line text-primary" /> Progres Jurnal Per Guru
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Jumlah entri jurnal yang tercatat per guru</p>
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {journalByTeacher.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4 font-semibold">Belum ada data guru</p>
            )}
            {journalByTeacher.map((t, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                  <span className="truncate max-w-[70%]" title={t.name}>{t.name}</span>
                  <span>{t.count} jurnal</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${t.pct}%` }} />
                </div>
                <p className="text-[9px] text-slate-400 font-semibold">{t.role}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Students per Class */}
        <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <i className="ri-community-line text-emerald-600" /> Distribusi Siswa Per Kelas
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Jumlah siswa yang terdaftar di setiap rombel</p>
          </div>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {studentsByClass.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                  <span>{c.name}</span>
                  <span>{c.count} siswa</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Attendance per Class */}
      <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <i className="ri-checkbox-circle-line text-amber-500" /> Tingkat Kehadiran Per Kelas
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Persentase kehadiran kumulatif dari semua data absensi</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {attendanceByClass.filter(c => c.total > 0).map((c, i) => {
            const colorClass = c.pct >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
              : c.pct >= 60 ? 'text-amber-600 bg-amber-50 border-amber-100'
              : 'text-rose-600 bg-rose-50 border-rose-100';
            return (
              <div key={i} className={`p-3 rounded-xl border text-center ${colorClass}`}>
                <div className="text-lg font-black">{c.pct}%</div>
                <div className="text-[9px] font-bold mt-0.5 opacity-80">{c.name}</div>
                <div className="text-[8px] opacity-60">{c.total} sesi</div>
              </div>
            );
          })}
          {attendanceByClass.every(c => c.total === 0) && (
            <div className="col-span-full text-center text-xs text-slate-400 font-semibold py-4">
              Belum ada data absensi tercatat
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
