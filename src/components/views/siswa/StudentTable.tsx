'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
                    <p className="text-[10px] text-slate-450 font-bold mt-0.5">NIS: {s.nis || '-'}</p>
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

              {/* Collapsible Details - Urutan Persis sesuai Permintaan */}
              {isExpanded && (
                <div className="mt-2 pt-2.5 border-t border-slate-105 space-y-2.5 text-xs text-slate-650 animate-fade-in">
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">NIS</span>
                      <span className="font-bold text-slate-700">{s.nis || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">NISN</span>
                      <span className="font-bold text-slate-700">{s.nisn || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">NIK</span>
                      <span className="font-bold text-slate-700">{s.nik || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Nama Siswa</span>
                      <span className="font-bold text-slate-700">{s.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Tempat Tanggal Lahir</span>
                      <span className="font-bold text-slate-700">{s.birthInfo || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Jenis Kelamin</span>
                      <span className="font-bold text-slate-700">{s.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Nama Orang Tua</span>
                      <span className="font-bold text-slate-700">{s.parentName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Agama</span>
                      <span className="font-bold text-slate-700">{s.religion || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Pekerjaan Orang Tua</span>
                      <span className="font-bold text-slate-700">{s.parentJob || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Alamat</span>
                      <span className="font-bold text-slate-700">{s.address || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Tahun Masuk SD</span>
                      <span className="font-bold text-slate-700">{s.admissionYear || '-'}</span>
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

      {/* Desktop Table Layout - Urutan Kolom Sesuai Persis dengan Gambar/Permintaan */}
      <div className="hidden md:block overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
              <TableHead className="w-12 font-black text-[10px] uppercase text-slate-450">Nomor Urut</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-450">NIS</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">NISN</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">NIK</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">Nama Siswa</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">Tempat Tanggal Lahir</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">Jenis Kelamin</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">Nama Orang Tua</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">Agama</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">Pekerjaan Orang Tua</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">Alamat</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-slate-455">Tahun Masuk SD</TableHead>
              {isKepsek && <TableHead className="text-center w-20 font-black text-[10px] uppercase text-slate-455">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((s, idx) => (
              <TableRow key={s.id || idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                <TableCell className="font-bold text-xs text-slate-400">{idx + 1}</TableCell>
                <TableCell className="font-bold text-slate-800 text-xs">{s.nis || '-'}</TableCell>
                <TableCell className="font-semibold text-slate-650 text-xs">{s.nisn || '-'}</TableCell>
                <TableCell className="font-semibold text-slate-650 text-xs">{s.nik || '-'}</TableCell>
                <TableCell className="font-black text-slate-800 text-xs">{s.name}</TableCell>
                <TableCell className="font-semibold text-slate-650 text-xs">{s.birthInfo || '-'}</TableCell>
                <TableCell className="text-xs font-bold">
                  {s.gender === 'L' ? (
                    <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">Laki-Laki</span>
                  ) : (
                    <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Perempuan</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-slate-650 text-xs">{s.parentName || '-'}</TableCell>
                <TableCell className="font-semibold text-slate-650 text-xs">{s.religion || '-'}</TableCell>
                <TableCell className="font-semibold text-slate-650 text-xs">{s.parentJob || '-'}</TableCell>
                <TableCell className="font-semibold text-slate-650 text-xs">{s.address || '-'}</TableCell>
                <TableCell className="font-black text-slate-700 text-xs">{s.admissionYear || '-'}</TableCell>
                {isKepsek && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => handleEditClick(s)}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        title="Edit Siswa"
                      >
                        <i className="ri-edit-line text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id || s.nis || '', s.name)}
                        className="p-1 rounded-lg text-rose-450 hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
                <TableCell colSpan={isKepsek ? 13 : 12} className="text-center text-slate-400 py-8 text-xs font-semibold">
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
