'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeacherAssignedClass } from '@/lib/utils';
import { AttendanceDonutCard } from './AttendanceDonutCard';

export function DashboardCharts() {
  const { students, classes, attendance, currentTeacher } = useApp();

  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);

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
      <AttendanceDonutCard
        lockedClass={lockedClass}
        attRate={attRate}
        sakitRate={sakitRate}
        izinRate={izinRate}
        alpaRate={alpaRate}
        hadirCount={hadirCount}
        sakitCount={sakitCount}
        izinCount={izinCount}
        alpaCount={alpaCount}
      />

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
            <p className="text-xs text-center text-slate-500 font-semibold py-8">Belum ada kelas terdaftar</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
