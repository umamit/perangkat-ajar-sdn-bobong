'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveSchoolSettingsToSupabase } from '@/lib/supabase';
import { addToOfflineQueue } from '@/lib/offlineSync';

export function SchoolSettingsCard() {
  const { schoolSettings, setSchoolSettings, showToast, syncData } = useApp();
  const [schoolName, setSchoolName] = useState(schoolSettings.school_name || 'SD Negeri Bobong');
  const [npsn, setNpsn] = useState(schoolSettings.npsn || '60101234');
  const [academicYear, setAcademicYear] = useState(schoolSettings.academic_year || '2026/2027');
  const [semester, setSemester] = useState(schoolSettings.semester || 'Ganjil');
  const [headmasterName, setHeadmasterName] = useState(schoolSettings.headmaster_name || 'Husnita Usman, M.Pd');
  const [headmasterNip, setHeadmasterNip] = useState(schoolSettings.headmaster_nip || '199610272019032006');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedSettings = {
      id: 'global',
      school_name: schoolName.trim(),
      npsn: npsn.trim(),
      academic_year: academicYear.trim(),
      semester,
      headmaster_name: headmasterName.trim(),
      headmaster_nip: headmasterNip.trim()
    };

    setSchoolSettings(updatedSettings);

    const success = await saveSchoolSettingsToSupabase(updatedSettings);
    if (success) {
      showToast('Pengaturan Sekolah berhasil disimpan ke Supabase Cloud!', 'success');
      await syncData();
    } else {
      addToOfflineQueue('saveSchoolSettings', updatedSettings);
      showToast('Koneksi lambat, pengaturan disimpan offline.', 'info');
    }
    setIsSaving(false);
  };

  return (
    <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
        <CardTitle className="text-xs font-black text-slate-800 flex items-center gap-2">
          <i className="ri-building-line text-secondary text-base" />
          <span>Pengaturan Sekolah &amp; Akademik (Kepala Sekolah)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 text-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <Label className="font-bold text-slate-600">Nama Sekolah:</Label>
              <Input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>
            <div className="space-y-1 text-left">
              <Label className="font-bold text-slate-600">NPSN Sekolah:</Label>
              <Input
                type="text"
                value={npsn}
                onChange={e => setNpsn(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <Label className="font-bold text-slate-600">Tahun Ajaran:</Label>
              <Input
                type="text"
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>
            <div className="space-y-1 text-left">
              <Label className="font-bold text-slate-600">Semester Aktif:</Label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-xs"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <Label className="font-bold text-slate-600">Nama Kepala Sekolah:</Label>
              <Input
                type="text"
                value={headmasterName}
                onChange={e => setHeadmasterName(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>
            <div className="space-y-1 text-left">
              <Label className="font-bold text-slate-600">NIP Kepala Sekolah:</Label>
              <Input
                type="text"
                value={headmasterNip}
                onChange={e => setHeadmasterNip(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSaving} className="font-black text-[11px] h-9 rounded-xl bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 gap-1 shadow-sm">
            <i className="ri-save-line" /> {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Sekolah'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
