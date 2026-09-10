"use client";

import React, { useMemo } from "react";
import { Teacher, Student, ClassInfo, JournalEntry, AttendanceRecord } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { TeacherActivityChecklistCard } from "./TeacherActivityChecklistCard";
import { KepsekCharts } from "./KepsekCharts";

interface KepsekStatsProps {
  teachers: Teacher[];
  students: Student[];
  classes: ClassInfo[];
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  grades?: any[];
}

export function KepsekStats({ teachers, students, classes, journals, attendance, grades = [] }: KepsekStatsProps) {
  const summaryCards = [
    { label: "Guru Aktif", value: teachers.filter(t => t.nip !== "199610272019032006").length, icon: "ri-user-star-line", color: "text-primary bg-cyan-50" },
    { label: "Total Siswa", value: students.length, icon: "ri-group-line", color: "text-emerald-600 bg-emerald-50" },
    { label: "Rombel Kelas", value: classes.length, icon: "ri-community-line", color: "text-amber-500 bg-amber-50" },
    { label: "Jurnal Tercatat", value: journals.length, icon: "ri-book-read-line", color: "text-violet-600 bg-violet-50" },
  ];

  const teacherActivityToday = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return teachers.filter(t => t.nip !== "199610272019032006").map(t => {
      const journalFilled = journals.some(j => j.date === todayStr && j.teacherNip === t.nip);
      const match = t.role?.match(/Wali Kelas\s+([1-6][A-B]?)/i);
      const isWali = !!match;
      const classId = match ? match[1] : null;
      let attendanceFilled = false;
      if (isWali && classId) {
        const cStudents = students.filter(s => s.classId === classId);
        const tAtt = attendance.filter(a => a.date === todayStr);
        attendanceFilled = cStudents.length > 0 && cStudents.every(s => tAtt.some(a => a.student_id === s.id || a.studentId === s.id));
      }
      return { name: t.name, role: t.role, isWali, journalFilled, attendanceFilled };
    });
  }, [teachers, journals, students, attendance]);

  const classAverages = useMemo(() => {
    return classes.map(c => {
      const ids = students.filter(s => s.classId === c.id).map(s => s.id);
      const cGrades = grades.filter(g => ids.includes(g.student_id || g.studentId));
      const sum = cGrades.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
      return { name: c.name, avg: cGrades.length > 0 ? Number((sum / cGrades.length).toFixed(1)) : 0 };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [classes, students, grades]);

  const journalByTeacher = useMemo(() => {
    const active = teachers.filter(t => t.nip !== "199610272019032006");
    const max = Math.max(1, ...active.map(t => journals.filter(j => j.teacherNip === t.nip).length));
    return active.map(t => {
      const count = journals.filter(j => j.teacherNip === t.nip).length;
      return { name: t.name, count, pct: Math.round((count / max) * 100) };
    }).sort((a, b) => b.count - a.count);
  }, [teachers, journals]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-primary/10"><i className="ri-pie-chart-2-line text-lg text-primary" /></div>
        <div>
          <h3 className="text-sm font-black text-slate-800 tracking-tight">Statistik Sekolah — Pandangan Kepala Sekolah</h3>
          <p className="text-[10px] text-slate-400 font-semibold">Rekap real-time seluruh aktivitas guru dan kelas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map((card, i) => (
          <Card key={i} className="rounded-2xl border border-slate-100 bg-white shadow-sm animate-fade-in">
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">{card.label}</span>
                <span className="text-2xl font-black text-slate-800 mt-1 block">{card.value}</span>
              </div>
              <div className={"p-2 rounded-xl " + card.color}><i className={card.icon + " text-base"} /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TeacherActivityChecklistCard teacherActivityToday={teacherActivityToday} />
      <KepsekCharts classAverages={classAverages} journalByTeacher={journalByTeacher} />
    </div>
  );
}
