'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { deleteTeacherFromSupabase, saveTeacherToSupabase } from '@/lib/supabase';

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

export function GuruView() {
  const { teachers, setTeachers, showToast, syncData, classes } = useApp();
  const [showModal, setShowModal] = useState(false);
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

  const handleDelete = async (nip: string, name: string) => {
    if (confirm(`Hapus data guru ${name}?`)) {
      setTeachers(prev => prev.filter(t => t.nip !== nip));
      await deleteTeacherFromSupabase(nip);
      await syncData();
      showToast(`Data guru ${name} berhasil dihapus permanen dari Supabase Cloud`, 'info');
    }
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
        setTeachers(prev => [...prev, {
          nip: newTeacher.nip,
          name: newTeacher.name,
          role: newTeacher.role,
          subject: newTeacher.subject,
          password: newTeacher.password,
          avatar: newTeacher.avatar_url,
        }]);
        showToast(`Data guru ${newTeacher.name} berhasil ditambahkan`, 'success');
        setShowModal(false);
        resetForm();
        await syncData();
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Kelola Data Guru &amp; Tenaga Pendidik</h3>
          <p className="text-xs text-slate-500">Daftar tenaga pendidik terdaftar di Supabase Cloud</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <i className="ri-user-add-line" /> Tambah Data Guru
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Foto</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Jabatan / Peran</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead className="text-center w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((t, idx) => (
                <TableRow key={t.nip || idx} className="hover:bg-slate-50/80">
                  <TableCell>
                    <img
                      src={t.avatar || '/assets/logo-sdn-bobong.png'}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  </TableCell>
                  <TableCell className="font-bold text-xs">{t.nip}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">{t.name}</TableCell>
                  <TableCell><Badge variant="default" className="font-extrabold">{t.role || 'Guru'}</Badge></TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">{t.subject || '-'}</TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleDelete(t.nip, t.name)}
                      className="p-1.5 rounded-apple-sm text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                      title="Hapus Guru"
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs font-medium">
                    Belum ada data guru di Supabase Cloud
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tambah Guru */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="ri-user-add-line text-primary" /> Tambah Data Guru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Upload Avatar Area */}
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
                  if (v === 'Guru Kelas') {
                    sub = 'Semua Mata Pelajaran (Tematik)';
                  } else if (v === 'Guru Mata Pelajaran') {
                    sub = 'Bahasa Inggris';
                  } else if (v === 'Kepala Sekolah') {
                    sub = 'Manajemen Sekolah';
                  } else if (v === 'Tenaga Kependidikan') {
                    sub = 'Administrasi Sekolah';
                  }
                  return {
                    ...f,
                    role: v,
                    subject: sub
                  };
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
            {form.role === 'Guru Kelas' && (
              <div className="space-y-1">
                <Label>Mata Pelajaran</Label>
                <Input
                  value="Semua Mata Pelajaran (Tematik)"
                  disabled
                  className="bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed text-xs font-semibold h-10"
                />
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

            {form.role !== 'Guru Kelas' && form.role !== 'Guru Mata Pelajaran' && (
              <div className="space-y-1">
                <Label htmlFor="teacherSubject">Fokus Tugas / Subjek</Label>
                <Input
                  id="teacherSubject"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Contoh: Manajemen Sekolah"
                  className="bg-white text-xs font-semibold h-10"
                />
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm(); }}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <><i className="ri-loader-4-line animate-spin" /> Menyimpan...</> : <><i className="ri-save-line" /> Simpan</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
