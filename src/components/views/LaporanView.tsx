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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Laporan Rekapitulasi Perangkat Ajar &amp; Presensi</h3>
          <p className="text-xs text-slate-500">Ringkasan administrasi pembelajaran SD Negeri Bobong</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="font-bold gap-2">
          <i className="ri-file-pdf-2-line text-rose-600 text-base" /> Unduh Berkas PDF (pdf-lib)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <i className="ri-pie-chart-line text-primary" /> Statistik Pembelajaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 font-semibold">
              <span className="text-slate-600">Total Siswa Terdaftar:</span>
              <span className="text-slate-900 font-extrabold">{students.length} Orang</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 font-semibold">
              <span className="text-slate-600">Total Kelas Binaan:</span>
              <span className="text-slate-900 font-extrabold">{classes.length} Kelas</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 font-semibold">
              <span className="text-slate-600">Total Jurnal Mengajar Terisi:</span>
              <span className="text-slate-900 font-extrabold">{journals.length} Entri</span>
            </div>
            <div className="flex justify-between py-2 font-semibold">
              <span className="text-slate-600">Total Presensi Tersimpan:</span>
              <span className="text-slate-900 font-extrabold">{attendance.length} Sesi</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <i className="ri-shield-check-line text-emerald-600" /> Verifikasi Kepala Sekolah
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-slate-500 leading-relaxed">
              Seluruh data jurnal mengajar, presensi harian, modul ajar, dan nilai siswa telah terverifikasi dan disinkronkan secara realtime dengan Supabase Cloud.
            </p>
            <div className="p-4 bg-slate-50 rounded-apple-md border border-slate-200/80">
              <p className="font-bold text-slate-800">Status Administrasi: <span className="text-emerald-600 font-extrabold">TERAKREDITASI SANGAT BAIK</span></p>
              <p className="text-slate-400 text-[11px] mt-1">SD Negeri Bobong - Kabupaten Pulau Taliabu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
