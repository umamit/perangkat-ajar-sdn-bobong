'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { INITIAL_DATA } from '@/data';

export function DashboardView() {
  const { students, classes, modules, journals, setActiveView } = useApp();

  const totalStudents = students.length > 0 ? students.length : (INITIAL_DATA.students?.length || 0);
  const totalClasses = classes.length > 0 ? classes.length : (INITIAL_DATA.classes?.length || 0);
  const totalModules = modules.length > 0 ? modules.length : (INITIAL_DATA.modules?.length || 0);
  const totalJournals = journals.length > 0 ? journals.length : (INITIAL_DATA.journals?.length || 0);

  const timetable = [
    { day: 'Senin', time: '07.30 - 08.40', classId: '1A', topic: 'Unit 1: Greetings & Expressions' },
    { day: 'Senin', time: '09.00 - 10.10', classId: '4A', topic: 'Unit 1: What Are You Doing?' },
    { day: 'Selasa', time: '07.30 - 08.40', classId: '2A', topic: 'Unit 1: My Family & Pets' },
    { day: 'Rabu', time: '08.40 - 09.50', classId: '5A', topic: 'Unit 2: Tastes & Favorite Foods' },
    { day: 'Kamis', time: '09.00 - 10.10', classId: '6A', topic: 'Unit 2: Past Events & History' },
    { day: 'Jumat', time: '08.00 - 09.10', classId: '3A', topic: 'Unit 1: Animals Around Us' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner with Modern Gradient Mesh */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-cyan-900 via-teal-800 to-slate-900 text-white shadow-2xl border border-cyan-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold tracking-wide uppercase text-cyan-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SD NEGERI BOBONG &bull; KABUPATEN PULAU TALIABU</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            Perangkat Ajar Online &amp; Digital Learning
          </h1>

          <p className="text-sm sm:text-base text-cyan-100/90 leading-relaxed font-medium max-w-2xl">
            Platform administrasi terpadu Bahasa Inggris SD, Modul Ajar Kurikulum Merdeka, Presensi Harian, dan Jurnal Mengajar Terverifikasi Supabase.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              onClick={() => setActiveView('siswa')}
              className="bg-secondary text-slate-950 hover:bg-amber-400 font-extrabold px-5 h-11 shadow-lg shadow-amber-500/20 text-sm"
            >
              <i className="ri-group-line text-lg" /> Kelola Data Siswa
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveView('absensi')}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold px-5 h-11 backdrop-blur-sm text-sm"
            >
              <i className="ri-checkbox-line text-lg" /> Presensi Kelas
            </Button>
          </div>
        </div>
      </div>

      {/* Modern High-End Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Siswa */}
        <div className="group relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Siswa</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalStudents}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 text-primary flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-user-smile-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="text-emerald-600 flex items-center gap-1">
              <i className="ri-checkbox-circle-fill" /> Terverifikasi
            </span>
            <span>SDN Bobong</span>
          </div>
        </div>

        {/* Card 2: Kelas Binaan */}
        <div className="group relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Kelas Binaan</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalClasses}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-building-4-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Fase A, B &amp; C</span>
            <span className="text-emerald-600">12 Rombel</span>
          </div>
        </div>

        {/* Card 3: Modul Ajar SD */}
        <div className="group relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Modul Ajar SD</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalModules}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-file-paper-2-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Kurikulum Merdeka</span>
            <span className="text-amber-600 font-bold">Lengkap</span>
          </div>
        </div>

        {/* Card 4: Jurnal Terisi */}
        <div className="group relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Jurnal Terisi</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalJournals}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-book-mark-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Catatan Harian</span>
            <span className="text-rose-600 font-bold">Aktif</span>
          </div>
        </div>
      </div>

      {/* Timetable & Recent Journals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 bg-slate-50/60 border-b border-slate-100">
            <CardTitle className="text-base font-bold flex items-center gap-2.5 text-slate-800">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <i className="ri-calendar-check-line text-lg" />
              </div>
              <span>Jadwal Mengajar Harian</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Materi Utama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50/80">
                    <TableCell className="font-bold text-xs text-slate-800">{row.day}</TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium">{row.time}</TableCell>
                    <TableCell><Badge variant="default" className="font-extrabold">{row.classId}</Badge></TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700">{row.topic}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 bg-slate-50/60 border-b border-slate-100">
            <CardTitle className="text-base font-bold flex items-center gap-2.5 text-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <i className="ri-book-read-line text-lg" />
              </div>
              <span>Jurnal Mengajar Terbaru</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveView('jurnal')} className="text-xs font-bold text-primary">
              Lihat Semua
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Topik / Pembelajaran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(journals.length > 0 ? journals : (INITIAL_DATA.journals || [])).slice(0, 5).map((j, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50/80">
                    <TableCell className="font-bold text-xs text-slate-800">{j.date}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-extrabold">{j.classId}</Badge></TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700">{j.topic}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
