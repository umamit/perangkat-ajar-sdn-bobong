'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveTeacherToSupabase } from '@/lib/supabase';

interface TeacherForm {
  name: string;
  nip: string;
  role: string;
  subject: string;
  password: string;
  classId?: string;
}

const defaultForm: TeacherForm = {
  name: '',
  nip: '',
  role: 'Guru Mata Pelajaran',
  subject: 'Bahasa Inggris',
  password: 'sdnbobong',
  classId: '1A',
};

interface AddGuruModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: Array<{ id: string; name: string }>;
  onSuccess: (newTeacher: any) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function AddGuruModal({ open, onOpenChange, classes, onSuccess, showToast }: AddGuruModalProps) {
  const [form, setForm] = useState<TeacherForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('File harus berupa gambar', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB', 'error');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.nip.trim()) {
      showToast('Nama dan NIP wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      let avatarUrl = '/assets/logo-sdn-bobong.png';
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('nip', form.nip.trim());

        const uploadRes = await fetch('/api/upload/avatar', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          avatarUrl = uploadData.url;
        } else {
          showToast(uploadData.error || 'Gagal mengunggah foto avatar, menggunakan default', 'info');
        }
      }

      const isGuruKelas = form.role === 'Guru Kelas';
      const newTeacher = {
        nip: form.nip.trim(),
        name: form.name.trim(),
        role: form.role,
        subject: isGuruKelas ? `Guru Kelas ${form.classId || '1A'}` : form.subject.trim(),
        password: form.password.trim() || 'sdnbobong',
        avatar_url: avatarUrl,
      };

      const ok = await saveTeacherToSupabase(newTeacher);
      if (ok) {
        onSuccess(newTeacher);
        showToast(`Data guru ${newTeacher.name} berhasil ditambahkan`, 'success');
        onOpenChange(false);
        resetForm();
      } else {
        showToast('Gagal menyimpan data guru ke Supabase Cloud', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-5 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ri-user-add-line text-primary" /> Tambah Data Guru
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-50 transition-all hover:border-primary/85">
              <img
                src={avatarPreview || '/assets/logo-sdn-bobong.png'}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <i className="ri-camera-switch-line text-white text-lg" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              {avatarFile ? avatarFile.name : 'Pilih Foto Profil Guru'}
            </span>
          </div>

          <div className="space-y-1">
            <Label htmlFor="teacherName">Nama Lengkap <span className="text-rose-500">*</span></Label>
            <Input
              id="teacherName"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nama lengkap guru"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="teacherNip">NIP <span className="text-rose-500">*</span></Label>
            <Input
              id="teacherNip"
              value={form.nip}
              onChange={e => setForm(f => ({ ...f, nip: e.target.value }))}
              placeholder="Nomor Induk Pegawai"
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Jabatan / Peran</Label>
            <Select
              value={form.role}
              onValueChange={(v: string) => setForm(f => {
                let sub = f.subject;
                if (v === 'Guru Kelas') sub = 'Semua Mata Pelajaran (Tematik)';
                else if (v === 'Guru Mata Pelajaran') sub = 'Bahasa Inggris';
                else if (v === 'Kepala Sekolah') sub = 'Manajemen Sekolah';
                else if (v === 'Tenaga Kependidikan') sub = 'Administrasi Sekolah';
                return { ...f, role: v, subject: sub };
              })}
            >
              <SelectTrigger id="teacherRole" className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Guru Mata Pelajaran">Guru Mata Pelajaran</SelectItem>
                <SelectItem value="Guru Kelas">Guru Kelas</SelectItem>
                <SelectItem value="Kepala Sekolah">Kepala Sekolah</SelectItem>
                <SelectItem value="Tenaga Kependidikan">Tenaga Kependidikan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.role === 'Guru Kelas' && (
            <div className="space-y-1">
              <Label htmlFor="teacherClass">Kelas Binaan (Wali Kelas) <span className="text-rose-500">*</span></Label>
              <select
                id="teacherClass"
                value={form.classId || '1A'}
                onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 h-10"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {form.role === 'Guru Mata Pelajaran' && (
            <div className="space-y-1">
              <Label htmlFor="teacherSubject">Mata Pelajaran <span className="text-rose-500">*</span></Label>
              <select
                id="teacherSubject"
                value={form.subject || 'Bahasa Inggris'}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 h-10"
              >
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="PJOK">PJOK (Pendidikan Jasmani, Olahraga & Kesehatan)</option>
                <option value="PAI">PAI (Pendidikan Agama Islam)</option>
              </select>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="teacherPassword">Password Login</Label>
            <Input
              id="teacherPassword"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Password untuk login"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <><i className="ri-loader-4-line animate-spin" /> Menyimpan...</> : <><i className="ri-save-line" /> Simpan</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
