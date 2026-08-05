'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DashboardView() {
  const { students, classes, modules, journals, setActiveView } = useApp();

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalModules = modules.length;
  const totalJournals = journals.length;

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
      {/* Apple Liquid Glass Hero Banner */}
      <div className="glass-hero relative overflow-hidden p-8 sm:p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-extrabold tracking-wide uppercase text-cyan-100 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>SD NEGERI BOBONG &bull; KABUPATEN PULAU TALIABU</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            Perangkat Ajar Online &amp; Digital Learning
          </h1>

          <p className="text-sm sm:text-base text-cyan-50/95 leading-relaxed font-medium max-w-2xl">
            Platform administrasi terpadu Bahasa Inggris SD, Modul Ajar Kurikulum Merdeka, Presensi Harian, dan Jurnal Mengajar Terverifikasi Supabase.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              onClick={() => setActiveView('siswa')}
              className="bg-secondary text-slate-950 hover:bg-amber-400 font-extrabold px-5 h-11 shadow-lg shadow-amber-500/25 text-sm rounded-xl transition-all duration-300 hover:scale-105"
            >
              <i className="ri-group-line text-lg" /> Kelola Data Siswa
            </Button>
            <Button
              onClick={() => setActiveView('ai_assistant')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold px-5 h-11 shadow-lg shadow-cyan-500/25 text-sm rounded-xl transition-all duration-300 hover:scale-105"
            >
              <i className="ri-sparkles-line text-lg" /> AI Asisten Guru
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveView('absensi')}
              className="bg-white/15 hover:bg-white/25 border-white/30 text-white font-bold px-5 h-11 backdrop-blur-md text-sm rounded-xl transition-all duration-300"
            >
              <i className="ri-checkbox-line text-lg" /> Presensi Kelas
            </Button>
          </div>
        </div>
      </div>

      {/* Apple Liquid Glass Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Siswa */}
        <div className="glass-card group relative p-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Total Siswa</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalStudents}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-50/80 border border-cyan-200/80 text-primary flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-user-smile-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <i className="ri-checkbox-circle-fill" /> Terverifikasi
            </span>
            <span>SDN Bobong</span>
          </div>
        </div>

        {/* Card 2: Kelas Binaan */}
        <div className="glass-card group relative p-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Kelas Binaan</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalClasses}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-building-4-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Fase A, B &amp; C</span>
            <span className="text-emerald-600 font-bold">{totalClasses} Rombel</span>
          </div>
        </div>

        {/* Card 3: Modul Ajar SD */}
        <div className="glass-card group relative p-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Modul Ajar SD</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalModules}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-file-paper-2-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Kurikulum Merdeka</span>
            <span className="text-amber-600 font-bold">Lengkap</span>
          </div>
        </div>

        {/* Card 4: Jurnal Terisi */}
        <div className="glass-card group relative p-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Jurnal Terisi</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalJournals}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-rose-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-book-mark-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Catatan Harian</span>
            <span className="text-rose-600 font-bold">Aktif</span>
          </div>
        </div>
      </div>

      {/* Timetable & Recent Journals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel overflow-hidden border border-white/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 bg-white/50 border-b border-slate-200/40">
            <CardTitle className="text-base font-extrabold flex items-center gap-3 text-slate-800">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <i className="ri-calendar-check-line text-lg" />
              </div>
              <span>Jadwal Mengajar Harian</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-20 font-bold text-xs">Hari</TableHead>
                  <TableHead className="w-32 font-bold text-xs">Waktu</TableHead>
                  <TableHead className="w-20 font-bold text-xs text-center">Kelas</TableHead>
                  <TableHead className="font-bold text-xs">Materi Utama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-white/70 transition-colors">
                    <TableCell className="font-extrabold text-xs text-slate-800">{row.day}</TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium whitespace-nowrap">{row.time}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="font-extrabold px-2.5 py-0.5">{row.classId}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700 min-w-[220px] whitespace-normal leading-snug">
                      {row.topic}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-panel overflow-hidden border border-white/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 bg-white/50 border-b border-slate-200/40">
            <CardTitle className="text-base font-extrabold flex items-center gap-3 text-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
                <i className="ri-book-read-line text-lg" />
              </div>
              <span>Jurnal Mengajar Terbaru</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveView('jurnal')} className="text-xs font-extrabold text-primary hover:bg-cyan-50">
              Lihat Semua
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-28 font-bold text-xs">Tanggal</TableHead>
                  <TableHead className="w-20 font-bold text-xs text-center">Kelas</TableHead>
                  <TableHead className="font-bold text-xs">Topik / Pembelajaran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journals.slice(0, 5).map((j, idx) => (
                  <TableRow key={idx} className="hover:bg-white/70 transition-colors">
                    <TableCell className="font-extrabold text-xs text-slate-800 whitespace-nowrap">{j.date}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-extrabold px-2.5 py-0.5">{j.classId}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700 min-w-[220px] whitespace-normal leading-snug">
                      {j.topic}
                    </TableCell>
                  </TableRow>
                ))}
                {journals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-400 py-8 text-xs font-medium">
                      Belum ada entri jurnal tersimpan di Supabase
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
