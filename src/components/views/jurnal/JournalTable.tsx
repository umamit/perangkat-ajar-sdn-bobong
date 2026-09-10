'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Journal } from '@/types';

interface JournalTableProps {
  journals: Journal[];
  onDelete: (id: string) => void;
}

export function JournalTable({ journals, onDelete }: JournalTableProps) {
  return (
    <div className="w-full">
      {/* Mobile Card List (Mobile-First) */}
      <div className="block md:hidden p-3.5 space-y-3">
        {journals.map((j, idx) => (
          <div
            key={j.id || idx}
            className="p-4 bg-white/90 rounded-2xl border border-slate-100 shadow-2xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <i className="ri-calendar-line text-primary" /> {j.date}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">({j.time || '-'})</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="font-black text-[10px] rounded-md px-2 py-0.5">
                  Kelas {j.classId}
                </Badge>
                <button
                  onClick={() => onDelete(j.id)}
                  className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors"
                  title="Hapus Jurnal"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Topik Pembelajaran</p>
              <h4 className="font-extrabold text-xs text-slate-800 leading-snug mt-0.5">{j.topic}</h4>
            </div>

            {j.notes && (
              <div className="p-2.5 bg-slate-50/70 rounded-xl text-slate-600 font-medium text-[11px] leading-relaxed border border-slate-100">
                <span className="font-bold text-slate-700 block text-[10px] mb-0.5">Refleksi / Catatan:</span>
                {j.notes}
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-100/60">
              <span>Kehadiran: <strong className="text-slate-700">{j.attendance || '-'}</strong></span>
            </div>
          </div>
        ))}
        {journals.length === 0 && (
          <div className="text-center text-slate-400 py-8 text-xs font-semibold">
            Belum ada jurnal mengajar terisi
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Tanggal &amp; Jam</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Kelas</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Materi / Topik</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Presensi</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Catatan</TableHead>
              <TableHead className="text-center w-20 font-black text-[10px] uppercase text-slate-400">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {journals.map((j, idx) => (
              <TableRow key={j.id || idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                <TableCell className="font-bold text-xs text-slate-700">
                  {j.date}
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{j.time || '-'}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="font-black text-[10px] rounded-md px-2 py-0.5">{j.classId}</Badge>
                </TableCell>
                <TableCell className="font-bold text-xs text-slate-800">{j.topic}</TableCell>
                <TableCell className="text-xs font-semibold text-slate-600">{j.attendance || '-'}</TableCell>
                <TableCell className="text-xs font-medium text-slate-500 max-w-xs truncate">{j.notes || '-'}</TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => onDelete(j.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Hapus Jurnal"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {journals.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs font-semibold">
                  Belum ada jurnal mengajar terisi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
