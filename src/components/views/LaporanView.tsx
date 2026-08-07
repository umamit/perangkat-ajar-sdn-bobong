'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { downloadLaporanPDFWithPdfLib } from '@/modules/generatePDFLib';
import { getTeacherAssignedClass } from '@/lib/utils';

export function LaporanView() {
  const { students, classes, journals, attendance, currentTeacher, showToast, grades } = useApp();

  const isKepsek = currentTeacher?.nip === '199610272019032006';
  const isGuruMapel = currentTeacher?.role === 'Guru Mata Pelajaran';
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);

  // Subject options
  const SUBJECTS = [
    'Matematika', 'Bahasa Indonesia', 'IPAS', 'Pendidikan Pancasila',
    'Seni Budaya', 'PJOK', 'Pendidikan Agama Islam', 'Pendidikan Agama Kristen',
    'Bahasa Inggris', 'Muatan Lokal'
  ];

  // Default subject based on active teacher profile
  const getDefaultSubject = () => {
    const rawSubj = currentTeacher?.subject || '';
    if (rawSubj.toLowerCase().includes('bahasa inggris')) return 'Bahasa Inggris';
    if (rawSubj.toLowerCase().includes('pjok')) return 'PJOK';
    if (rawSubj.toLowerCase().includes('agama')) {
      return rawSubj.toLowerCase().includes('kristen') ? 'Pendidikan Agama Kristen' : 'Pendidikan Agama Islam';
    }
    return 'Matematika';
  };

  const [selectedSubject, setSelectedSubject] = useState(getDefaultSubject());
  const [selectedClassExplorer, setSelectedClassExplorer] = useState(lockedClass || '1A');

  // Filter scopes based on role
  const filteredStudents = isKepsek
    ? students
    : lockedClass
      ? students.filter(s => s.classId === lockedClass)
      : students; // Guru Mapel sees all students but only their subject grades

  const filteredClasses = isKepsek
    ? classes
    : lockedClass
      ? classes.filter(c => c.id === lockedClass)
      : classes;

  const filteredAttendance = isKepsek
    ? attendance
    : lockedClass
      ? attendance.filter(a => {
          const student = students.find(s => s.id === (a.student_id || a.studentId));
          return student?.classId === lockedClass;
        })
      : attendance;

  // Perform overall attendance calculations
  const totalAttendanceDays = filteredAttendance.length;
  const totalHadir = filteredAttendance.filter(a => a.status === 'Hadir').length;
  const averageAttendanceRate = totalAttendanceDays > 0 ? Math.round((totalHadir / totalAttendanceDays) * 100) : 100;

  // Prepare Stats for PDF download
  const classStats = filteredClasses.map(c => {
    const classStudents = students.filter(s => s.classId === c.id);
    let totalAttPresent = 0;
    let totalAttDays = 0;
    classStudents.forEach(st => {
      const atts = attendance.filter(a => (a.student_id === st.id || a.studentId === st.id));
      totalAttDays += atts.length;
      totalAttPresent += atts.filter(a => a.status === 'Hadir').length;
    });
    const attRate = totalAttDays > 0 ? Math.round((totalAttPresent / totalAttDays) * 100) : 100;

    let totalGradesSum = 0;
    classStudents.forEach(st => {
      const fVal = grades.find(g => g.student_id === st.id && g.type === 'Formatif' && g.subject === selectedSubject)?.score || 0;
      const sVal = grades.find(g => g.student_id === st.id && g.type === 'STS' && g.subject === selectedSubject)?.score || 0;
      const aVal = grades.find(g => g.student_id === st.id && g.type === 'SAS' && g.subject === selectedSubject)?.score || 0;
      totalGradesSum += Math.round((Number(fVal) * 0.4) + (Number(sVal) * 0.3) + (Number(aVal) * 0.3));
    });
    const avgGrade = classStudents.length > 0 ? Math.round(totalGradesSum / classStudents.length) : 0;

    return {
      name: c.name,
      studentCount: classStudents.length,
      attendanceRate: attRate,
      gradeAverage: avgGrade
    };
  });

  const explorerStudents = students.filter(s => s.classId === selectedClassExplorer);
  const studentDetails = explorerStudents.map(s => {
    const atts = attendance.filter(a => (a.student_id === s.id || a.studentId === s.id));
    const totalPresent = atts.filter(a => a.status === 'Hadir').length;
    const attRate = atts.length > 0 ? Math.round((totalPresent / atts.length) * 100) : 100;

    const fVal = grades.find(g => g.student_id === s.id && g.type === 'Formatif' && g.subject === selectedSubject)?.score || 0;
    const sVal = grades.find(g => g.student_id === s.id && g.type === 'STS' && g.subject === selectedSubject)?.score || 0;
    const aVal = grades.find(g => g.student_id === s.id && g.type === 'SAS' && g.subject === selectedSubject)?.score || 0;
    const avgG = Math.round((Number(fVal) * 0.4) + (Number(sVal) * 0.3) + (Number(aVal) * 0.3));

    return {
      name: s.name,
      nis: s.nis || '-',
      attendanceRate: attRate,
      gradeAverage: avgG
    };
  });

  const handleDownloadPDF = async () => {
    try {
      showToast('Memproses & Mengunduh Berkas PDF...', 'info');
      await downloadLaporanPDFWithPdfLib({
        totalStudents: filteredStudents.length,
        totalClasses: filteredClasses.length,
        totalJournals: journals.length,
        totalAttendance: filteredAttendance.length,
        teacherName: currentTeacher?.name,
        teacherNip: currentTeacher?.nip,
        teacherRole: currentTeacher?.role,
        classStats,
        studentDetails,
        selectedClassName: selectedClassExplorer
      });
      showToast('Berkas PDF Laporan berhasil diunduh!', 'success');
    } catch (err) {
      showToast('Gagal membuat berkas PDF', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Laporan Rekapitulasi &amp; Administrasi Kelas</h3>
          <p className="text-xs text-slate-500 font-semibold">Ringkasan serta grafik performa rombel sekolah</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-black text-rose-700 border-rose-250 hover:bg-rose-50/50 gap-1.5 rounded-xl">
          <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Detail
        </Button>
      </div>

      {/* Dynamic Filters panel */}
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-650">Subjek Nilai:</span>
            {isGuruMapel ? (
              <Badge variant="default" className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">{selectedSubject}</Badge>
            ) : (
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-650">Detail Kelas Explorer:</span>
            {lockedClass ? (
              <Badge variant="default" className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">Kelas {lockedClass}</Badge>
            ) : (
              <select
                value={selectedClassExplorer}
                onChange={e => setSelectedClassExplorer(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
              >
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </div>
        </div>
      </Card>

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
              <i className="ri-pie-chart-line text-primary" /> Kehadiran Rata-Rata Sekolah ({averageAttendanceRate}%)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-6">
            <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#12A5B8"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * averageAttendanceRate) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <text x="50" y="-45" transform="rotate(90)" fill="#1E293B" fontSize="12" fontWeight="900" textAnchor="middle" dominantBaseline="middle">
                {averageAttendanceRate}%
              </text>
            </svg>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
              <i className="ri-bar-chart-fill text-primary" /> Jumlah Siswa per Rombel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex items-end justify-between h-[180px] pt-8">
            {classStats.map((c, idx) => {
              const maxVal = Math.max(...classStats.map(s => s.studentCount), 1);
              const heightPct = (c.studentCount / maxVal) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 group">
                  <span className="text-[9px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{c.studentCount}</span>
                  <div className="w-6 bg-primary/25 rounded-t-md relative overflow-hidden h-28 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-primary rounded-t-md group-hover:bg-primary-dark transition-all duration-500 shadow-sm"
                    />
                  </div>
                  <span className="text-[9px] font-black text-slate-700">{c.name.split(' ')[1]}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Student Details Explorer Grid */}
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
            <i className="ri-table-line text-primary" /> Rincian Siswa Rombel {selectedClassExplorer}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                <TableHead className="w-12 font-black text-[10px] uppercase text-slate-400">No</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Nama Siswa</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">NIS</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Kehadiran (%)</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Rata-Rata Nilai ({selectedSubject})</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentDetails.map((s, idx) => (
                <TableRow key={idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                  <TableCell className="font-bold text-xs text-slate-400">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">{s.name}</TableCell>
                  <TableCell className="font-semibold text-xs text-slate-500">{s.nis}</TableCell>
                  <TableCell className="text-center font-black text-xs">
                    <span className={s.attendanceRate >= 75 ? 'text-emerald-600' : 'text-rose-600'}>
                      {s.attendanceRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-black text-xs">{s.gradeAverage}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={s.attendanceRate >= 75 && s.gradeAverage >= 75 ? 'success' : 'warning'}
                      className="text-[9px] font-black rounded-md px-2 py-0.5"
                    >
                      {s.attendanceRate >= 75 && s.gradeAverage >= 75 ? 'Tuntas' : 'Perlu Bimbingan'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {studentDetails.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs font-semibold">
                    Tidak ada data siswa terdaftar di rombel ini
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
