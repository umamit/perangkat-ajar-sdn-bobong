'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LaporanChartsProps {
  averageAttendanceRate: number;
  monthlyAttendanceData: { name: string; pct: number }[];
  selectedClassExplorer: string;
}

export function LaporanCharts({
  averageAttendanceRate,
  monthlyAttendanceData,
  selectedClassExplorer,
}: LaporanChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
            <i className="ri-pie-chart-line text-primary" /> Kehadiran Rata-Rata Sekolah ({averageAttendanceRate}%)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#12A5B8"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * averageAttendanceRate) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <text
              x="50"
              y="-45"
              transform="rotate(90)"
              fill="#1E293B"
              fontSize="12"
              fontWeight="900"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {averageAttendanceRate}%
            </text>
          </svg>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
            <i className="ri-bar-chart-fill text-primary" /> Rasio Kehadiran Bulanan Kelas {selectedClassExplorer}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-[180px] w-full text-[10px] pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyAttendanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontWeight: 'bold', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'Kehadiran']}
                contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '10px', fontWeight: 'bold' }}
                cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
              />
              <Bar dataKey="pct" fill="#12a5b8" radius={[5, 5, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
