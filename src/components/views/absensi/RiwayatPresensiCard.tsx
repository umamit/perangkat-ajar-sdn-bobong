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
    <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden text-slate-800">
      <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
        <CardTitle className="text-sm font-extrabold flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-inner">
            <i className="ri-history-line text-base" />
          </div>
          <span>Riwayat Presensi Harian</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
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
              <TableRow key={idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                <TableCell className="font-bold text-xs text-slate-700">{r.date}</TableCell>
                <TableCell>
                  <Badge variant="default" className="font-black text-[10px] rounded-md px-2 py-0.5">{r.classId}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[10px] font-black">{r.hadir || 0}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-105 rounded-md text-[10px] font-black">{r.izin || 0}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-105 rounded-md text-[10px] font-black">{r.sakit || 0}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-md text-[10px] font-black">{r.alpa || 0}</span>
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
      </CardContent>
    </Card>
  );
}
