import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/types';

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
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
          <TableHead className="w-12 font-black text-[10px] uppercase text-slate-400">No</TableHead>
          <TableHead className="font-black text-[10px] uppercase text-slate-400">Nama Lengkap</TableHead>
          <TableHead className="font-black text-[10px] uppercase text-slate-400">Kelas</TableHead>
          <TableHead className="font-black text-[10px] uppercase text-slate-400">Gender</TableHead>
          <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Formatif</TableHead>
          <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Sumatif</TableHead>
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
            <TableCell className="text-center text-xs font-black text-slate-700">
              {s.scoreFormatif || 0}
            </TableCell>
            <TableCell className="text-center text-xs font-black text-slate-700">
              {s.scoreSumatif || 0}
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
            <TableCell colSpan={isKepsek ? 7 : 6} className="text-center text-slate-400 py-8 text-xs font-semibold">
              Tidak ada data siswa ditemukan untuk filter ini
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
