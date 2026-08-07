'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { saveAttendanceToSupabase } from '@/lib/supabase';
import { downloadAbsensiPDF } from '@/modules/generateAbsensiPDF';
import { exportAbsensiExcel } from '@/modules/exportAbsensiExcel';
import { RiwayatPresensiCard } from './absensi/RiwayatPresensiCard';
import { StatCards } from './absensi/StatCards';

import { getTeacherAssignedClass } from '@/lib/utils';

export function AbsensiView() {
  const { students, classes, attendance, setAttendance, currentTeacher, showToast } = useApp();
  
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const [selectedClassState, setSelectedClassState] = useState(lockedClass || '1A');
  
  const selectedClass = lockedClass || selectedClassState;
  const setSelectedClass = lockedClass ? () => {} : setSelectedClassState;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentStatuses, setCurrentStatuses] = useState<Record<string, string>>({});

  const normalizeClass = (c: string) => (c ? c.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '');

  const classStudents = students.filter(
    s => normalizeClass(s.classId) === normalizeClass(selectedClass) || s.classId === selectedClass
  );

  const totalClassStudents = classStudents.length;

  const getStatusKey = (s: any) => (s.id || s.nis || '');

  const currentHadir = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Hadir').length;
  const currentIzin = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Izin').length;
  const currentSakit = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Sakit').length;
  const currentAlpa = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Alpa').length;
  const currentUnselected = classStudents.filter(s => !currentStatuses[getStatusKey(s)]).length;

  const pctHadir = totalClassStudents > 0 ? Math.round((currentHadir / totalClassStudents) * 100) : 0;
  const pctIzin = totalClassStudents > 0 ? Math.round((currentIzin / totalClassStudents) * 100) : 0;
  const pctSakit = totalClassStudents > 0 ? Math.round((currentSakit / totalClassStudents) * 100) : 0;
  const pctAlpa = totalClassStudents > 0 ? Math.round((currentAlpa / totalClassStudents) * 100) : 0;

  const handleStatusChange = (studentId: string, status: string) => {
    setCurrentStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllHadir = () => {
    const updated: Record<string, string> = {};
    classStudents.forEach(s => {
      updated[getStatusKey(s)] = 'Hadir';
    });
    setCurrentStatuses(prev => ({ ...prev, ...updated }));
    showToast(`Semua ${totalClassStudents} siswa ditandai Hadir`, 'info');
  };

  const handleSaveAbsensi = async () => {
    if (classStudents.length === 0) {
      showToast('Tidak ada siswa di kelas ini', 'error');
      return;
    }

    if (currentUnselected > 0) {
      if (!confirm(`Masih ada ${currentUnselected} siswa yang belum dipilih statusnya. Tetap simpan presensi?`)) {
        return;
      }
    }

    const supabaseRecords = classStudents
      .filter(s => currentStatuses[getStatusKey(s)])
      .map(s => ({
        student_id: s.id,
        class_id: selectedClass,
        date: date,
        status: currentStatuses[getStatusKey(s)]
      }))
      .filter(r => r.student_id);

    await saveAttendanceToSupabase(supabaseRecords);

    const newEntry = {
      date,
      classId: selectedClass,
      hadir: currentHadir,
      izin: currentIzin,
      sakit: currentSakit,
      alpa: currentAlpa
    };

    setAttendance(prev => [newEntry, ...prev]);
    showToast(`Presensi kelas ${selectedClass} tanggal ${date} (${currentHadir} Hadir) tersimpan di Supabase Cloud!`, 'success');
  };

  const handleDownloadPDF = async () => {
    if (classStudents.length === 0) {
      showToast('Tidak ada siswa di kelas ini untuk dicetak', 'error');
      return;
    }
    try {
      showToast('Memproses & Mengunduh Berkas PDF Absensi...', 'info');
      await downloadAbsensiPDF({
        className: selectedClass,
        date,
        students: classStudents.map(s => ({
          name: s.name,
          nis: s.nis,
          status: currentStatuses[getStatusKey(s)] || 'Alpa',
        })),
        hadir: currentHadir,
        izin: currentIzin,
        sakit: currentSakit,
        alpa: currentAlpa,
        teacherName: currentTeacher?.name,
        teacherNip: currentTeacher?.nip,
        teacherRole: currentTeacher?.role,
      });
      showToast('PDF Rekap Presensi Berhasil Diunduh!', 'success');
    } catch (err) {
      showToast('Gagal mencetak PDF Absensi', 'error');
    }
  };

  const handleExportExcel = () => {
    if (classStudents.length === 0) {
      showToast('Tidak ada siswa di kelas ini untuk diekspor', 'error');
      return;
    }
    try {
      showToast('Mengunduh File Excel Absensi...', 'info');
      exportAbsensiExcel({
        className: selectedClass,
        date,
        students: classStudents.map(s => ({
          name: s.name,
          nis: s.nis,
          status: currentStatuses[getStatusKey(s)] || 'Belum Diisi',
        })),
        hadir: currentHadir,
        izin: currentIzin,
        sakit: currentSakit,
        alpa: currentAlpa,
      });
      showToast('File Excel Rekap Presensi Berhasil Diunduh!', 'success');
    } catch (err) {
      showToast('Gagal mengekspor file Excel', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Presensi &amp; Rekapitulasi Kehadiran Siswa</h3>
          <p className="text-xs text-slate-500">Pencatatan presensi harian per kelas dan kalkulasi persentase kehadiran</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1.5">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50 gap-1.5">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Absensi
          </Button>
          <Button variant="outline" size="sm" onClick={handleMarkAllHadir} className="text-xs font-bold text-teal-700 border-teal-300 hover:bg-teal-50 gap-1.5">
            <i className="ri-checkbox-multiple-line text-sm" /> Tandai Semua Hadir
          </Button>
        </div>
      </div>

      {/* Attendance Summary Stat Cards */}
      <StatCards
        currentHadir={currentHadir} pctHadir={pctHadir}
        currentIzin={currentIzin} pctIzin={pctIzin}
        currentSakit={currentSakit} pctSakit={pctSakit}
        currentAlpa={currentAlpa} pctAlpa={pctAlpa}
        currentUnselected={currentUnselected}
      />

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <i className="ri-edit-line text-primary" /> Input Presensi Kelas
          </CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Pilih Kelas:</label>
              {lockedClass ? (
                <div className="h-9 flex items-center">
                  <Badge variant="default" className="text-xs font-extrabold px-3 py-1.5 bg-primary/10 text-primary border border-primary/20">
                    Kelas {lockedClass} (Binaan)
                  </Badge>
                </div>
              ) : (
                <select
                  value={selectedClass}
                  onChange={e => {
                    setSelectedClass(e.target.value);
                    setCurrentStatuses({});
                  }}
                  className="w-full h-9 rounded-apple-sm border border-slate-300 bg-white px-3 text-xs font-semibold outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Presensi:</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full h-9 rounded-apple-sm border border-slate-300 bg-white px-3 text-xs font-semibold outline-none"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveAbsensi} className="w-full h-9 text-xs font-bold">
                <i className="ri-save-line" /> Simpan Presensi Hari Ini
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead className="text-center">Pilihan Status Presensi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((s, idx) => {
                const sKey = getStatusKey(s);
                const currentSt = currentStatuses[sKey] || null;
                return (
                  <TableRow key={s.id || idx} className="hover:bg-slate-50/80">
                    <TableCell className="font-semibold text-xs text-slate-500">{idx + 1}</TableCell>
                    <TableCell className="font-bold text-slate-800 text-xs">
                      {s.name}
                      <div className="text-[10px] text-slate-400 font-normal">NIS: {s.nis || '-'}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-1.5">
                        {['Hadir', 'Izin', 'Sakit', 'Alpa'].map(status => {
                          const active = currentSt === status;
                          const activeClass =
                            status === 'Hadir'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : status === 'Izin'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : status === 'Sakit'
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-rose-600 text-white shadow-sm';

                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(sKey, status)}
                              className={`px-3 py-1 rounded-apple-sm text-xs font-bold transition-all ${
                                active ? activeClass : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200/60'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                        {!currentSt && (
                          <span className="text-[10px] text-slate-400 italic ml-2">
                            (Belum Dipilih)
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {classStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-400 py-8 text-xs font-medium">
                    Belum ada siswa di kelas ini
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RiwayatPresensiCard attendance={attendance} />
    </div>
  );
}
