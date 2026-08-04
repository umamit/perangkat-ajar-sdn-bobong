'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function GuruView() {
  const { teachers, setTeachers, showToast } = useApp();

  const handleDelete = (nip: string, name: string) => {
    if (confirm(`Hapus data guru ${name}?`)) {
      setTeachers(prev => prev.filter(t => t.nip !== nip));
      showToast(`Data guru ${name} berhasil dihapus`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Kelola Data Guru & Tenaga Pendidik</h3>
          <p className="text-xs text-slate-500">Daftar tenaga pendidik terdaftar di SD Negeri Bobong</p>
        </div>
        <Button size="sm" onClick={() => (window as any).showAddTeacherModal()}>
          <i className="ri-user-add-line" /> Tambah Data Guru
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
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
                <TableRow key={t.nip || idx}>
                  <TableCell>
                    <img
                      src={t.avatar || '/assets/logo-sdn-bobong.png'}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  </TableCell>
                  <TableCell className="font-bold text-xs">{t.nip}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">{t.name}</TableCell>
                  <TableCell><Badge variant="default">{t.role || 'Guru'}</Badge></TableCell>
                  <TableCell className="text-xs text-slate-600">{t.subject || '-'}</TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleDelete(t.nip, t.name)}
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
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs">
                    Belum ada data guru terdaftar
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
