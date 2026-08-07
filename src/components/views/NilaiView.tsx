'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { saveGradeToSupabase } from '@/lib/supabase';
import { downloadNilaiPDF } from '@/modules/generateNilaiPDF';
import { exportNilaiExcel } from '@/modules/exportNilaiExcel';

export function NilaiView() {
  const { students, setStudents, classes, currentTeacher, showToast } = useApp();
  const [selectedClass, setSelectedClass] = useState('ALL');

  const normalizeClass = (c: string) => (c ? c.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '');

  const filteredStudents = students.filter(s => {
    const studentClassNorm = normalizeClass(s.classId);
    const selectedClassNorm = normalizeClass(selectedClass);
    return selectedClass === 'ALL' || studentClassNorm === selectedClassNorm || s.classId === selectedClass;
  });

  const handleGradeChange = async (studentId: string, field: 'scoreFormatif' | 'scoreSts' | 'scoreSas', val: number) => {
    const num = Math.min(100, Math.max(0, val || 0));
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId || s.nis === studentId) {
          return { ...s, [field]: num };
        }
        return s;
      })
    );

    const targetStudent = students.find(s => s.id === studentId || s.nis === studentId);
    if (targetStudent) {
      const typeMap: Record<string, string> = {
        scoreFormatif: 'Formatif',
        scoreSts: 'STS',
        scoreSas: 'SAS'
      };
      await saveGradeToSupabase(studentId, typeMap[field], num, targetStudent.classId);
    }
  };

  const handleDownloadPDF = async () => {
    if (filteredStudents.length === 0) {
      showToast('Tidak ada data nilai untuk dicetak', 'error');
      return;
    }
    try {
      showToast('Memproses Berkas PDF Daftar Nilai...', 'info');
      await downloadNilaiPDF({
        className: selectedClass,
        students: filteredStudents,
        teacherName: currentTeacher?.name,
        teacherNip: currentTeacher?.nip,
        teacherRole: currentTeacher?.role,
        teacherSubject: currentTeacher?.subject,
      });
      showToast('PDF Daftar Nilai Berhasil Diunduh!', 'success');
    } catch (e) {
      showToast('Gagal mencetak PDF Daftar Nilai', 'error');
    }
  };

  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      showToast('Tidak ada data nilai untuk diekspor', 'error');
      return;
    }
    try {
      showToast('Mengunduh File Excel Daftar Nilai...', 'info');
      exportNilaiExcel(filteredStudents, selectedClass);
      showToast('Excel Daftar Nilai Berhasil Diunduh!', 'success');
    } catch (e) {
      showToast('Gagal mengekspor file Excel', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Daftar Nilai Asesmen Kurikulum Merdeka</h3>
          <p className="text-xs text-slate-500">Penilaian Formatif (40%), STS (30%), dan SAS (30%) dengan kalkulasi otomatis</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1.5">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50 gap-1.5">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Nilai
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Filter Kelas:</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="h-9 rounded-apple-sm border border-slate-300 bg-white px-3 text-xs font-semibold outline-none"
            >
              <option value="ALL">Semua Kelas ({students.length} Siswa)</option>
              {classes.map(c => {
                const count = students.filter(s => normalizeClass(s.classId) === normalizeClass(c.id)).length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({count} Siswa)
                  </option>
                );
              })}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead className="text-center w-28">Formatif (40%)</TableHead>
                <TableHead className="text-center w-28">STS (30%)</TableHead>
                <TableHead className="text-center w-28">SAS (30%)</TableHead>
                <TableHead className="text-center w-32">Nilai Akhir Rapor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s, idx) => {
                const formatif = s.scoreFormatif || 0;
                const sts = (s as any).scoreSts || s.scoreSumatif || 0;
                const sas = (s as any).scoreSas || s.scoreSumatif || 0;
                const finalGrade = Math.round((formatif * 0.4) + (sts * 0.3) + (sas * 0.3));

                return (
                  <TableRow key={s.id || idx} className="hover:bg-slate-50/80">
                    <TableCell className="font-semibold text-xs text-slate-500">{idx + 1}</TableCell>
                    <TableCell className="font-bold text-slate-800 text-xs">
                      {s.name}
                      <div className="text-[10px] text-slate-400 font-normal">NIS: {s.nis || '-'}</div>
                    </TableCell>
                    <TableCell><Badge variant="default" className="font-extrabold">{s.classId}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={formatif}
                        onChange={e => handleGradeChange(s.id || s.nis || '', 'scoreFormatif', parseInt(e.target.value))}
                        className="w-20 text-center h-8 text-xs mx-auto font-bold"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={sts}
                        onChange={e => handleGradeChange(s.id || s.nis || '', 'scoreSts', parseInt(e.target.value))}
                        className="w-20 text-center h-8 text-xs mx-auto font-bold"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={sas}
                        onChange={e => handleGradeChange(s.id || s.nis || '', 'scoreSas', parseInt(e.target.value))}
                        className="w-20 text-center h-8 text-xs mx-auto font-bold"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={finalGrade >= 75 ? 'success' : 'warning'} className="text-sm px-3 py-1 font-black">
                        {finalGrade} {finalGrade >= 75 ? '(Tuntas)' : '(Perlu Bimbingan)'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8 text-xs font-medium">
                    Tidak ada data siswa ditemukan untuk filter ini
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
