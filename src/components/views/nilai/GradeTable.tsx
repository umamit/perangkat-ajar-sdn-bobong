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
    <div className="w-full">
      {/* Mobile Card-based Layout */}
      <div className="block md:hidden space-y-3.5">
        {filteredStudents.map((s, idx) => {
          const formatif = getStudentScore(s.id, 'Formatif');
          const sts = getStudentScore(s.id, 'STS');
          const sas = getStudentScore(s.id, 'SAS');
          const finalGrade = Math.round((formatif * 0.4) + (sts * 0.3) + (sas * 0.3));
          return (
            <div
              key={s.id || idx}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-2.5 items-center">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 w-5 h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{s.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-500 font-bold">NIS: {s.nis || '-'}</span>
                      <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        Kelas {s.classId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Scores Grid */}
              <div className="grid grid-cols-3 gap-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Formatif</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formatif}
                    onChange={e => onGradeChange(s.id, 'Formatif', parseInt(e.target.value))}
                    className="w-full text-center h-8 text-xs font-black rounded-lg focus:ring-primary/20 bg-white"
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">STS</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={sts}
                    onChange={e => onGradeChange(s.id, 'STS', parseInt(e.target.value))}
                    className="w-full text-center h-8 text-xs font-black rounded-lg focus:ring-primary/20 bg-white"
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">SAS</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={sas}
                    onChange={e => onGradeChange(s.id, 'SAS', parseInt(e.target.value))}
                    className="w-full text-center h-8 text-xs font-black rounded-lg focus:ring-primary/20 bg-white"
                  />
                </div>
              </div>

              {/* Rapor & AI Bottom row */}
              <div className="flex justify-between items-center pt-1 border-t border-slate-100/60 mt-1">
                <Badge
                  variant={finalGrade >= 75 ? 'success' : 'warning'}
                  className="text-[10px] font-black rounded-lg px-2.5 py-1"
                >
                  Akhir: {finalGrade} {finalGrade >= 75 ? '(Tuntas)' : '(Bimbingan)'}
                </Badge>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenAiDialog({ open: true, studentName: s.name, studentClass: s.classId, score: finalGrade })}
                  className="h-8 px-3 text-[10px] font-extrabold text-primary border-primary/20 hover:bg-cyan-50/50 rounded-lg gap-1"
                >
                  <i className="ri-magic-line" /> AI Deskripsi
                </Button>
              </div>
            </div>
          );
        })}
        {filteredStudents.length === 0 && (
          <div className="text-center text-slate-500 py-8 text-xs font-bold bg-white rounded-2xl border border-slate-100">
            Tidak ada data siswa ditemukan
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block">
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
      </div>
    </div>
  );
}
