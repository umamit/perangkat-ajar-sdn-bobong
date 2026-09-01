'use client';

import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Student } from '@/types';

interface AttendanceTableProps {
  classStudents: Student[];
  currentStatuses: Record<string, string>;
  getStatusKey: (s: Student) => string;
  onStatusChange: (key: string, status: string) => void;
}

export function AttendanceTable({
  classStudents,
  currentStatuses,
  getStatusKey,
  onStatusChange,
}: AttendanceTableProps) {
  return (
    <div className="w-full">
      {/* Mobile Card-based Layout (Shown on small screens, hidden on desktop) */}
      <div className="block md:hidden space-y-3.5">
        {classStudents.map((s, idx) => {
          const sKey = getStatusKey(s);
          const currentSt = currentStatuses[sKey] || null;
          return (
            <div
              key={s.id || idx}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 transition-all active:scale-[0.99]"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-2.5 items-center">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 w-5 h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{s.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">NIS: {s.nis || '-'}</p>
                  </div>
                </div>
                {!currentSt && (
                  <span className="text-[9px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                    Belum Absen
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {['Hadir', 'Izin', 'Sakit', 'Alpa'].map(status => {
                  const active = currentSt === status;
                  const activeClass =
                    status === 'Hadir' ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                    : status === 'Izin' ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                    : status === 'Sakit' ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-500/20'
                    : 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/20';
                  return (
                    <button
                      key={status}
                      onClick={() => onStatusChange(sKey, status)}
                      className={`py-2 rounded-xl text-[11px] font-black tracking-wide transition-all ${
                        active
                          ? activeClass
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/50'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {classStudents.length === 0 && (
          <div className="text-center text-slate-500 py-8 text-xs font-bold bg-white rounded-2xl border border-slate-100">
            Belum ada siswa di kelas ini
          </div>
        )}
      </div>

      {/* Desktop Table Layout (Hidden on mobile, shown on desktop) */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
              <TableHead className="w-12 font-black text-[10px] uppercase text-slate-400">No</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Nama Siswa</TableHead>
              <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Pilihan Status Presensi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classStudents.map((s, idx) => {
              const sKey = getStatusKey(s);
              const currentSt = currentStatuses[sKey] || null;
              return (
                <TableRow key={s.id || idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                  <TableCell className="font-bold text-xs text-slate-400">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">
                    {s.name}
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">NIS: {s.nis || '-'}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      {['Hadir', 'Izin', 'Sakit', 'Alpa'].map(status => {
                        const active = currentSt === status;
                        const activeClass =
                          status === 'Hadir' ? 'bg-emerald-600 text-white shadow-sm'
                          : status === 'Izin' ? 'bg-amber-500 text-white shadow-sm'
                          : status === 'Sakit' ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-rose-600 text-white shadow-sm';
                        return (
                          <button
                            key={status}
                            onClick={() => onStatusChange(sKey, status)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                              active ? activeClass : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200/40'
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                      {!currentSt && (
                        <span className="text-[10px] text-slate-500 italic ml-2 font-semibold">
                          (Belum Dipilih)
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {classStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-slate-400 py-8 text-xs font-semibold">
                  Belum ada siswa di kelas ini
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
