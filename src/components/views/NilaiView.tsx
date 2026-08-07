'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { saveGradeToSupabase } from '@/lib/supabase';
import { addToOfflineQueue } from '@/lib/offlineSync';
import { downloadNilaiPDF } from '@/modules/generateNilaiPDF';
import { exportNilaiExcel } from '@/modules/exportNilaiExcel';

import { getTeacherAssignedClass } from '@/lib/utils';
import { RaporAiDescriptor } from './nilai/RaporAiDescriptor';
import { GradeTable } from './nilai/GradeTable';

export function NilaiView() {
  const { students, classes, currentTeacher, showToast, grades, setGrades } = useApp();
  
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const [selectedClassState, setSelectedClassState] = useState(lockedClass || 'ALL');
  
  const selectedClass = lockedClass || selectedClassState;
  const setSelectedClass = lockedClass ? () => {} : setSelectedClassState;

  // AppContext has selectedClassFilter, but if not we can use state
  const [aiDialog, setAiDialog] = useState<{
    open: boolean;
    studentName: string;
    studentClass: string;
    score: number;
  }>({
    open: false,
    studentName: '',
    studentClass: '',
    score: 0
  });

  const SUBJECTS = [
    'Matematika',
    'Bahasa Indonesia',
    'IPAS',
    'Pendidikan Pancasila',
    'Seni Budaya',
    'PJOK',
    'Pendidikan Agama Islam',
    'Pendidikan Agama Kristen',
    'Bahasa Inggris',
    'Muatan Lokal'
  ];

  const isGuruMapel = currentTeacher?.role === 'Guru Mata Pelajaran';
  
  const getNormalizedDefaultSubject = () => {
    const rawSubj = currentTeacher?.subject || '';
    if (rawSubj.toLowerCase().includes('bahasa inggris')) {
      return 'Bahasa Inggris';
    }
    if (rawSubj.toLowerCase().includes('pjok')) {
      return 'PJOK';
    }
    if (rawSubj.toLowerCase().includes('agama')) {
      if (rawSubj.toLowerCase().includes('kristen')) {
        return 'Pendidikan Agama Kristen';
      }
      return 'Pendidikan Agama Islam';
    }
    return 'Matematika';
  };

  const [selectedSubject, setSelectedSubject] = useState(getNormalizedDefaultSubject());

  const normalizeClass = (c: string) => (c ? c.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '');

  const filteredStudents = students.filter(s => {
    const studentClassNorm = normalizeClass(s.classId);
    const selectedClassNorm = normalizeClass(selectedClass);
    return selectedClass === 'ALL' || studentClassNorm === selectedClassNorm || s.classId === selectedClass;
  });

  const getStudentScore = (studentId: string, type: 'Formatif' | 'STS' | 'SAS') => {
    const record = grades.find(g => g.student_id === studentId && g.subject === selectedSubject && g.type === type);
    return record ? Number(record.score) : 0;
  };

  const handleGradeChange = async (studentId: string, type: 'Formatif' | 'STS' | 'SAS', val: number) => {
    const num = Math.min(100, Math.max(0, val || 0));
    
    // Update local state reaktif
    setGrades(prev => {
      const existingIdx = prev.findIndex(g => g.student_id === studentId && g.subject === selectedSubject && g.type === type);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], score: num };
        return updated;
      } else {
        return [...prev, {
          student_id: studentId,
          studentId,
          classId: selectedClass,
          class_id: selectedClass,
          subject: selectedSubject,
          type,
          score: num
        }];
      }
    });

    const targetStudent = students.find(s => s.id === studentId || s.nis === studentId);
    if (targetStudent) {
      const existingRecord = grades.find(g => g.student_id === studentId && g.subject === selectedSubject && g.type === type);
      const payload: { student_id: string; type: string; score: number; class_id: string; subject: string; teacher_nip: string; id?: string } = {
        student_id: studentId,
        type: type,
        score: num,
        class_id: targetStudent.classId,
        subject: selectedSubject,
        teacher_nip: currentTeacher?.nip || ''
      };
      if (existingRecord?.id) {
        payload.id = existingRecord.id;
      }
      const ok = await saveGradeToSupabase(payload);
      if (!ok && typeof navigator !== 'undefined' && !navigator.onLine) {
        addToOfflineQueue('saveGrade', payload);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (filteredStudents.length === 0) {
      showToast('Tidak ada data nilai untuk dicetak', 'error');
      return;
    }
    const studentsWithGrades = filteredStudents.map(s => ({
      ...s,
      scoreFormatif: getStudentScore(s.id, 'Formatif'),
      scoreSts: getStudentScore(s.id, 'STS'),
      scoreSas: getStudentScore(s.id, 'SAS'),
    }));
    try {
      showToast('Memproses Berkas PDF Daftar Nilai...', 'info');
      await downloadNilaiPDF({
        className: selectedClass,
        students: studentsWithGrades,
        teacherName: currentTeacher?.name,
        teacherNip: currentTeacher?.nip,
        teacherRole: currentTeacher?.role,
        teacherSubject: selectedSubject,
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
    const studentsWithGrades = filteredStudents.map(s => ({
      ...s,
      scoreFormatif: getStudentScore(s.id, 'Formatif'),
      scoreSts: getStudentScore(s.id, 'STS'),
      scoreSas: getStudentScore(s.id, 'SAS'),
    }));
    try {
      showToast('Mengunduh File Excel Daftar Nilai...', 'info');
      exportNilaiExcel(studentsWithGrades, selectedClass);
      showToast('Excel Daftar Nilai Berhasil Diunduh!', 'success');
    } catch (e) {
      showToast('Gagal mengekspor file Excel', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Daftar Nilai Rapor Kelas - {selectedSubject}</h3>
          <p className="text-xs text-slate-500 font-semibold">Kalkulasi nilai otomatis berdasarkan pembagian subjek dan guru yang login</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-black text-emerald-700 border-emerald-200 hover:bg-emerald-50/50 gap-1.5 rounded-xl">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-black text-rose-700 border-rose-250 hover:bg-rose-50/50 gap-1.5 rounded-xl">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Nilai
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 bg-white/35">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-650">Filter Kelas:</label>
              {lockedClass ? (
                <Badge variant="default" className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  Kelas {lockedClass} (Binaan)
                </Badge>
              ) : (
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ALL">Semua Kelas ({students.length} Siswa)</option>
                  {classes.map(c => {
                    const count = students.filter(s => normalizeClass(s.classId) === normalizeClass(c.id)).length;
                    return (
                      <option key={c.id} value={c.id}>{c.name} ({count} Siswa)</option>
                    );
                  })}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-650">Mata Pelajaran:</label>
              {isGuruMapel ? (
                <Badge variant="default" className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  {selectedSubject}
                </Badge>
              ) : (
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SUBJECTS.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <GradeTable
            filteredStudents={filteredStudents}
            getStudentScore={getStudentScore}
            onGradeChange={handleGradeChange}
            onOpenAiDialog={setAiDialog}
          />
        </CardContent>
      </Card>

      <RaporAiDescriptor
        open={aiDialog.open}
        onOpenChange={open => setAiDialog(prev => ({ ...prev, open }))}
        studentName={aiDialog.studentName}
        studentClass={aiDialog.studentClass}
        subject={selectedSubject}
        score={aiDialog.score}
      />
    </div>
  );
}
