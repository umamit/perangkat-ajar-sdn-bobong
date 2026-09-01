'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { saveAttendanceToSupabase } from '@/lib/supabase';
import { addToOfflineQueue } from '@/lib/offlineSync';
import { downloadAbsensiPDF } from '@/modules/generateAbsensiPDF';
import { exportAbsensiExcel } from '@/modules/exportAbsensiExcel';
import { RiwayatPresensiCard } from './absensi/RiwayatPresensiCard';
import { StatCards } from './absensi/StatCards';
import { AttendanceTable } from './absensi/AttendanceTable';

import { getTeacherAssignedClass } from '@/lib/utils';
import { AttendanceAiAnalyst } from './absensi/AttendanceAiAnalyst';

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

  const getStatusKey = (s: any) => (s.id || s.nis || '');

  // Load existing attendance status when selectedClass or date changes
  React.useEffect(() => {
    const initialStatuses: Record<string, string> = {};
    classStudents.forEach(s => {
      const record = attendance.find(
        a => a.student_id === s.id && 
             (a.class_id || a.classId || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === normalizeClass(selectedClass) && 
             a.date === date
      );
      if (record) {
        initialStatuses[getStatusKey(s)] = record.status;
      }
    });
    setCurrentStatuses(initialStatuses);
  }, [selectedClass, date, attendance, students]);

  const totalClassStudents = classStudents.length;

  const currentHadir = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Hadir').length;
  const currentIzin = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Izin').length;
  const currentSakit = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Sakit').length;
  const currentAlpa = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Alpa').length;
  const currentUnselected = classStudents.filter(s => !currentStatuses[getStatusKey(s)]).length;

  // Group raw student attendance records by date and class_id to generate history
  const aggregatedHistory = React.useMemo(() => {
    const groups: Record<string, { date: string; classId: string; hadir: number; izin: number; sakit: number; alpa: number }> = {};
    
    attendance.forEach(rec => {
      const cId = rec.class_id || rec.classId;
      if (!rec.date || !cId) return;
      
      const key = `${rec.date}_${cId}`;
      if (!groups[key]) {
        groups[key] = {
          date: rec.date,
          classId: cId,
          hadir: 0,
          izin: 0,
          sakit: 0,
          alpa: 0
        };
      }
      
      const status = rec.status;
      if (status === 'Hadir') groups[key].hadir++;
      else if (status === 'Izin') groups[key].izin++;
      else if (status === 'Sakit') groups[key].sakit++;
      else if (status === 'Alpa') groups[key].alpa++;
    });
    
    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance]);

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

    const ok = await saveAttendanceToSupabase(supabaseRecords);

    // Apply state updates locally immediately for offline usability
    const localRecords = classStudents
      .filter(s => currentStatuses[getStatusKey(s)])
      .map(s => ({
        studentId: s.id,
        classId: selectedClass,
        student_id: s.id,
        class_id: selectedClass,
        date: date,
        status: currentStatuses[getStatusKey(s)] as 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'
      }));

    setAttendance(prev => {
      const filtered = prev.filter(r => !((r.class_id === selectedClass || r.classId === selectedClass) && r.date === date));
      return [...localRecords, ...filtered];
    });

    if (ok) {
      showToast(`Presensi kelas ${selectedClass} tanggal ${date} (${currentHadir} Hadir) tersimpan di Supabase Cloud!`, 'success');
    } else {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        addToOfflineQueue('saveAttendance', supabaseRecords);
        showToast('Presensi disimpan secara lokal (offline) dan akan disinkronkan saat online kembali.', 'info');
      } else {
        showToast('Gagal menyimpan presensi ke Supabase Cloud', 'error');
      }
    }
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
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Presensi &amp; Rekapitulasi Kehadiran Siswa</h3>
          <p className="text-xs text-slate-500 font-semibold">Pencatatan presensi harian per kelas dan kalkulasi persentase kehadiran</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-black bg-emerald-50/80 backdrop-blur-sm text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100/80 shadow-xs gap-1.5 rounded-xl">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-black bg-rose-50/80 backdrop-blur-sm text-rose-700 border border-rose-200/60 hover:bg-rose-100/80 shadow-xs gap-1.5 rounded-xl">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Absensi
          </Button>
          <Button variant="outline" size="sm" onClick={handleMarkAllHadir} className="text-xs font-black bg-teal-50/80 backdrop-blur-sm text-teal-700 border border-teal-200/60 hover:bg-teal-100/80 shadow-xs gap-1.5 rounded-xl">
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
 
      <AttendanceAiAnalyst selectedClass={selectedClass} />
 
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-sm font-extrabold flex items-center gap-2">
            <i className="ri-edit-line text-primary" /> Input Presensi Kelas
          </CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Pilih Kelas:</label>
              {lockedClass ? (
                <div className="h-9 flex items-center">
                  <Badge variant="default" className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    Kelas {lockedClass} (Binaan)
                  </Badge>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={e => {
                      setSelectedClass(e.target.value);
                      setCurrentStatuses({});
                    }}
                    className="w-full h-9 rounded-apple-md border border-slate-200/80 bg-white/70 backdrop-blur-md px-3 pr-8 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer shadow-xs transition-all"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-base" />
                </div>
              )}
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Tanggal Presensi:</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveAbsensi} className="w-full h-9 text-xs font-black rounded-xl bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 gap-1">
                <i className="ri-save-line text-sm" /> Simpan Presensi Hari Ini
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AttendanceTable
            classStudents={classStudents}
            currentStatuses={currentStatuses}
            getStatusKey={getStatusKey}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
 
      <RiwayatPresensiCard attendance={aggregatedHistory} />
    </div>
  );
}
