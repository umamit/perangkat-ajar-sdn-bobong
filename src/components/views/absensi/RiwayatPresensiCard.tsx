'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RiwayatPresensiCardProps {
  attendance: Array<{
    date: string;
    classId: string;
    hadir?: number;
    izin?: number;
    sakit?: number;
    alpa?: number;
  }>;
}

export function RiwayatPresensiCard({ attendance }: RiwayatPresensiCardProps) {
  return (
    <Card className="rounded-apple-lg border border-white/90 bg-white/80 backdrop-blur-xl shadow-xs overflow-hidden text-slate-800">
      <CardHeader className="pb-3 bg-transparent">
        <CardTitle className="text-sm font-extrabold flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-apple-md bg-primary/10 text-primary flex items-center justify-center border border-primary/20 backdrop-blur-xs">
            <i className="ri-history-line text-base" />
          </div>
          <span>Riwayat Presensi Harian</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card List (Mobile-First) */}
        <div className="block md:hidden p-3.5 space-y-3">
          {attendance.map((r, idx) => (
            <div
              key={idx}
              className="p-3 bg-white/90 rounded-2xl border border-slate-100 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <i className="ri-calendar-line text-primary" /> {r.date}
                </span>
                <Badge
                  variant="default"
                  className="font-black text-[10px] rounded-apple-sm px-2.5 py-0.5 bg-cyan-50/80 text-primary-dark border border-cyan-200/60"
                >
                  Kelas {r.classId}
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-1.5 bg-emerald-50/80 border border-emerald-200/60 rounded-xl">
                  <span className="block text-slate-500 font-bold uppercase text-[9px]">Hadir</span>
                  <span className="font-black text-emerald-700 text-sm">{r.hadir || 0}</span>
                </div>
                <div className="p-1.5 bg-amber-50/80 border border-amber-200/60 rounded-xl">
                  <span className="block text-slate-500 font-bold uppercase text-[9px]">Izin</span>
                  <span className="font-black text-amber-700 text-sm">{r.izin || 0}</span>
                </div>
                <div className="p-1.5 bg-orange-50/80 border border-orange-200/60 rounded-xl">
                  <span className="block text-slate-500 font-bold uppercase text-[9px]">Sakit</span>
                  <span className="font-black text-orange-700 text-sm">{r.sakit || 0}</span>
                </div>
                <div className="p-1.5 bg-rose-50/80 border border-rose-200/60 rounded-xl">
                  <span className="block text-slate-500 font-bold uppercase text-[9px]">Alpa</span>
                  <span className="font-black text-rose-700 text-sm">{r.alpa || 0}</span>
                </div>
              </div>
            </div>
          ))}
          {attendance.length === 0 && (
            <div className="text-center text-slate-400 py-8 text-xs font-semibold">
              Belum ada riwayat presensi tersimpan
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100/60">
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Tanggal</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Kelas</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Hadir</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Izin</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Sakit</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Alpa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((r, idx) => (
                <TableRow key={idx} className="hover:bg-white/60 border-b border-slate-100/50 transition-colors">
                  <TableCell className="font-bold text-xs text-slate-700">{r.date}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="font-black text-[10px] rounded-apple-sm px-2 py-0.5 bg-cyan-50/80 text-primary-dark border border-cyan-200/60">
                      {r.classId}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-2.5 py-0.5 bg-emerald-50/80 text-emerald-700 border border-emerald-200/60 rounded-apple-sm text-[10px] font-black shadow-2xs">
                      {r.hadir || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-2.5 py-0.5 bg-amber-50/80 text-amber-700 border border-amber-200/60 rounded-apple-sm text-[10px] font-black shadow-2xs">
                      {r.izin || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-2.5 py-0.5 bg-orange-50/80 text-orange-700 border border-orange-200/60 rounded-apple-sm text-[10px] font-black shadow-2xs">
                      {r.sakit || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-2.5 py-0.5 bg-rose-50/80 text-rose-700 border border-rose-200/60 rounded-apple-sm text-[10px] font-black shadow-2xs">
                      {r.alpa || 0}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {attendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs font-semibold">
                    Belum ada riwayat presensi tersimpan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
