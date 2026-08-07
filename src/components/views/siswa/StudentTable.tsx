'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';

interface StudentTableProps {
  filteredStudents: Student[];
  isKepsek: boolean;
  handleEditClick: (student: Student) => void;
  handleDelete: (id: string, name: string) => void;
}

export function StudentTable({
  filteredStudents,
  isKepsek,
  handleEditClick,
  handleDelete
}: StudentTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="w-full">
      {/* Mobile Card-based Layout */}
      <div className="block md:hidden space-y-3">
        {filteredStudents.map((s, idx) => {
          const isExpanded = expandedId === s.id;
          return (
            <div
              key={s.id || idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 transition-all"
            >
              <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpand(s.id)}>
                <div className="flex gap-2.5 items-center">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 w-5 h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{s.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">NIS: {s.nis || '-'}</span>
                      <Badge variant="default" className="text-[9px] font-black px-1.5 py-0 rounded-md">
                        Kelas {s.classId}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    s.gender === 'L' ? 'bg-cyan-50 text-cyan-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {s.gender === 'L' ? 'L' : 'P'}
                  </span>
                  <i className={`text-slate-400 text-lg transition-transform ${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-2 text-xs text-slate-650 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">NISN</span>
                      <span className="font-bold text-slate-700">{s.nisn || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">NIK</span>
                      <span className="font-bold text-slate-700">{s.nik || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Tempat Tgl Lahir</span>
                      <span className="font-bold text-slate-700">{s.birthInfo || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Agama</span>
                      <span className="font-bold text-slate-700">{s.religion || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Nama Orang Tua</span>
                      <span className="font-bold text-slate-700">{s.parentName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Pekerjaan Ortu</span>
                      <span className="font-bold text-slate-700">{s.parentJob || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Tahun Masuk</span>
                      <span className="font-bold text-slate-700">{s.admissionYear || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Alamat</span>
                      <span className="font-bold text-slate-700">{s.address || '-'}</span>
                    </div>
                  </div>

                  {isKepsek && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(s)}
                        className="flex-1 h-9 text-xs rounded-xl font-bold border-slate-200 text-slate-650 hover:bg-slate-50 gap-1.5"
                      >
                        <i className="ri-edit-line text-sm" /> Edit Siswa
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(s.id || s.nis || '', s.name)}
                        className="flex-1 h-9 text-xs rounded-xl font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1.5"
                      >
                        <i className="ri-delete-bin-line text-sm" /> Hapus
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filteredStudents.length === 0 && (
          <div className="text-center text-slate-450 py-8 text-xs font-bold bg-white rounded-2xl border border-slate-100">
            Tidak ada data siswa ditemukan
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
              <TableHead className="w-12 font-black text-[10px] uppercase text-slate-400">No</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Nama Lengkap</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Kelas</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Gender</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">NISN / NIK</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Tempat Tgl Lahir</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Orang Tua / Alamat</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-400">Thn Masuk</TableHead>
              {isKepsek && <TableHead className="text-center w-24 font-black text-[10px] uppercase text-slate-400">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((s, idx) => (
              <TableRow key={s.id || idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                <TableCell className="font-bold text-xs text-slate-400">{idx + 1}</TableCell>
                <TableCell className="font-bold text-slate-800 text-xs">
                  {s.name}
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">NIS: {s.nis || '-'}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="font-black text-[10px] rounded-md">{s.classId}</Badge>
                </TableCell>
                <TableCell className="text-xs font-bold">
                  {s.gender === 'L' ? (
                    <span className="text-cyan-600 bg-cyan-50 px-2 py-1 rounded-lg">Laki-Laki</span>
                  ) : (
                    <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Perempuan</span>
                  )}
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-650">
                  <div>NISN: {s.nisn || '-'}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">NIK: {s.nik || '-'}</div>
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-650">
                  <div>{s.birthInfo || '-'}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Agama: {s.religion || '-'}</div>
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-650">
                  <div>Ortu: {s.parentName || '-'} ({s.parentJob || '-'})</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.address || '-'}</div>
                </TableCell>
                <TableCell className="text-xs font-black text-slate-700">
                  {s.admissionYear || '-'}
                </TableCell>
                {isKepsek && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => handleEditClick(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        title="Edit Siswa"
                      >
                        <i className="ri-edit-line text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id || s.nis || '', s.name)}
                        className="p-1.5 rounded-lg text-rose-450 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Hapus Siswa"
                      >
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={isKepsek ? 9 : 8} className="text-center text-slate-400 py-8 text-xs font-semibold">
                  Tidak ada data siswa ditemukan untuk filter ini
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
