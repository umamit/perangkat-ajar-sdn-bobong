'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteStudentFromSupabase } from '@/lib/supabase';
import { downloadSiswaPDF } from '@/modules/generateSiswaPDF';
import { exportSiswaExcel } from '@/modules/exportSiswaExcel';

export function SiswaView() {
  const { students, classes, currentTeacher, showToast, setStudents, syncData, selectedClassFilter, setSelectedClassFilter } = useApp();
  const [search, setSearch] = useState('');
  const selectedClass = selectedClassFilter;
  const setSelectedClass = setSelectedClassFilter;

  const normalizeClass = (c: string) => (c ? c.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '');

  const filteredStudents = students.filter(s => {
    const matchesName = s.name.toLowerCase().includes(search.toLowerCase()) || (s.nis && s.nis.includes(search));
    const studentClassNorm = normalizeClass(s.classId);
    const selectedClassNorm = normalizeClass(selectedClass);
    const matchesClass = selectedClass === 'ALL' || studentClassNorm === selectedClassNorm || s.classId === selectedClass;
    return matchesName && matchesClass;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data siswa ${name}?`)) {
      setStudents(prev => prev.filter(s => s.id !== id && s.nis !== id));
      await deleteStudentFromSupabase(id);
      await syncData();
      showToast(`Siswa ${name} berhasil dihapus permanen`, 'info');
    }
  };

  const handleDownloadPDF = async () => {
    if (filteredStudents.length === 0) {
      showToast('Tidak ada data siswa untuk dicetak', 'error');
      return;
    }
    try {
      showToast('Memproses Berkas PDF Data Siswa...', 'info');
      await downloadSiswaPDF({
        className: selectedClass,
        students: filteredStudents,
        teacherName: currentTeacher?.name,
        teacherNip: currentTeacher?.nip,
      });
      showToast('PDF Data Siswa Berhasil Diunduh!', 'success');
    } catch (e) {
      showToast('Gagal mencetak PDF Data Siswa', 'error');
    }
  };

  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      showToast('Tidak ada data siswa untuk diekspor', 'error');
      return;
    }
    try {
      showToast('Mengunduh File Excel Data Siswa...', 'info');
      exportSiswaExcel(filteredStudents, selectedClass);
      showToast('Excel Data Siswa Berhasil Diunduh!', 'success');
    } catch (e) {
      showToast('Gagal mengekspor file Excel Data Siswa', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Daftar Siswa SD Negeri Bobong</h3>
          <p className="text-xs text-slate-500">Kelola data siswa, NIS/NISN, dan kelas binaan</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1.5">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50 gap-1.5">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Siswa
          </Button>
          <Button size="sm" onClick={() => (window as any).showAddStudentModal()} className="gap-1">
            <i className="ri-user-add-line" /> Tambah Siswa
          </Button>
          <Button variant="outline" size="sm" onClick={() => (window as any).showImportStudentModal()} className="gap-1">
            <i className="ri-upload-2-line" /> Impor Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <i className="ri-search-line absolute left-3 top-2.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama atau NIS siswa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
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
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="text-center">Formatif</TableHead>
                <TableHead className="text-center">Sumatif</TableHead>
                <TableHead className="text-center w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s, idx) => (
                <TableRow key={s.id || idx} className="hover:bg-slate-50/80">
                  <TableCell className="font-semibold text-xs text-slate-500">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">
                    {s.name}
                    <div className="text-[10px] text-slate-400 font-normal">NIS: {s.nis || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="font-extrabold">{s.classId}</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">
                    {s.gender === 'L' ? (
                      <span className="text-cyan-700 font-bold">Laki-Laki</span>
                    ) : (
                      <span className="text-rose-600 font-bold">Perempuan</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-xs font-bold text-slate-700">
                    {s.scoreFormatif || 0}
                  </TableCell>
                  <TableCell className="text-center text-xs font-bold text-slate-700">
                    {s.scoreSumatif || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => (window as any).showEditStudentModal(s.id || s.nis)}
                        className="p-1.5 rounded-apple-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        title="Edit Siswa"
                      >
                        <i className="ri-edit-line" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id || s.nis || '', s.name)}
                        className="p-1.5 rounded-apple-sm text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                        title="Hapus Siswa"
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
