'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeacherProfileSettingsCard } from './pengaturan/TeacherProfileSettingsCard';
import { SchoolSettingsCard } from './pengaturan/SchoolSettingsCard';
import { backupSystemData } from '@/modules/backupSystemData';

export function PengaturanView() {
  const { currentTeacher, students, classes, teachers, journals, attendance, modules, showToast } = useApp();

  const isKepsek = currentTeacher?.nip === '199610272019032006';

  const handleBackup = () => {
    try {
      showToast('Membuat berkas cadangan data...', 'info');
      backupSystemData({
        students,
        classes,
        teachers,
        journals,
        attendance,
        modules,
      });
      showToast('Cadangan Data Sistem Berhasil Diunduh!', 'success');
    } catch (err) {
      showToast('Gagal membuat cadangan data', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl text-slate-800">
      <div>
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Pengaturan Profil &amp; Keamanan Akun</h3>
        <p className="text-xs text-slate-500 font-semibold">Kelola profil pribadi, kata sandi login, foto, NIP, dan identitas sekolah</p>
      </div>

      <TeacherProfileSettingsCard />

      {isKepsek && <SchoolSettingsCard />}

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-xs font-black text-slate-800 flex items-center gap-2">
            <i className="ri-database-2-line text-emerald-600 text-base" />
            <span>Pencadangan Data Sekolah (Backup System)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-3 text-xs">
          <p className="text-slate-600 leading-relaxed font-semibold">
            Unduh seluruh berkas cadangan data siswa, presensi, jurnal mengajar, dan modul ajar SD Negeri Bobong ke dalam format file `.json` untuk penyimpanan arsip aman.
          </p>
          <Button onClick={handleBackup} variant="outline" className="text-[11px] font-black rounded-xl border-emerald-250 text-emerald-700 hover:bg-emerald-50/50 gap-1">
            <i className="ri-download-cloud-2-line text-sm text-emerald-600" /> Unduh Cadangan Data Sistem (.json)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
