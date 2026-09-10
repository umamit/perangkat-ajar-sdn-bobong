'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Journal } from '@/types';

interface TimetableItem {
  day: string;
  time: string;
  classId: string;
  topic: string;
}

interface DashboardTimetableProps {
  timetable: TimetableItem[];
  journals: Journal[];
  onViewAllJournals: () => void;
}

export function DashboardTimetable({
  timetable,
  journals,
  onViewAllJournals,
}: DashboardTimetableProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Jadwal Mengajar Harian */}
      <Card className="glass-panel overflow-hidden border border-white/80 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 bg-white/30 border-b border-slate-100/40">
          <CardTitle className="text-sm font-extrabold flex items-center gap-3 text-slate-800">
            <div className="w-8.5 h-8.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <i className="ri-calendar-check-line text-base" />
            </div>
            <span>Jadwal Mengajar Harian</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card List */}
          <div className="block md:hidden p-3.5 space-y-2.5">
            {timetable.map((row, idx) => (
              <div key={idx} className="p-3 bg-white/80 rounded-xl border border-slate-100 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <i className="ri-calendar-line text-primary" /> {row.day}
                  </span>
                  <Badge variant="default" className="font-black text-[10px] px-2 py-0.5 rounded-md">
                    {row.classId}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                  <i className="ri-time-line text-xs text-slate-400" />
                  <span>{row.time}</span>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-snug pt-0.5">{row.topic}</p>
              </div>
            ))}
            {timetable.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                Belum ada jadwal mengajar
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                  <TableHead className="w-20 font-black text-[10px] uppercase text-slate-400 tracking-wider">Hari</TableHead>
                  <TableHead className="w-32 font-black text-[10px] uppercase text-slate-400 tracking-wider">Waktu</TableHead>
                  <TableHead className="w-20 font-black text-[10px] uppercase text-slate-400 tracking-wider text-center">Kelas</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Materi Utama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-white/40 transition-colors border-slate-100">
                    <TableCell className="font-extrabold text-xs text-slate-800">{row.day}</TableCell>
                    <TableCell className="text-xs text-slate-500 font-semibold whitespace-nowrap">{row.time}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="font-black text-[10px] px-2 py-0.5 rounded-md">{row.classId}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700 min-w-[220px] whitespace-normal leading-snug">
                      {row.topic}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Jurnal Mengajar Terbaru */}
      <Card className="glass-panel overflow-hidden border border-white/80 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 bg-white/30 border-b border-slate-100/40">
          <CardTitle className="text-sm font-extrabold flex items-center gap-3 text-slate-800">
            <div className="w-8.5 h-8.5 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
              <i className="ri-book-read-line text-base" />
            </div>
            <span>Jurnal Mengajar Terbaru</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAllJournals} className="text-xs font-black text-primary hover:bg-cyan-50/50 rounded-lg">
            Lihat Semua
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card List */}
          <div className="block md:hidden p-3.5 space-y-2.5">
            {journals.slice(0, 5).map((j, idx) => (
              <div key={idx} className="p-3 bg-white/80 rounded-xl border border-slate-100 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <i className="ri-calendar-check-line text-emerald-600" /> {j.date}
                  </span>
                  <Badge variant="secondary" className="font-black text-[10px] px-2 py-0.5 rounded-md">
                    {j.classId}
                  </Badge>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-snug pt-0.5">{j.topic}</p>
              </div>
            ))}
            {journals.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                Belum ada entri jurnal tersimpan
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                  <TableHead className="w-28 font-black text-[10px] uppercase text-slate-400 tracking-wider">Tanggal</TableHead>
                  <TableHead className="w-20 font-black text-[10px] uppercase text-slate-400 tracking-wider text-center">Kelas</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Topik / Pembelajaran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journals.slice(0, 5).map((j, idx) => (
                  <TableRow key={idx} className="hover:bg-white/40 transition-colors border-slate-100">
                    <TableCell className="font-extrabold text-xs text-slate-800 whitespace-nowrap">{j.date}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-black text-[10px] px-2 py-0.5 rounded-md">{j.classId}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700 min-w-[220px] whitespace-normal leading-snug">
                      {j.topic}
                    </TableCell>
                  </TableRow>
                ))}
                {journals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-400 py-8 text-xs font-semibold">
                      Belum ada entri jurnal tersimpan di Supabase
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
