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
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">Riwayat Presensi Harian</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead className="text-center">Hadir</TableHead>
              <TableHead className="text-center">Izin</TableHead>
              <TableHead className="text-center">Sakit</TableHead>
              <TableHead className="text-center">Alpa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((r, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50/80">
                <TableCell className="font-bold text-xs">{r.date}</TableCell>
                <TableCell><Badge variant="default" className="font-extrabold">{r.classId}</Badge></TableCell>
                <TableCell className="text-center"><Badge variant="success">{r.hadir || 0}</Badge></TableCell>
                <TableCell className="text-center"><Badge variant="warning">{r.izin || 0}</Badge></TableCell>
                <TableCell className="text-center"><Badge variant="secondary">{r.sakit || 0}</Badge></TableCell>
                <TableCell className="text-center"><Badge variant="danger">{r.alpa || 0}</Badge></TableCell>
              </TableRow>
            ))}
            {attendance.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-6 text-xs font-medium">
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
