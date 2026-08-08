'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTeacherAssignedClass } from '@/lib/utils';

export function DashboardCharts() {
  const { students, classes, attendance, currentTeacher } = useApp();

  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);

  // 1. Attendance Calculations
  const relevantAttendance = lockedClass
    ? attendance.filter(a => {
        const sId = a.student_id || a.studentId;
        const student = students.find(s => s.id === sId);
        return student?.classId === lockedClass;
      })
    : attendance;

  const totalAtt = relevantAttendance.length;
  const hadirCount = relevantAttendance.filter(a => a.status === 'Hadir').length;
  const sakitCount = relevantAttendance.filter(a => a.status === 'Sakit').length;
  const izinCount = relevantAttendance.filter(a => a.status === 'Izin').length;
  const alpaCount = relevantAttendance.filter(a => a.status === 'Alpa').length;

  const attRate = totalAtt > 0 ? Math.round((hadirCount / totalAtt) * 100) : 0;
  const sakitRate = totalAtt > 0 ? Math.round((sakitCount / totalAtt) * 100) : 0;
  const izinRate = totalAtt > 0 ? Math.round((izinCount / totalAtt) * 100) : 0;
  const alpaRate = totalAtt > 0 ? Math.round((alpaCount / totalAtt) * 100) : 0;

  // SVG Circular Dash Calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attRate / 100) * circumference;

  // 2. Class Student Distribution Calculations
  const classData = classes.map(c => {
    const count = students.filter(s => {
      const studentClassNorm = (s.classId || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const classNorm = (c.id || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      return studentClassNorm === classNorm || s.classId === c.id;
    }).length;
    return { name: c.name, count };
  });

  const maxCount = Math.max(...classData.map(d => d.count), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Chart 1: Donut Attendance Ring */}
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100/50 bg-white/35">
          <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
            <i className="ri-pie-chart-2-line text-primary" />
            <span>Rasio Kehadiran Kelas {lockedClass ? `(${lockedClass})` : 'Sekolah'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* SVG Progress Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#E2E8F0"
                strokeWidth="8"
              />
              {/* Progress Bar */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#12A5B8"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-800 tracking-tighter">{attRate}%</span>
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Hadir</span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="flex-1 w-full space-y-3.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>Hadir ({hadirCount}x)</span>
              </div>
              <Badge variant="secondary" className="font-extrabold text-[10px] bg-cyan-50 text-primary-dark border border-cyan-150">{attRate}%</Badge>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Izin ({izinCount}x)</span>
              </div>
              <Badge variant="secondary" className="font-extrabold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150">{izinRate}%</Badge>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Sakit ({sakitCount}x)</span>
              </div>
              <Badge variant="secondary" className="font-extrabold text-[10px] bg-amber-50 text-amber-700 border border-amber-150">{sakitRate}%</Badge>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Alpa ({alpaCount}x)</span>
              </div>
              <Badge variant="secondary" className="font-extrabold text-[10px] bg-rose-50 text-rose-700 border border-rose-150">{alpaRate}%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Student Distribution horizontal bars */}
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100/50 bg-white/35">
          <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
            <i className="ri-bar-chart-horizontal-line text-emerald-600" />
            <span>Rasio Kepadatan Kelas (Jumlah Siswa)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3.5 max-h-[160px] overflow-y-auto custom-scrollbar">
          {classData.map((cls, idx) => {
            const percentage = Math.round((cls.count / maxCount) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800 font-extrabold">{cls.name}</span>
                  <span className="text-slate-500">{cls.count} Siswa</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-primary rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
          {classData.length === 0 && (
            <p className="text-xs text-center text-slate-450 font-semibold py-8">Belum ada kelas terdaftar</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
