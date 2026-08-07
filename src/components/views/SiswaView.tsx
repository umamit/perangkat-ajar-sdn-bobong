'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { deleteStudentFromSupabase, saveStudentToSupabase } from '@/lib/supabase';
import { downloadSiswaPDF } from '@/modules/generateSiswaPDF';
import { exportSiswaExcel } from '@/modules/exportSiswaExcel';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

import { getTeacherAssignedClass } from '@/lib/utils';

export function SiswaView() {
  const { students, classes, currentTeacher, showToast, setStudents, syncData, selectedClassFilter, setSelectedClassFilter } = useApp();
  const [search, setSearch] = useState('');
  
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const selectedClass = lockedClass || selectedClassFilter;
  const setSelectedClass = lockedClass ? () => {} : setSelectedClassFilter;

  // Dialog states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({
    name: '',
    classId: lockedClass || classes[0]?.id || '1A',
    gender: 'L' as 'L' | 'P',
    nis: ''
  });

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    classId: '1A',
    gender: 'L' as 'L' | 'P',
    nis: ''
  });

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
      try {
        setStudents(prev => prev.filter(s => s.id !== id && s.nis !== id));
        await deleteStudentFromSupabase(id);
        showToast(`Siswa ${name} berhasil dihapus permanen`, 'info');
      } catch (e) {
        showToast('Gagal menghapus siswa', 'error');
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      showToast('Nama lengkap wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      const generatedId = crypto.randomUUID();
      const newStudent = {
        id: generatedId,
        nis: addForm.nis.trim() || generatedId,
        name: addForm.name.trim(),
        classId: addForm.classId,
        gender: addForm.gender,
        scoreFormatif: 0,
        scoreSumatif: 0,
        scoreSts: 0,
        scoreSas: 0
      };

      const success = await saveStudentToSupabase(newStudent);
      if (success) {
        setStudents(prev => [...prev, newStudent]);
        showToast(`Siswa ${addForm.name} berhasil ditambahkan`, 'success');
        setShowAddModal(false);
        setAddForm({
          name: '',
          classId: classes[0]?.id || '1A',
          gender: 'L',
          nis: ''
        });
      } else {
        showToast('Gagal menyimpan siswa ke cloud', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (student: any) => {
    setEditForm({
      id: student.id,
      name: student.name,
      classId: student.classId,
      gender: student.gender || 'L',
      nis: student.nis || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      showToast('Nama lengkap wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      const updatedStudent = {
        id: editForm.id,
        nis: editForm.nis.trim() || editForm.id,
        name: editForm.name.trim(),
        classId: editForm.classId,
        gender: editForm.gender,
      };

      const success = await saveStudentToSupabase(updatedStudent);
      if (success) {
        setStudents(prev => prev.map(s => s.id === editForm.id ? { ...s, ...updatedStudent } : s));
        showToast(`Perubahan data siswa ${editForm.name} berhasil disimpan`, 'success');
        setShowEditModal(false);
      } else {
        showToast('Gagal mengupdate data siswa ke cloud', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDirectImport = async (file: File) => {
    showToast('Membaca & mengimpor file Excel ke Supabase Cloud...', 'info');
    const targetClass = selectedClass !== 'ALL' ? selectedClass : (classes[0]?.id || '1A');

    const parseAndSaveRows = async (rawData: any[]) => {
      if (!rawData || rawData.length === 0) {
        showToast('File Excel / CSV kosong!', 'error');
        return;
      }

      let importedCount = 0;
      const parsedStudents: any[] = [];

      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        const keys = Object.keys(row);
        const findVal = (...possibleNames: string[]) => {
          const matchedKey = keys.find(k => possibleNames.some(p => k.toLowerCase().trim() === p.toLowerCase().trim()));
          return matchedKey ? String(row[matchedKey]).trim() : '';
        };

        let name = findVal('Nama Lengkap', 'Nama', 'name', 'Nama Siswa', 'siswa', 'Nama_Siswa');
        let nis = findVal('NISN', 'NIS', 'id', 'No Induk', 'Nomor Induk', 'Nis/Nisn');
        let rawClass = findVal('Kelas', 'classId', 'Kelas Siswa', 'Rombel');
        let rawGender = findVal('Jenis Kelamin', 'gender', 'JK', 'L/P', 'Sex');

        if (!name && keys.length >= 2) {
          const val1 = String(row[keys[0]] || '').trim();
          const val2 = String(row[keys[1]] || '').trim();
          if (isNaN(Number(val2)) && val2.length > 2) {
            name = val2;
            nis = val1;
          } else if (isNaN(Number(val1)) && val1.length > 2) {
            name = val1;
          }
        }

        if (name && name.toLowerCase() !== 'nama lengkap' && name.toLowerCase() !== 'nama' && name.toLowerCase() !== 'name') {
          let classId = rawClass.toUpperCase().trim()
            .replace('KELAS', '').replace('III', '3').replace('II', '2').replace('IV', '4')
            .replace('VI', '6').replace('V', '5').replace('I', '1')
            .replace(/[^0-9A-Z]/g, '');

          if (!classId) classId = targetClass;

          let gender = (rawGender.toUpperCase().startsWith('P') || rawGender.toUpperCase().startsWith('W')) ? 'P' : 'L';
          const generatedId = crypto.randomUUID();
          const newStudent = {
            id: generatedId,
            nis: nis || generatedId,
            name: name,
            classId: classId,
            gender: gender,
            scoreFormatif: 0,
            scoreSumatif: 0,
            scoreSts: 0,
            scoreSas: 0
          };

          const success = await saveStudentToSupabase(newStudent);
          if (success) {
            parsedStudents.push(newStudent);
            importedCount++;
          }
        }
      }

      if (importedCount === 0) {
        showToast('Gagal mengimpor: Tidak ada nama siswa yang valid terbaca', 'error');
        return;
      }

      setStudents(prev => [...prev, ...parsedStudents]);
      showToast(`Sukses mengimpor ${importedCount} data siswa ke Kelas ${targetClass}!`, 'success');
      setShowImportModal(false);
    };

    const filename = file.name.toLowerCase();
    if (filename.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          await parseAndSaveRows(results.data);
        },
        error: (err) => {
          showToast('Gagal membaca file CSV!', 'error');
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rawData = XLSX.utils.sheet_to_json(sheet);
          await parseAndSaveRows(rawData);
        } catch (err) {
          showToast('Gagal membaca file Excel!', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
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
        teacherRole: currentTeacher?.role,
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
          <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1">
            <i className="ri-user-add-line" /> Tambah Siswa
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)} className="gap-1">
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
              {lockedClass ? (
                <Badge variant="default" className="text-xs font-extrabold px-3 py-1.5 bg-primary/10 text-primary border border-primary/20">
                  Kelas {lockedClass} (Binaan)
                </Badge>
              ) : (
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
              )}
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
                        onClick={() => handleEditClick(s)}
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

      {/* Modal Tambah Siswa */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Tambah Data Siswa Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="studentName">Nama Lengkap Siswa</Label>
              <Input
                id="studentName"
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Masukkan nama siswa"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="studentNis">NIS / NISN</Label>
              <Input
                id="studentNis"
                value={addForm.nis}
                onChange={e => setAddForm(f => ({ ...f, nis: e.target.value }))}
                placeholder="Masukkan Nomor Induk Siswa"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="studentClass">Kelas</Label>
              <select
                id="studentClass"
                value={addForm.classId}
                onChange={e => setAddForm(f => ({ ...f, classId: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="studentGender">Jenis Kelamin</Label>
              <select
                id="studentGender"
                value={addForm.gender}
                onChange={e => setAddForm(f => ({ ...f, gender: e.target.value as 'L' | 'P' }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Data Siswa'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Siswa */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Edit Data Siswa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="editStudentName">Nama Lengkap Siswa</Label>
              <Input
                id="editStudentName"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Masukkan nama siswa"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="editStudentNis">NIS / NISN</Label>
              <Input
                id="editStudentNis"
                value={editForm.nis}
                onChange={e => setEditForm(f => ({ ...f, nis: e.target.value }))}
                placeholder="Masukkan Nomor Induk Siswa"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="editStudentClass">Kelas</Label>
              <select
                id="editStudentClass"
                value={editForm.classId}
                onChange={e => setEditForm(f => ({ ...f, classId: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="editStudentGender">Jenis Kelamin</Label>
              <select
                id="editStudentGender"
                value={editForm.gender}
                onChange={e => setEditForm(f => ({ ...f, gender: e.target.value as 'L' | 'P' }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Impor Excel */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Impor Langsung Data Siswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-cyan-50 border border-cyan-200/50 p-4 rounded-xl text-xs space-y-2 text-slate-700">
              <p className="font-bold text-cyan-800 flex items-center gap-1">
                <i className="ri-information-line" /> Impor Langsung Data Siswa Massal:
              </p>
              <p className="text-slate-600">
                Pilih file Excel (.xlsx, .xls) atau CSV (.csv). Seluruh data siswa akan otomatis langsung dimasukkan ke <strong>Kelas {selectedClass !== 'ALL' ? selectedClass : (classes[0]?.id || '1A')}</strong>.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-200 p-8 text-center rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-all flex flex-col items-center justify-center">
              <i className="ri-file-excel-2-line text-4xl text-primary mb-2" />
              <p className="text-xs font-bold text-slate-700 mb-4">Pilih File Excel / CSV untuk Memulai Impor</p>
              <input
                type="file"
                id="directImportFile"
                accept=".xlsx, .xls, .csv"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleDirectImport(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <Button type="button" onClick={() => document.getElementById('directImportFile')?.click()}>
                Pilih & Impor File
              </Button>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowImportModal(false)}>
                Batal
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
