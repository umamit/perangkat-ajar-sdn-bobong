import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getTeacherAssignedClass } from '@/lib/utils';
import { saveAttendanceToSupabase } from '@/lib/supabase';
import { addToOfflineQueue } from '@/lib/offlineSync';
import { downloadAbsensiPDF } from '@/modules/generateAbsensiPDF';
import { exportAbsensiExcel } from '@/modules/exportAbsensiExcel';

export function useAttendanceState() {
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

  useEffect(() => {
    const initialStatuses: Record<string, string> = {};
    classStudents.forEach(s => {
      const record = attendance.find(
        a => a.student_id === s.id &&
             (a.class_id || a.classId || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === normalizeClass(selectedClass) &&
             a.date === date
      );
      if (record) initialStatuses[getStatusKey(s)] = record.status;
    });
    setCurrentStatuses(initialStatuses);
  }, [selectedClass, date, attendance, students]);

  const totalClassStudents = classStudents.length;
  const currentHadir = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Hadir').length;
  const currentIzin = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Izin').length;
  const currentSakit = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Sakit').length;
  const currentAlpa = classStudents.filter(s => currentStatuses[getStatusKey(s)] === 'Alpa').length;
  const currentUnselected = classStudents.filter(s => !currentStatuses[getStatusKey(s)]).length;

  const aggregatedHistory = useMemo(() => {
    const groups: Record<string, { date: string; classId: string; hadir: number; izin: number; sakit: number; alpa: number }> = {};
    attendance.forEach(rec => {
      const cId = rec.class_id || rec.classId;
      if (!rec.date || !cId) return;
      const key = `${rec.date}_${cId}`;
      if (!groups[key]) {
        groups[key] = { date: rec.date, classId: cId, hadir: 0, izin: 0, sakit: 0, alpa: 0 };
      }
      const st = rec.status;
      if (st === 'Hadir') groups[key].hadir++;
      else if (st === 'Izin') groups[key].izin++;
      else if (st === 'Sakit') groups[key].sakit++;
      else if (st === 'Alpa') groups[key].alpa++;
    });
    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance]);

  const pctHadir = totalClassStudents > 0 ? Math.round((currentHadir / totalClassStudents) * 100) : 0;
  const pctIzin = totalClassStudents > 0 ? Math.round((currentIzin / totalClassStudents) * 100) : 0;
  const pctSakit = totalClassStudents > 0 ? Math.round((currentSakit / totalClassStudents) * 100) : 0;
  const pctAlpa = totalClassStudents > 0 ? Math.round((currentAlpa / totalClassStudents) * 100) : 0;

  const handleStatusChange = (studentId: string, status: string) => setCurrentStatuses(prev => ({ ...prev, [studentId]: status }));

  const handleMarkAllHadir = () => {
    const updated: Record<string, string> = {};
    classStudents.forEach(s => { updated[getStatusKey(s)] = 'Hadir'; });
    setCurrentStatuses(prev => ({ ...prev, ...updated }));
    showToast(`Semua ${totalClassStudents} siswa ditandai Hadir`, 'info');
  };

  const handleSaveAbsensi = async () => {
    if (classStudents.length === 0) {
      showToast('Tidak ada siswa di kelas ini', 'error');
      return;
    }
    if (currentUnselected > 0 && !confirm(`Masih ada ${currentUnselected} siswa yang belum dipilih statusnya. Tetap simpan presensi?`)) {
      return;
    }
    const supabaseRecords = classStudents
      .filter(s => currentStatuses[getStatusKey(s)])
      .map(s => ({ student_id: s.id, class_id: selectedClass, date, status: currentStatuses[getStatusKey(s)] }))
      .filter(r => r.student_id);

    const ok = await saveAttendanceToSupabase(supabaseRecords);
    const localRecords = classStudents
      .filter(s => currentStatuses[getStatusKey(s)])
      .map(s => ({ studentId: s.id, classId: selectedClass, student_id: s.id, class_id: selectedClass, date, status: currentStatuses[getStatusKey(s)] as any }));

    setAttendance(prev => [...localRecords, ...prev.filter(r => !((r.class_id === selectedClass || r.classId === selectedClass) && r.date === date))]);

    if (ok) {
      showToast(`Presensi kelas ${selectedClass} tanggal ${date} (${currentHadir} Hadir) tersimpan di Supabase Cloud!`, 'success');
    } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
      addToOfflineQueue('saveAttendance', supabaseRecords);
      showToast('Presensi disimpan secara lokal (offline) dan akan disinkronkan saat online kembali.', 'info');
    } else {
      showToast('Gagal menyimpan presensi ke Supabase Cloud', 'error');
    }
  };

  const handleDownloadPDF = async () => {
    if (classStudents.length === 0) return showToast('Tidak ada siswa di kelas ini untuk dicetak', 'error');
    try {
      showToast('Mengunduh File PDF Absensi...', 'info');
      await downloadAbsensiPDF({
        className: selectedClass, date,
        students: classStudents.map(s => ({ name: s.name, nis: s.nis, status: currentStatuses[getStatusKey(s)] || 'Belum Diisi' })),
        hadir: currentHadir, izin: currentIzin, sakit: currentSakit, alpa: currentAlpa,
        teacherName: currentTeacher?.name, teacherNip: currentTeacher?.nip, teacherRole: currentTeacher?.role,
      });
      showToast('File PDF Rekap Presensi Berhasil Diunduh!', 'success');
    } catch {
      showToast('Gagal mencetak file PDF', 'error');
    }
  };

  const handleExportExcel = () => {
    if (classStudents.length === 0) return showToast('Tidak ada siswa di kelas ini untuk diekspor', 'error');
    try {
      showToast('Mengunduh File Excel Absensi...', 'info');
      exportAbsensiExcel({
        className: selectedClass, date,
        students: classStudents.map(s => ({ name: s.name, nis: s.nis, status: currentStatuses[getStatusKey(s)] || 'Belum Diisi' })),
        hadir: currentHadir, izin: currentIzin, sakit: currentSakit, alpa: currentAlpa,
      });
      showToast('File Excel Rekap Presensi Berhasil Diunduh!', 'success');
    } catch {
      showToast('Gagal mengekspor file Excel', 'error');
    }
  };

  return {
    classes, selectedClass, setSelectedClass, lockedClass, date, setDate,
    classStudents, currentStatuses, setCurrentStatuses, getStatusKey,
    currentHadir, currentIzin, currentSakit, currentAlpa, currentUnselected,
    pctHadir, pctIzin, pctSakit, pctAlpa, aggregatedHistory,
    handleStatusChange, handleMarkAllHadir, handleSaveAbsensi,
    handleDownloadPDF, handleExportExcel,
  };
}
