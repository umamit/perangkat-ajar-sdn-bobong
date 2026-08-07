'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { downloadLaporanPDFWithPdfLib } from '@/modules/generatePDFLib';

export function LaporanView() {
  const { students, classes, journals, attendance, currentTeacher, showToast } = useApp();

  const handleDownloadPDF = async () => {
    try {
      showToast('Memproses & Mengunduh Berkas PDF...', 'info');
      await downloadLaporanPDFWithPdfLib({
        totalStudents: students.length,
        totalClasses: classes.length,
        totalJournals: journals.length,
        totalAttendance: attendance.length,
        headmasterName: currentTeacher?.name,
        headmasterNip: currentTeacher?.nip
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
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Laporan Rekapitulasi Perangkat Ajar &amp; Presensi</h3>
          <p className="text-xs text-slate-500 font-semibold">Ringkasan administrasi pembelajaran SD Negeri Bobong</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-black text-rose-700 border-rose-250 hover:bg-rose-50/50 gap-1.5 rounded-xl">
          <i className="ri-file-pdf-2-line text-sm" /> Unduh Berkas PDF
        </Button>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
              <i className="ri-pie-chart-line text-primary" /> Statistik Pembelajaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs pt-4">
            <div className="flex justify-between py-2 border-b border-slate-100 font-bold">
              <span className="text-slate-500">Total Siswa Terdaftar:</span>
              <span className="text-slate-800 font-black">{students.length} Orang</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 font-bold">
              <span className="text-slate-500">Total Kelas Binaan:</span>
              <span className="text-slate-800 font-black">{classes.length} Kelas</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 font-bold">
              <span className="text-slate-500">Total Jurnal Mengajar Terisi:</span>
              <span className="text-slate-800 font-black">{journals.length} Entri</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span className="text-slate-500">Total Presensi Tersimpan:</span>
              <span className="text-slate-800 font-black">{attendance.length} Sesi</span>
            </div>
          </CardContent>
        </Card>
 
        <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
              <i className="ri-shield-check-line text-emerald-600" /> Verifikasi Kepala Sekolah
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs pt-4">
            <p className="text-slate-500 leading-relaxed font-semibold">
              Seluruh data jurnal mengajar, presensi harian, modul ajar, dan nilai siswa telah terverifikasi dan disinkronkan secara realtime dengan Supabase Cloud.
            </p>
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <p className="font-black text-slate-850">Status Administrasi: <span className="text-emerald-600 font-black">TERAKREDITASI SANGAT BAIK</span></p>
              <p className="text-slate-400 text-[10px] font-bold mt-1">SD Negeri Bobong - Kabupaten Pulau Taliabu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
