'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveTeacherToSupabase } from '@/lib/supabase';

export function PengaturanView() {
  const { currentTeacher, setCurrentTeacher, showToast, syncData } = useApp();
  const [name, setName] = useState(currentTeacher.name || 'Husnita Usman, M.Pd');
  const [nip, setNip] = useState(currentTeacher.nip || '199610272019032006');
  const [role, setRole] = useState(currentTeacher.role || 'Kepala Sekolah / Executive Admin');
  const [school, setSchool] = useState(currentTeacher.school || 'SD Negeri Bobong');
  const [password, setPassword] = useState(currentTeacher.password || 'kepseksdnbobong');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(currentTeacher.avatar || '/assets/logo-sdn-bobong.png');
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setAvatar(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

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

    // Save password & profile directly to Supabase Cloud Database
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
    setIsSaving(false);

    if (success) {
      showToast('Profil & Kata Sandi Baru berhasil tersimpan ke Supabase Cloud!', 'success');
    } else {
      showToast('Profil diperbarui di sesi lokal, namun gagal terhubung ke Supabase', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Pengaturan Profil &amp; Keamanan Akun</h3>
        <p className="text-xs text-slate-500">Kelola profil pribadi, kata sandi login, foto, NIP, dan identitas sekolah</p>
      </div>

      <Card className="glass-panel border-white/80 shadow-md">
        <CardHeader className="bg-white/50 border-b border-slate-200/40">
          <CardTitle className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <i className="ri-shield-keyhole-line text-primary text-lg" />
            <span>Form Informasi Akun &amp; Keamanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={avatar}
                alt="Avatar Guru"
                className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-sm"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1">Foto Profil / Logo Guru</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-apple-sm file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700">Nama Lengkap Guru / Admin:</label>
                <Input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700">NIP Login:</label>
                <Input
                  type="text"
                  value={nip}
                  onChange={e => setNip(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700">Role / Jabatan:</label>
                <Input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700">Nama Sekolah:</label>
                <Input
                  type="text"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Change Field */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <i className="ri-lock-password-line text-primary" />
                <span>Kata Sandi Baru (Password Login):</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru"
                  className="pr-10 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base"
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Password ini akan langsung tersimpan ke Supabase Cloud dan digunakan saat login berikutnya.
              </p>
            </div>

            <Button type="submit" disabled={isSaving} className="mt-4 font-bold">
              <i className="ri-save-line" /> {isSaving ? 'Menyimpan ke Supabase...' : 'Simpan Profil & Kata Sandi'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
