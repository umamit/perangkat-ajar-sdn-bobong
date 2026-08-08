'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { deleteStudentFromSupabase, saveStudentToSupabase } from '@/lib/supabase';
import { downloadSiswaPDF } from '@/modules/generateSiswaPDF';
import { exportSiswaExcel } from '@/modules/exportSiswaExcel';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { getTeacherAssignedClass } from '@/lib/utils';
import { StudentDialogs } from './siswa/StudentDialogs';
import { StudentTable } from './siswa/StudentTable';
import { parseStudentImport } from '@/modules/parseStudentImport';

export function SiswaView() {
  const { students, classes, currentTeacher, showToast, setStudents, syncData, selectedClassFilter, setSelectedClassFilter, isLoading } = useApp();
  const [search, setSearch] = useState('');
  
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const selectedClass = lockedClass || selectedClassFilter;
  const setSelectedClass = lockedClass ? () => {} : setSelectedClassFilter;
  const isKepsek = !!(currentTeacher?.role?.toLowerCase().includes('kepala sekolah') || currentTeacher?.role?.toLowerCase().includes('admin') || currentTeacher?.nip === '199610272019032006');

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
    nis: '',
    nisn: '',
    nik: '',
    birthInfo: '',
    parentName: '',
    religion: '',
    parentJob: '',
    address: '',
    admissionYear: ''
  });

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    classId: '1A',
    gender: 'L' as 'L' | 'P',
    nis: '',
    nisn: '',
    nik: '',
    birthInfo: '',
    parentName: '',
    religion: '',
    parentJob: '',
    address: '',
    admissionYear: ''
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
        scoreSas: 0,
        nisn: addForm.nisn.trim() || undefined,
        nik: addForm.nik.trim() || undefined,
        birthInfo: addForm.birthInfo.trim() || undefined,
        parentName: addForm.parentName.trim() || undefined,
        religion: addForm.religion.trim() || undefined,
        parentJob: addForm.parentJob.trim() || undefined,
        address: addForm.address.trim() || undefined,
        admissionYear: addForm.admissionYear.trim() || undefined
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
          nis: '',
          nisn: '',
          nik: '',
          birthInfo: '',
          parentName: '',
          religion: '',
          parentJob: '',
          address: '',
          admissionYear: ''
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
      nis: student.nis || '',
      nisn: student.nisn || '',
      nik: student.nik || '',
      birthInfo: student.birthInfo || '',
      parentName: student.parentName || '',
      religion: student.religion || '',
      parentJob: student.parentJob || '',
      address: student.address || '',
      admissionYear: student.admissionYear || ''
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
        nisn: editForm.nisn.trim() || undefined,
        nik: editForm.nik.trim() || undefined,
        birthInfo: editForm.birthInfo.trim() || undefined,
        parentName: editForm.parentName.trim() || undefined,
        religion: editForm.religion.trim() || undefined,
        parentJob: editForm.parentJob.trim() || undefined,
        address: editForm.address.trim() || undefined,
        admissionYear: editForm.admissionYear.trim() || undefined
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
    const targetClass = selectedClass !== 'ALL' ? selectedClass : (classes[0]?.id || '1A');
    await parseStudentImport(file, targetClass, showToast, (newStudents) => {
      setStudents(prev => [...prev, ...newStudents]);
      setShowImportModal(false);
    });
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
          <StudentTable
            filteredStudents={filteredStudents}
            isKepsek={isKepsek}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
            isLoading={isLoading}
          />
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
