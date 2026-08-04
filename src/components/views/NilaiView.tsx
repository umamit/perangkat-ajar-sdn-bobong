'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function NilaiView() {
  const { students, setStudents, classes, showToast } = useApp();
  const [selectedClass, setSelectedClass] = useState('ALL');

  const filteredStudents = students.filter(
    s => selectedClass === 'ALL' || s.classId === selectedClass
  );

  const handleGradeChange = (studentId: string, field: 'scoreFormatif' | 'scoreSts' | 'scoreSas', val: number) => {
    const num = Math.min(100, Math.max(0, val || 0));
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId || s.nis === studentId) {
          return { ...s, [field]: num };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Daftar Nilai Asesmen Siswa</h3>
          <p className="text-xs text-slate-500">Penilaian Formatif, STS (Sumatif Tengah Semester), dan SAS (Sumatif Akhir Semester)</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => (window as any).exportNilaiToCSV()}>
          <i className="ri-download-line" /> Ekspor CSV Nilai
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Filter Kelas:</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="h-9 rounded-apple-sm border border-slate-300 bg-white px-3 text-xs font-medium outline-none"
            >
              <option value="ALL">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
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
                <TableHead className="text-center w-28">Formatif</TableHead>
                <TableHead className="text-center w-28">STS</TableHead>
                <TableHead className="text-center w-28">SAS</TableHead>
                <TableHead className="text-center w-28">Rata-Rata Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s, idx) => {
                const formatif = s.scoreFormatif || 0;
                const sts = (s as any).scoreSts || s.scoreSumatif || 0;
                const sas = (s as any).scoreSas || s.scoreSumatif || 0;
                const avg = Math.round((formatif + sts + sas) / 3);

                return (
                  <TableRow key={s.id || idx}>
                    <TableCell className="font-semibold text-xs text-slate-500">{idx + 1}</TableCell>
                    <TableCell className="font-bold text-slate-800 text-xs">{s.name}</TableCell>
                    <TableCell><Badge variant="default">{s.classId}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={formatif}
                        onChange={e => handleGradeChange(s.id, 'scoreFormatif', parseInt(e.target.value))}
                        className="w-20 text-center h-8 text-xs mx-auto font-bold"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={sts}
                        onChange={e => handleGradeChange(s.id, 'scoreSts', parseInt(e.target.value))}
                        className="w-20 text-center h-8 text-xs mx-auto font-bold"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={sas}
                        onChange={e => handleGradeChange(s.id, 'scoreSas', parseInt(e.target.value))}
                        className="w-20 text-center h-8 text-xs mx-auto font-bold"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={avg >= 75 ? 'success' : 'warning'} className="text-sm px-3 py-1">
                        {avg}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8 text-xs">
                    Tidak ada siswa ditemukan
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
