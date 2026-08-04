'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DashboardView() {
  const { students, classes, modules, journals, setActiveView } = useApp();

  const timetable = [
    { day: 'Senin', time: '07.30 - 08.40', classId: '1A', topic: 'Unit 1: Greetings' },
    { day: 'Senin', time: '09.00 - 10.10', classId: '4A', topic: 'Unit 1: What Are You Doing?' },
    { day: 'Selasa', time: '07.30 - 08.40', classId: '2A', topic: 'Unit 1: My Family' },
    { day: 'Rabu', time: '08.40 - 09.50', classId: '5A', topic: 'Unit 2: Tastes & Foods' },
    { day: 'Kamis', time: '09.00 - 10.10', classId: '6A', topic: 'Unit 2: Past Events' },
    { day: 'Jumat', time: '08.00 - 09.10', classId: '3A', topic: 'Unit 1: Animals Around Us' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="hero-banner p-6 rounded-apple-xl bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg">
        <span className="hero-badge inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          SD NEGERI BOBONG - KAB. PULAU TALIABU
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Selamat Datang!</h1>
        <p className="text-sm opacity-90 max-w-2xl leading-relaxed">
          Kelola Perangkat Ajar Bahasa Inggris SD, Modul Ajar Kurikulum Merdeka, Flashcards Interaktif, Presensi, dan Jurnal Mengajar Harian secara praktis.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-apple-md bg-cyan-100 text-primary-dark flex items-center justify-center text-2xl font-bold">
              <i className="ri-user-smile-line" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-800">{students.length}</h4>
              <p className="text-xs font-semibold text-slate-500">Total Siswa</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-apple-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
              <i className="ri-building-4-line" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-800">{classes.length}</h4>
              <p className="text-xs font-semibold text-slate-500">Kelas Binaan</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-apple-md bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
              <i className="ri-file-paper-2-line" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-800">{modules.length}</h4>
              <p className="text-xs font-semibold text-slate-500">Modul Ajar SD</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-apple-md bg-rose-100 text-rose-700 flex items-center justify-center text-2xl font-bold">
              <i className="ri-book-mark-line" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-800">{journals.length}</h4>
              <p className="text-xs font-semibold text-slate-500">Jurnal Terisi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timetable & Recent Journals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <i className="ri-calendar-check-line text-primary text-xl" /> Jadwal Mengajar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Materi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-xs">{row.day}</TableCell>
                    <TableCell className="text-xs text-slate-500">{row.time}</TableCell>
                    <TableCell><Badge variant="default">{row.classId}</Badge></TableCell>
                    <TableCell className="text-xs font-medium">{row.topic}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <i className="ri-book-read-line text-primary text-xl" /> Jurnal Mengajar Terbaru
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveView('jurnal')} className="text-xs">
              Lihat Semua
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Materi / Topik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journals.slice(0, 5).map((j, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-xs">{j.date}</TableCell>
                    <TableCell><Badge variant="secondary">{j.classId}</Badge></TableCell>
                    <TableCell className="text-xs">{j.topic}</TableCell>
                  </TableRow>
                ))}
                {journals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-400 py-6 text-xs">
                      Belum ada data jurnal
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
