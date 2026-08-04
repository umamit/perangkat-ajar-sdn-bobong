'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PengaturanView() {
  const { currentTeacher, setCurrentTeacher, showToast } = useApp();
  const [name, setName] = useState(currentTeacher.name || 'Guru Bahasa Inggris');
  const [nip, setNip] = useState(currentTeacher.nip || '199610272019032006');
  const [role, setRole] = useState(currentTeacher.role || 'Guru Mata Pelajaran');
  const [school, setSchool] = useState(currentTeacher.school || 'SD Negeri Bobong');
  const [avatar, setAvatar] = useState(currentTeacher.avatar || '/assets/logo-sdn-bobong.png');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentTeacher,
      name,
      nip,
      role,
      school,
      avatar
    };
    setCurrentTeacher(updated);
    showToast('Pengaturan profil guru & sekolah berhasil disimpan!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Pengaturan Profil Guru & Sekolah</h3>
        <p className="text-xs text-slate-500">Kelola profil pribadi, foto, NIP, dan identitas sekolah</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Form Informasi Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={avatar}
                alt="Avatar Guru"
                className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-sm"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1">Foto Profil Guru</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-apple-sm file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap Guru:</label>
              <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">NIP Guru:</label>
              <Input
                type="text"
                value={nip}
                onChange={e => setNip(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Role / Jabatan:</label>
              <Input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Sekolah:</label>
              <Input
                type="text"
                value={school}
                onChange={e => setSchool(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="mt-4">
              <i className="ri-save-line" /> Simpan Pengaturan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
