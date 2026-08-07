'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteStudentFromSupabase, saveStudentToSupabase } from '@/lib/supabase';
import { downloadSiswaPDF } from '@/modules/generateSiswaPDF';
import { exportSiswaExcel } from '@/modules/exportSiswaExcel';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { getTeacherAssignedClass } from '@/lib/utils';
import { StudentDialogs } from './siswa/StudentDialogs';

export function SiswaView() {
  const { students, classes, currentTeacher, showToast, setStudents, syncData, selectedClassFilter, setSelectedClassFilter } = useApp();
  const [search, setSearch] = useState('');
  
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const selectedClass = lockedClass || selectedClassFilter;
  const setSelectedClass = lockedClass ? () => {} : setSelectedClassFilter;
  const isKepsek = !!(currentTeacher?.role?.toLowerCase().includes('kepala sekolah') || currentTeacher?.role?.toLowerCase().includes('admin'));

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
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Daftar Siswa SD Negeri Bobong</h3>
          <p className="text-xs text-slate-500 font-semibold">Kelola data siswa, NIS/NISN, dan kelas binaan</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-black text-emerald-700 border-emerald-200 hover:bg-emerald-50/50 gap-1.5 rounded-xl">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-black text-rose-700 border-rose-250 hover:bg-rose-50/50 gap-1.5 rounded-xl">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Siswa
          </Button>
          {isKepsek && (
            <>
              <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1 rounded-xl font-black text-xs bg-primary hover:bg-primary-dark text-white">
                <i className="ri-user-add-line" /> Tambah Siswa
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)} className="gap-1 rounded-xl font-black text-xs border-primary/20 text-primary hover:bg-cyan-50/30">
                <i className="ri-upload-2-line" /> Impor Excel
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <i className="ri-search-line absolute left-3 top-2.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama atau NIS siswa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 text-xs h-9 rounded-xl focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Filter Kelas:</label>
              {lockedClass ? (
                <Badge variant="default" className="text-[10px] font-black px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                  Kelas {lockedClass} (Binaan)
                </Badge>
              ) : (
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-white/80 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
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
        </CardContent>
      </Card>

      <StudentDialogs
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        showImportModal={showImportModal}
        setShowImportModal={setShowImportModal}
        saving={saving}
        classes={classes}
        selectedClass={selectedClass}
        addForm={addForm}
        setAddForm={setAddForm}
        editForm={editForm}
        setEditForm={setEditForm}
        handleAddSubmit={handleAddSubmit}
        handleEditSubmit={handleEditSubmit}
        handleDirectImport={handleDirectImport}
      />
    </div>
  );
}
