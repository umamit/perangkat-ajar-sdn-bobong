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

  const classStudents = students.filter(s => s.classId === selectedClass);

  const handleStatusChange = (studentId: string, status: string) => {
    setCurrentStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAbsensi = () => {
    if (classStudents.length === 0) {
      showToast('Tidak ada siswa di kelas ini', 'error');
      return;
    }

    const counts = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0 };
    classStudents.forEach(s => {
      const st = currentStatuses[s.id] || 'Hadir';
      counts[st as keyof typeof counts] = (counts[st as keyof typeof counts] || 0) + 1;
    });

    const newEntry = {
      date,
      classId: selectedClass,
      hadir: counts.Hadir,
      izin: counts.Izin,
      sakit: counts.Sakit,
      alpa: counts.Alpa
    };

    setAttendance(prev => [newEntry, ...prev]);
    showToast(`Presensi kelas ${selectedClass} tanggal ${date} berhasil disimpan!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Presensi & Absensi Siswa Harian</h3>
        <p className="text-xs text-slate-500">Pencatatan presensi siswa harian per kelas dan riwayat absensi</p>
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
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full h-9 rounded-apple-sm border border-slate-300 bg-white px-3 text-xs font-medium outline-none"
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
                className="w-full h-9 rounded-apple-sm border border-slate-300 bg-white px-3 text-xs font-medium outline-none"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveAbsensi} className="w-full h-9 text-xs">
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
                <TableHead className="text-center">Status Presensi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((s, idx) => {
                const currentSt = currentStatuses[s.id] || 'Hadir';
                return (
                  <TableRow key={s.id || idx}>
                    <TableCell className="font-semibold text-xs text-slate-500">{idx + 1}</TableCell>
                    <TableCell className="font-bold text-slate-800 text-xs">{s.name}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-1.5">
                        {['Hadir', 'Izin', 'Sakit', 'Alpa'].map(status => {
                          const active = currentSt === status;
                          const activeClass =
                            status === 'Hadir'
                              ? 'bg-emerald-600 text-white'
                              : status === 'Izin'
                              ? 'bg-amber-500 text-white'
                              : status === 'Sakit'
                              ? 'bg-orange-500 text-white'
                              : 'bg-rose-600 text-white';

                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(s.id, status)}
                              className={`px-3 py-1 rounded-apple-sm text-xs font-bold transition-all ${
                                active ? activeClass : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {classStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-400 py-8 text-xs">
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
                <TableRow key={idx}>
                  <TableCell className="font-bold text-xs">{r.date}</TableCell>
                  <TableCell><Badge variant="default">{r.classId}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="success">{r.hadir || 0}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="warning">{r.izin || 0}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="secondary">{r.sakit || 0}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="danger">{r.alpa || 0}</Badge></TableCell>
                </TableRow>
              ))}
              {attendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-6 text-xs">
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
