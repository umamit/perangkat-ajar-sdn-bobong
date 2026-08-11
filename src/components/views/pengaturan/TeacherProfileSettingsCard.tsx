'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveTeacherToSupabase, uploadAvatarToSupabaseStorage } from '@/lib/supabase';

export function TeacherProfileSettingsCard() {
  const { currentTeacher, setCurrentTeacher, showToast, syncData } = useApp();
  const [name, setName] = useState(currentTeacher.name || 'Husnita Usman, M.Pd');
  const [nip, setNip] = useState(currentTeacher.nip || '199610272019032006');
  const [role, setRole] = useState(currentTeacher.role || 'Kepala Sekolah / Executive Admin');
  const [school, setSchool] = useState(currentTeacher.school || 'SD Negeri Bobong');
  const [password, setPassword] = useState(currentTeacher.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(currentTeacher.avatar || '/assets/logo-sdn-bobong.png');
  const [oldPassword, setOldPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('Mengunggah foto profil...', 'info');
      try {
        const url = await uploadAvatarToSupabaseStorage(file, nip);
        setAvatar(url);
        showToast('Foto profil berhasil diunggah ke Supabase Cloud!', 'success');
      } catch (err) {
        showToast('Gagal mengunggah foto profil', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const isPasswordChanging = password !== currentTeacher.password;
    if (isPasswordChanging && oldPassword !== currentTeacher.password) {
      showToast('Kata sandi lama salah! Perubahan ditolak.', 'error');
      setIsSaving(false);
      return;
    }

    const updated = {
      ...currentTeacher,
      name,
      nip,
      role,
      school,
      password,
      avatar
    };

    setCurrentTeacher(updated);

    try {
      localStorage.setItem('sdn_bobong_teacher', JSON.stringify(updated));
    } catch (err) {}

    const supabasePayload = {
      nip: nip.trim(),
      name: name.trim(),
      role: role.trim(),
      subject: currentTeacher.subject || 'Bahasa Inggris & Manajemen Sekolah',
      password: password.trim(),
      avatar_url: avatar
    };

    const success = await saveTeacherToSupabase(supabasePayload);
    await syncData();
    setOldPassword('');
    setIsSaving(false);

    if (success) {
      showToast('Profil & Kata Sandi Baru berhasil tersimpan!', 'success');
    } else {
      showToast('Profil diperbarui secara lokal (offline).', 'info');
    }
  };

  return (
    <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
        <CardTitle className="text-xs font-black text-slate-800 flex items-center gap-2">
          <i className="ri-shield-keyhole-line text-primary text-base" />
          <span>Form Informasi Akun &amp; Keamanan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 text-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100/50">
            <img
              src={avatar}
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <div className="space-y-1">
              <h4 className="text-[11px] font-black text-slate-700">Foto Profil / Logo Guru</h4>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-[10px] text-slate-500 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-black file:bg-primary/5 file:text-primary hover:file:bg-primary/10 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="font-bold text-slate-650">Nama Lengkap Guru / Admin:</label>
              <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="font-bold text-slate-650">NIP Login:</label>
              <Input
                type="text"
                value={nip}
                onChange={e => setNip(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="font-bold text-slate-650">Role / Jabatan:</label>
              <Input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="font-bold text-slate-650">Nama Sekolah:</label>
              <Input
                type="text"
                value={school}
                onChange={e => setSchool(e.target.value)}
                required
                className="h-9 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="space-y-1 text-left font-semibold">
              <label className="font-bold text-slate-800 flex items-center gap-1">
                <i className="ri-key-line text-slate-500" />
                <span>Kata Sandi Lama (Verifikasi):</span>
              </label>
              <Input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="Masukkan sandi lama"
                className="font-mono h-9 rounded-xl"
                required={password !== currentTeacher.password}
              />
            </div>

            <div className="space-y-1 text-left font-semibold">
              <label className="font-bold text-slate-800 flex items-center gap-1">
                <i className="ri-lock-password-line text-primary" />
                <span>Kata Sandi Baru:</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Sandi baru"
                  className="pr-10 font-mono h-9 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSaving} className="mt-2 font-black text-[11px] h-9 rounded-xl bg-primary hover:bg-primary-dark text-white gap-1 shadow-sm">
            <i className="ri-save-line" /> {isSaving ? 'Menyimpan...' : 'Simpan Profil & Kata Sandi'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
