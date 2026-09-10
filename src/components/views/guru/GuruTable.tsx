'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TeacherItem {
  nip: string;
  name: string;
  role: string;
  subject: string;
  avatar?: string;
}

interface GuruTableProps {
  teachers: TeacherItem[];
  onDelete: (nip: string, name: string) => void;
}

export function GuruTable({ teachers, onDelete }: GuruTableProps) {
  return (
    <div className="w-full">
      {/* Mobile Card List (Mobile-First) */}
      <div className="block md:hidden space-y-3 p-3.5">
        {teachers.map((t, idx) => (
          <div
            key={t.nip || idx}
            className="p-4 bg-white/80 rounded-2xl border border-slate-100 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={t.avatar || '/assets/logo-sdn-bobong.png'}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-800 truncate leading-snug">{t.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">NIP: {t.nip}</p>
                </div>
              </div>
              <button
                onClick={() => onDelete(t.nip, t.name)}
                className="w-9 h-9 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 flex items-center justify-center shrink-0 border border-slate-200/60 transition-colors"
                title="Hapus Guru"
              >
                <i className="ri-delete-bin-line text-base" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <Badge variant="default" className="font-extrabold text-[10px] px-2.5 py-0.5 rounded-md">
                {t.role || 'Guru'}
              </Badge>
              <span className="text-slate-600 font-bold text-[11px]">
                {t.subject || 'Mata Pelajaran'}
              </span>
            </div>
          </div>
        ))}
        {teachers.length === 0 && (
          <div className="text-center text-slate-400 py-8 text-xs font-semibold">
            Belum ada data guru di Supabase Cloud
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Jabatan / Peran</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead className="text-center w-20">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((t, idx) => (
              <TableRow key={t.nip || idx} className="hover:bg-slate-50/80">
                <TableCell>
                  <img
                    src={t.avatar || '/assets/logo-sdn-bobong.png'}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                </TableCell>
                <TableCell className="font-bold text-xs">{t.nip}</TableCell>
                <TableCell className="font-bold text-slate-800 text-xs">{t.name}</TableCell>
                <TableCell>
                  <Badge variant="default" className="font-extrabold">{t.role || 'Guru'}</Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-600 font-medium">{t.subject || '-'}</TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => onDelete(t.nip, t.name)}
                    className="p-1.5 rounded-apple-sm text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                    title="Hapus Guru"
                  >
                    <i className="ri-delete-bin-line" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {teachers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs font-medium">
                  Belum ada data guru di Supabase Cloud
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
