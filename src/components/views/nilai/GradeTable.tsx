'use client';

import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Student } from '@/types';

interface AiDialogState {
  open: boolean;
  studentName: string;
  studentClass: string;
  score: number;
}

interface GradeTableProps {
  filteredStudents: Student[];
  getStudentScore: (id: string, type: 'Formatif' | 'STS' | 'SAS') => number;
  onGradeChange: (id: string, type: 'Formatif' | 'STS' | 'SAS', val: number) => void;
  onOpenAiDialog: (state: AiDialogState) => void;
}

export function GradeTable({
  filteredStudents,
  getStudentScore,
  onGradeChange,
  onOpenAiDialog,
}: GradeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
          <TableHead className="w-12 font-black text-[10px] uppercase text-slate-400">No</TableHead>
          <TableHead className="font-black text-[10px] uppercase text-slate-400">Nama Siswa</TableHead>
          <TableHead className="font-black text-[10px] uppercase text-slate-400">Kelas</TableHead>
          <TableHead className="text-center w-28 font-black text-[10px] uppercase text-slate-400">Formatif (40%)</TableHead>
          <TableHead className="text-center w-28 font-black text-[10px] uppercase text-slate-400">STS (30%)</TableHead>
          <TableHead className="text-center w-28 font-black text-[10px] uppercase text-slate-400">SAS (30%)</TableHead>
          <TableHead className="text-center w-32 font-black text-[10px] uppercase text-slate-400">Nilai Akhir Rapor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredStudents.map((s, idx) => {
          const formatif = getStudentScore(s.id, 'Formatif');
          const sts = getStudentScore(s.id, 'STS');
          const sas = getStudentScore(s.id, 'SAS');
          const finalGrade = Math.round((formatif * 0.4) + (sts * 0.3) + (sas * 0.3));
          return (
            <TableRow key={s.id || idx} className="hover:bg-white/40 border-slate-100 transition-colors">
              <TableCell className="font-bold text-xs text-slate-400">{idx + 1}</TableCell>
              <TableCell className="font-bold text-slate-800 text-xs">
                {s.name}
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">NIS: {s.nis || '-'}</div>
              </TableCell>
              <TableCell>
                <Badge variant="default" className="font-black text-[10px] rounded-md px-2 py-0.5">{s.classId}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Input type="number" min={0} max={100} value={formatif}
                  onChange={e => onGradeChange(s.id, 'Formatif', parseInt(e.target.value))}
                  className="w-20 text-center h-8 text-xs mx-auto font-black rounded-lg focus:ring-primary/20" />
              </TableCell>
              <TableCell className="text-center">
                <Input type="number" min={0} max={100} value={sts}
                  onChange={e => onGradeChange(s.id, 'STS', parseInt(e.target.value))}
                  className="w-20 text-center h-8 text-xs mx-auto font-black rounded-lg focus:ring-primary/20" />
              </TableCell>
              <TableCell className="text-center">
                <Input type="number" min={0} max={100} value={sas}
                  onChange={e => onGradeChange(s.id, 'SAS', parseInt(e.target.value))}
                  className="w-20 text-center h-8 text-xs mx-auto font-black rounded-lg focus:ring-primary/20" />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1 justify-center">
                  <Badge variant={finalGrade >= 75 ? 'success' : 'warning'} className="text-[10px] font-black rounded-md px-2 py-0.5">
                    {finalGrade} {finalGrade >= 75 ? '(Tuntas)' : '(Bimbingan)'}
                  </Badge>
                  <Button size="sm" variant="ghost"
                    onClick={() => onOpenAiDialog({ open: true, studentName: s.name, studentClass: s.classId, score: finalGrade })}
                    className="h-6 px-2 text-[9px] font-black text-primary hover:text-primary-dark gap-1 hover:bg-cyan-50/50 rounded-md">
                    <i className="ri-magic-line text-[9px]" /> AI Rapor
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        {filteredStudents.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-slate-400 py-8 text-xs font-semibold">
              Tidak ada data siswa ditemukan untuk filter ini
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
