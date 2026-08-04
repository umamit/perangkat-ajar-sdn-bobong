'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function TugasView() {
  const assignments = [
    { id: '1', title: 'Tugas 1: Vocabulary Greetings', classId: '1A', dueDate: '2026-08-10', status: 'Aktif' },
    { id: '2', title: 'Tugas 2: Listening & Repeating', classId: '4A', dueDate: '2026-08-12', status: 'Aktif' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Manajemen Tugas &amp; Evaluasi Siswa</h3>
          <p className="text-xs text-slate-500">Daftar penugasan terstruktur Bahasa Inggris SD</p>
        </div>
        <Button size="sm" onClick={() => (window as any).showAddTugasModal()}>
          <i className="ri-add-line" /> Buat Tugas Baru
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Judul Penugasan</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Tenggat Waktu</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold text-xs text-slate-500">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">{item.title}</TableCell>
                  <TableCell><Badge variant="default">{item.classId}</Badge></TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">{item.dueDate}</TableCell>
                  <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
