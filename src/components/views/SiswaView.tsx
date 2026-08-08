'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { deleteStudentFromSupabase, saveStudentToSupabase } from '@/lib/supabase';
import { downloadSiswaPDF } from '@/modules/generateSiswaPDF';
import { exportSiswaExcel } from '@/modules/exportSiswaExcel';
import { getTeacherAssignedClass } from '@/lib/utils';
import { AddStudentModal } from './siswa/AddStudentModal';
import { EditStudentModal } from './siswa/EditStudentModal';
import { ImportStudentModal } from './siswa/ImportStudentModal';
import { StudentTable } from './siswa/StudentTable';
import { StudentHeader } from './siswa/StudentHeader';
import { parseStudentImport } from '@/modules/parseStudentImport';
import { CounselingModal } from './siswa/CounselingModal';

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
  const [showCounselingModal, setShowCounselingModal] = useState(false);
  const [selectedCounselingStudent, setSelectedCounselingStudent] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const initialForm = { name: '', classId: '1A', gender: 'L' as 'L' | 'P', nis: '', nisn: '', nik: '', birthInfo: '', parentName: '', religion: '', parentJob: '', address: '', admissionYear: '' };
  const [addForm, setAddForm] = useState({ ...initialForm, classId: lockedClass || classes[0]?.id || '1A' });
  const [editForm, setEditForm] = useState({ ...initialForm, id: '' });

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
    if (filteredStudents.length === 0) return showToast('Tidak ada data siswa untuk dicetak', 'error');
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
    } catch {
      showToast('Gagal mencetak PDF Data Siswa', 'error');
    }
  };

  const handleExportExcel = () => {
    if (filteredStudents.length === 0) return showToast('Tidak ada data siswa untuk diekspor', 'error');
    try {
      showToast('Mengunduh File Excel Data Siswa...', 'info');
      exportSiswaExcel(filteredStudents, selectedClass);
      showToast('Excel Data Siswa Berhasil Diunduh!', 'success');
    } catch {
      showToast('Gagal mengekspor file Excel Data Siswa', 'error');
    }
  };

  const handleCounselingClick = (student: any) => {
    setSelectedCounselingStudent(student);
    setShowCounselingModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <StudentHeader
        handleExportExcel={handleExportExcel}
        handleDownloadPDF={handleDownloadPDF}
        isKepsek={isKepsek}
        setShowAddModal={setShowAddModal}
        setShowImportModal={setShowImportModal}
        search={search}
        setSearch={setSearch}
        lockedClass={lockedClass}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classes={classes}
        students={students}
        normalizeClass={normalizeClass}
      />

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <StudentTable
            filteredStudents={filteredStudents}
            isKepsek={isKepsek}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
            handleCounselingClick={handleCounselingClick}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <AddStudentModal
        isOpen={showAddModal}
        onOpenChange={setShowAddModal}
        saving={saving}
        classes={classes}
        addForm={addForm}
        setAddForm={setAddForm}
        onSubmit={handleAddSubmit}
      />
      <EditStudentModal
        isOpen={showEditModal}
        onOpenChange={setShowEditModal}
        saving={saving}
        classes={classes}
        editForm={editForm}
        setEditForm={setEditForm}
        onSubmit={handleEditSubmit}
      />
      <ImportStudentModal
        isOpen={showImportModal}
        onOpenChange={setShowImportModal}
        classes={classes}
        selectedClass={selectedClass}
        onImport={handleDirectImport}
      />
      <CounselingModal
        isOpen={showCounselingModal}
        onOpenChange={setShowCounselingModal}
        student={selectedCounselingStudent}
      />
    </div>
  );
}
