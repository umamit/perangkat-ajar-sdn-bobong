'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AttendanceDonutCardProps {
  lockedClass?: string | null;
  attRate: number;
  sakitRate: number;
  izinRate: number;
  alpaRate: number;
  hadirCount: number;
  sakitCount: number;
  izinCount: number;
  alpaCount: number;
}

export function AttendanceDonutCard({
  lockedClass,
  attRate,
  sakitRate,
  izinRate,
  alpaRate,
  hadirCount,
  sakitCount,
  izinCount,
  alpaCount,
}: AttendanceDonutCardProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attRate / 100) * circumference;

  return (
    <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100/50 bg-white/35">
        <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
          <i className="ri-pie-chart-2-line text-primary" />
          <span>Rasio Kehadiran Kelas {lockedClass ? `(${lockedClass})` : 'Sekolah'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
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

        <div className="flex-1 w-full space-y-3.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span>Hadir ({hadirCount}x)</span>
            </div>
            <Badge variant="secondary" className="font-extrabold text-[10px] bg-cyan-50 text-primary-dark border border-cyan-200/80">{attRate}%</Badge>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Izin ({izinCount}x)</span>
            </div>
            <Badge variant="secondary" className="font-extrabold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80">{izinRate}%</Badge>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Sakit ({sakitCount}x)</span>
            </div>
            <Badge variant="secondary" className="font-extrabold text-[10px] bg-amber-50 text-amber-700 border border-amber-200/80">{sakitRate}%</Badge>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Alpa ({alpaCount}x)</span>
            </div>
            <Badge variant="secondary" className="font-extrabold text-[10px] bg-rose-50 text-rose-700 border border-rose-200/80">{alpaRate}%</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
