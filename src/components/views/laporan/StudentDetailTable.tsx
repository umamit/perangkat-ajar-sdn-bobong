'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export interface StudentDetailRow {
  id?: string;
  name: string;
  nis: string;
  attendanceRate: number;
  gradeAverage: number;
}

interface StudentDetailTableProps {
  students: StudentDetailRow[];
  subjectName: string;
}

export function StudentDetailTable({ students, subjectName }: StudentDetailTableProps) {
  return (
    <div className="w-full">
      {/* Mobile Card List (Mobile-First) */}
      <div className="block md:hidden p-3.5 space-y-3">
        {students.map((s, idx) => {
          const isPass = s.attendanceRate >= 75 && s.gradeAverage >= 75;
          return (
            <div
              key={s.id || idx}
              className="p-3.5 bg-white/90 rounded-2xl border border-slate-100 shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 leading-snug">{s.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">NIS: {s.nis || '-'}</p>
                </div>
                <Badge
                  variant={isPass ? 'default' : 'secondary'}
                  className={`text-[9px] font-black rounded-md px-2 py-0.5 shrink-0 ${
                    isPass ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {isPass ? 'Tuntas' : 'Perlu Bimbingan'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100/80 text-xs">
                <div className="p-2 bg-slate-50/70 rounded-xl">
                  <span className="block text-[9px] font-black text-slate-400 uppercase">Kehadiran</span>
                  <span className={`text-sm font-black ${s.attendanceRate >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {s.attendanceRate}%
                  </span>
                </div>
                <div className="p-2 bg-slate-50/70 rounded-xl">
                  <span className="block text-[9px] font-black text-slate-400 uppercase">Rata Nilai</span>
                  <span className="text-sm font-black text-slate-800">
                    {s.gradeAverage}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {students.length === 0 && (
          <div className="text-center text-slate-400 py-8 text-xs font-semibold">
            Tidak ada data siswa terdaftar di rombel ini
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
              <TableHead className="w-12 font-black text-[10px] uppercase text-slate-400">No</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Nama Siswa</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">NIS</TableHead>
              <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Kehadiran (%)</TableHead>
              <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">
                Rata-Rata Nilai ({subjectName})
              </TableHead>
              <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s, idx) => {
              const isPass = s.attendanceRate >= 75 && s.gradeAverage >= 75;
              return (
                <TableRow key={s.id || idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                  <TableCell className="font-bold text-xs text-slate-400">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">{s.name}</TableCell>
                  <TableCell className="font-semibold text-xs text-slate-500">{s.nis}</TableCell>
                  <TableCell className="text-center font-black text-xs">
                    <span className={s.attendanceRate >= 75 ? 'text-emerald-600' : 'text-rose-600'}>
                      {s.attendanceRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-black text-xs">{s.gradeAverage}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={isPass ? 'default' : 'secondary'}
                      className={`text-[9px] font-black rounded-md px-2 py-0.5 ${
                        isPass ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isPass ? 'Tuntas' : 'Perlu Bimbingan'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs font-semibold">
                  Tidak ada data siswa terdaftar di rombel ini
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
