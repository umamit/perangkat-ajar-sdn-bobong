'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function AbsensiView() {
  const { students, classes, attendance, setAttendance, showToast } = useApp();
  const [selectedClass, setSelectedClass] = useState('1A');
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

  const handleSaveAbsensi = () => {
    if (classStudents.length === 0) {
      showToast('Tidak ada siswa di kelas ini', 'error');
      return;
    }

    if (currentUnselected > 0) {
      if (!confirm(`Masih ada ${currentUnselected} siswa yang belum dipilih statusnya. Tetap simpan presensi?`)) {
        return;
      }
    }

    const newEntry = {
      date,
      classId: selectedClass,
      hadir: currentHadir,
      izin: currentIzin,
      sakit: currentSakit,
      alpa: currentAlpa
    };

    setAttendance(prev => [newEntry, ...prev]);
    showToast(`Presensi kelas ${selectedClass} tanggal ${date} (${currentHadir} Hadir) berhasil disimpan!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Presensi &amp; Rekapitulasi Kehadiran Siswa</h3>
          <p className="text-xs text-slate-500">Pencatatan presensi harian per kelas dan kalkulasi persentase kehadiran</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllHadir} className="text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50">
          <i className="ri-checkbox-multiple-line" /> Tandai Semua Hadir
        </Button>
      </div>

      {/* Attendance Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">Hadir</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-emerald-900">{currentHadir}</span>
            <span className="text-xs font-bold text-emerald-700">({pctHadir}%)</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-[11px] font-bold text-amber-700 uppercase block">Izin</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-amber-900">{currentIzin}</span>
            <span className="text-xs font-bold text-amber-700">({pctIzin}%)</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200">
          <span className="text-[11px] font-bold text-orange-700 uppercase block">Sakit</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-orange-900">{currentSakit}</span>
            <span className="text-xs font-bold text-orange-700">({pctSakit}%)</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
          <span className="text-[11px] font-bold text-rose-700 uppercase block">Alpa</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-rose-900">{currentAlpa}</span>
            <span className="text-xs font-bold text-rose-700">({pctAlpa}%)</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Belum Diisi</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-slate-700">{currentUnselected}</span>
            <span className="text-xs font-bold text-slate-500">Siswa</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <i className="ri-edit-line text-primary" /> Input Presensi Kelas
          </CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Pilih Kelas:</label>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Riwayat Presensi Harian</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead className="text-center">Hadir</TableHead>
                <TableHead className="text-center">Izin</TableHead>
                <TableHead className="text-center">Sakit</TableHead>
                <TableHead className="text-center">Alpa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((r, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50/80">
                  <TableCell className="font-bold text-xs">{r.date}</TableCell>
                  <TableCell><Badge variant="default" className="font-extrabold">{r.classId}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="success">{r.hadir || 0}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="warning">{r.izin || 0}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="secondary">{r.sakit || 0}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="danger">{r.alpa || 0}</Badge></TableCell>
                </TableRow>
              ))}
              {attendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-6 text-xs font-medium">
                    Belum ada riwayat presensi tersimpan
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
