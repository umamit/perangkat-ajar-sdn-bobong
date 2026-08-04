'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function JurnalView() {
  const { journals, setJournals, showToast } = useApp();

  const handleDelete = (id: string) => {
    if (confirm('Hapus entry jurnal mengajar ini?')) {
      setJournals(prev => prev.filter(j => j.id !== id));
      showToast('Jurnal mengajar berhasil dihapus', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Jurnal Mengajar Guru Bahasa Inggris</h3>
          <p className="text-xs text-slate-500">Catatan pelaksanaan pembelajaran harian dan topik per kelas</p>
        </div>
        <Button size="sm" onClick={() => (window as any).showAddJournalModal()}>
          <i className="ri-add-line" /> Isi Jurnal Hari Ini
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal & Jam</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Materi / Topik</TableHead>
                <TableHead>Presensi</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-center w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journals.map((j, idx) => (
                <TableRow key={j.id || idx}>
                  <TableCell className="font-bold text-xs">
                    {j.date}
                    <div className="text-[10px] text-slate-400 font-normal">{j.time || '-'}</div>
                  </TableCell>
                  <TableCell><Badge variant="default">{j.classId}</Badge></TableCell>
                  <TableCell className="font-semibold text-xs text-slate-800">{j.topic}</TableCell>
                  <TableCell className="text-xs text-slate-600">{j.attendance || '-'}</TableCell>
                  <TableCell className="text-xs text-slate-500 max-w-xs truncate">{j.notes || '-'}</TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleDelete(j.id)}
                      className="p-1.5 rounded-apple-sm text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                      title="Hapus Jurnal"
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {journals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs">
                    Belum ada jurnal mengajar terisi
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
