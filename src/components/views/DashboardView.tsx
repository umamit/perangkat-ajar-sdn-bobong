'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTeacherAssignedClass } from '@/lib/utils';
import { DashboardCharts } from './dashboard/DashboardCharts';
import { KepsekStats } from './dashboard/KepsekStats';

export function DashboardView() {
  const { students, classes, modules, journals, setActiveView, currentTeacher, teachers, attendance, grades } = useApp();

  const isKepsek = !!(currentTeacher?.role?.toLowerCase().includes('kepala sekolah') || currentTeacher?.role?.toLowerCase().includes('admin') || currentTeacher?.nip === '199610272019032006');

  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const totalStudents = lockedClass
    ? students.filter(s => s.classId === lockedClass).length
    : students.length;
  const totalClasses = lockedClass ? 1 : classes.length;
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
    <div className="flex flex-col gap-8 animate-fade-in text-slate-800">
      {/* Apple Liquid Glass Hero Banner */}
      <div className="relative overflow-hidden p-8 sm:p-10 text-white shadow-2xl rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary-dark border border-white/10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />
 
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-widest uppercase text-cyan-50 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SD NEGERI BOBONG &bull; KABUPATEN PULAU TALIABU</span>
          </div>
 
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            Perangkat Ajar Online &amp; Digital Learning
          </h1>
 
          <p className="text-xs sm:text-sm text-cyan-50/90 leading-relaxed font-semibold max-w-2xl">
            Platform administrasi terpadu {currentTeacher?.subject || 'Mata Pelajaran'} SD, Modul Ajar Kurikulum Merdeka, Presensi Harian, dan Jurnal Mengajar Terverifikasi Supabase.
          </p>
 
          <div className="pt-3 flex flex-wrap gap-3">
            <Button
              onClick={() => setActiveView('siswa')}
              className="bg-secondary text-slate-950 hover:bg-amber-400 font-black px-5 h-11 shadow-lg shadow-amber-500/25 text-xs rounded-xl transition-all duration-300 hover:scale-105"
            >
              <i className="ri-group-line text-base" /> Kelola Data Siswa
            </Button>
            <Button
              onClick={() => setActiveView('ai_assistant')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-black px-5 h-11 shadow-lg shadow-cyan-500/25 text-xs rounded-xl transition-all duration-300 hover:scale-105"
            >
              <i className="ri-magic-line text-base" /> AI Asisten Guru
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveView('absensi')}
              className="bg-white/15 hover:bg-white/25 border-white/20 text-white font-black px-5 h-11 backdrop-blur-md text-xs rounded-xl transition-all duration-300"
            >
              <i className="ri-checkbox-line text-base" /> Presensi Kelas
            </Button>
          </div>
        </div>
      </div>
 
      {/* Apple Liquid Glass Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Siswa */}
        <div className="glass-card group relative p-6 overflow-hidden rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Siswa</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalStudents}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-50/80 border border-cyan-100 text-primary flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-user-smile-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-extrabold text-slate-500">
            <span className="text-emerald-600 flex items-center gap-1">
              <i className="ri-checkbox-circle-fill" /> Terverifikasi
            </span>
            <span>SDN Bobong</span>
          </div>
        </div>

        {/* Card 2: Kelas Binaan */}
        <div className="glass-card group relative p-6 overflow-hidden rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Kelas Binaan</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalClasses}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-building-4-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-extrabold text-slate-500">
            <span>{lockedClass ? `Kelas ${lockedClass}` : 'Fase A, B & C'}</span>
            <span className="text-emerald-600">{totalClasses} Rombel</span>
          </div>
        </div>

        {/* Card 3: Modul Ajar SD */}
        <div className="glass-card group relative p-6 overflow-hidden rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Modul Ajar SD</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalModules}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50/80 border border-amber-100 text-amber-600 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-file-paper-2-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-extrabold text-slate-500">
            <span>Kurikulum Merdeka</span>
            <span className="text-amber-600">Lengkap</span>
          </div>
        </div>

        {/* Card 4: Jurnal Terisi */}
        <div className="glass-card group relative p-6 overflow-hidden rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Jurnal Terisi</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalJournals}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50/80 border border-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <i className="ri-book-mark-line" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-extrabold text-slate-500">
            <span>Catatan Harian</span>
            <span className="text-rose-600">Aktif</span>
          </div>
        </div>
      </div>
 
      {/* Ringkasan Statistik Grafis */}
      <DashboardCharts />
      {/* Timetable & Recent Journals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel overflow-hidden border border-white/80 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 bg-white/40 border-b border-slate-150">
            <CardTitle className="text-sm font-extrabold flex items-center gap-3 text-slate-800">
              <div className="w-8.5 h-8.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <i className="ri-calendar-check-line text-base" />
              </div>
              <span>Jadwal Mengajar Harian</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                  <TableHead className="w-20 font-black text-[10px] uppercase text-slate-400 tracking-wider">Hari</TableHead>
                  <TableHead className="w-32 font-black text-[10px] uppercase text-slate-400 tracking-wider">Waktu</TableHead>
                  <TableHead className="w-20 font-black text-[10px] uppercase text-slate-400 tracking-wider text-center">Kelas</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Materi Utama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-white/40 transition-colors border-slate-100">
                    <TableCell className="font-extrabold text-xs text-slate-800">{row.day}</TableCell>
                    <TableCell className="text-xs text-slate-500 font-semibold whitespace-nowrap">{row.time}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="font-black text-[10px] px-2 py-0.5 rounded-md">{row.classId}</Badge>
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
 
        <Card className="glass-panel overflow-hidden border border-white/80 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 bg-white/40 border-b border-slate-150">
            <CardTitle className="text-sm font-extrabold flex items-center gap-3 text-slate-800">
              <div className="w-8.5 h-8.5 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
                <i className="ri-book-read-line text-base" />
              </div>
              <span>Jurnal Mengajar Terbaru</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveView('jurnal')} className="text-xs font-black text-primary hover:bg-cyan-50/50 rounded-lg">
              Lihat Semua
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                  <TableHead className="w-28 font-black text-[10px] uppercase text-slate-400 tracking-wider">Tanggal</TableHead>
                  <TableHead className="w-20 font-black text-[10px] uppercase text-slate-400 tracking-wider text-center">Kelas</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Topik / Pembelajaran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journals.slice(0, 5).map((j, idx) => (
                  <TableRow key={idx} className="hover:bg-white/40 transition-colors border-slate-100">
                    <TableCell className="font-extrabold text-xs text-slate-800 whitespace-nowrap">{j.date}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-black text-[10px] px-2 py-0.5 rounded-md">{j.classId}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700 min-w-[220px] whitespace-normal leading-snug">
                      {j.topic}
                    </TableCell>
                  </TableRow>
                ))}
                {journals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-400 py-8 text-xs font-semibold">
                      Belum ada entri jurnal tersimpan di Supabase
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Kepsek-only: School Statistics Panel */}
      {isKepsek && (
        <KepsekStats
          teachers={teachers}
          students={students}
          classes={classes}
          journals={journals}
          attendance={attendance}
          grades={grades}
        />
      )}
    </div>
  );
}
