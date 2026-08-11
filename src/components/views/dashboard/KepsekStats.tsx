'use client';

import React, { useMemo } from 'react';
import { Teacher, Student, ClassInfo, JournalEntry, AttendanceRecord } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface KepsekStatsProps {
  teachers: Teacher[];
  students: Student[];
  classes: ClassInfo[];
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  grades?: any[];
}

export function KepsekStats({ teachers, students, classes, journals, attendance, grades = [] }: KepsekStatsProps) {
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

  // --- Daily Activity Checklist for Teachers ---
  const teacherActivityToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    return teachers.filter(t => t.nip !== '199610272019032006').map(t => {
      const journalFilled = journals.some(j => j.date === todayStr && j.teacherNip === t.nip);
      
      const match = t.role?.match(/Wali Kelas\s+([1-6][A-B]?)/i);
      const isWali = !!match;
      const classId = match ? match[1] : null;
      
      let attendanceFilled = false;
      if (isWali && classId) {
        const classStudents = students.filter(s => s.classId === classId);
        const todayAttendance = attendance.filter(a => a.date === todayStr);
        attendanceFilled = classStudents.length > 0 && classStudents.every(s => 
          todayAttendance.some(a => (a.student_id === s.id || a.studentId === s.id))
        );
      }
      
      return {
        name: t.name,
        role: t.role,
        isWali,
        journalFilled,
        attendanceFilled
      };
    });
  }, [teachers, journals, students, attendance]);

  // --- Class Averages for grades ---
  const classAverages = useMemo(() => {
    return classes.map(c => {
      const classStudents = students.filter(s => s.classId === c.id);
      const classStudentIds = classStudents.map(s => s.id);
      const classGrades = grades.filter(g => classStudentIds.includes(g.student_id || g.studentId));
      const sum = classGrades.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
      const avg = classGrades.length > 0 ? Number((sum / classGrades.length).toFixed(1)) : 0;
      return { name: c.name, avg };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [classes, students, grades]);

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
          <Card key={i} className="rounded-2xl border border-slate-100 bg-white shadow-sm animate-fade-in">
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

      {/* Teacher Checklist Card */}
      <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4 animate-fade-in">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <i className="ri-todo-line text-primary" /> Checklist Keaktifan Guru Hari Ini
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Status pengisian presensi kelas &amp; jurnal mengajar hari ini</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-56 overflow-y-auto pr-1">
          {teacherActivityToday.map((t, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-colors">
              <div className="truncate max-w-[60%]">
                <p className="text-[11px] font-black text-slate-700 truncate" title={t.name}>{t.name}</p>
                <p className="text-[9px] text-slate-400 font-semibold truncate" title={t.role}>{t.role || 'Guru Mata Pelajaran'}</p>
              </div>
              <div className="flex gap-1.5 text-[9px] font-black">
                {t.isWali && (
                  <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${t.attendanceFilled ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    <i className={t.attendanceFilled ? 'ri-checkbox-circle-fill text-[10px]' : 'ri-close-circle-fill text-[10px]'} /> Presensi
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${t.journalFilled ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  <i className={t.journalFilled ? 'ri-checkbox-circle-fill text-[10px]' : 'ri-close-circle-fill text-[10px]'} /> Jurnal
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Class Averages Bar Chart */}
        <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4 animate-fade-in">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <i className="ri-graduation-cap-line text-cyan-600" /> Rerata Nilai Rapor Kelas
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Grafik rata-rata nilai seluruh siswa per kelas</p>
          </div>
          <div className="p-2 h-[150px] w-full text-[10px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classAverages} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontWeight: 'bold', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value} Poin`, 'Rata-rata Nilai']}
                  contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '10px', fontWeight: 'bold' }}
                  cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                />
                <Bar dataKey="avg" fill="#12a5b8" radius={[5, 5, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Journal Progress per Teacher */}
        <Card className="rounded-[24px] border border-slate-100 bg-white shadow-sm p-5 space-y-4 animate-fade-in">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <i className="ri-book-2-line text-primary" /> Progres Jurnal Per Guru
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Jumlah entri jurnal yang tercatat per guru</p>
          </div>
          <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
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
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
