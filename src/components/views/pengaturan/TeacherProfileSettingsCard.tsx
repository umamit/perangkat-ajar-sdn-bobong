'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { saveTeacherToSupabase, uploadAvatarToSupabaseStorage } from '@/lib/supabase';

export function TeacherProfileSettingsCard() {
  const { currentTeacher, setCurrentTeacher, showToast, syncData } = useApp();
  
  // Profile settings states
  const [name, setName] = useState(currentTeacher.name || 'Husnita Usman, M.Pd');
  const [nip, setNip] = useState(currentTeacher.nip || '199610272019032006');
  const [role, setRole] = useState(currentTeacher.role || 'Kepala Sekolah / Executive Admin');
  const [school, setSchool] = useState(currentTeacher.school || 'SD Negeri Bobong');
  const [password, setPassword] = useState(currentTeacher.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(currentTeacher.avatar || '/assets/logo-sdn-bobong.png');
  const [oldPassword, setOldPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Avatar Modal states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(avatar);
  const [isUploading, setIsUploading] = useState(false);

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
    <>
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-xs font-black text-slate-800 flex items-center gap-2">
            <i className="ri-shield-keyhole-line text-primary text-base" />
            <span>Form Informasi Akun &amp; Keamanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 text-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Profile Photo Section */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100/50">
              <div
                onClick={() => {
                  setPreviewUrl(avatar);
                  setSelectedFile(null);
                  setShowAvatarModal(true);
                }}
                className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer group border-2 border-primary/20 shadow-md transition-all hover:scale-105"
                title="Klik untuk mengubah foto profil"
              >
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="ri-camera-switch-line text-base" />
                  <span className="text-[7px] font-black uppercase tracking-wider mt-0.5">Ubah</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-black text-slate-700">Foto Profil / Logo Guru</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Klik gambar profil di atas untuk mengubah foto secara instan</p>
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

      {/* Avatar Change Modal */}
      {showAvatarModal && (
        <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
          <DialogContent className="max-w-xs sm:max-w-md bg-white rounded-3xl p-6 border border-slate-150">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <DialogTitle className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <i className="ri-image-edit-line text-primary" />
                Ubah Foto Profil
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/20 shadow-md">
                <img
                  src={previewUrl}
                  alt="Preview Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full text-center">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] sm:text-xs font-bold text-slate-700 cursor-pointer transition-all">
                  <i className="ri-upload-2-line" /> Pilih File Gambar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {selectedFile && (
                  <p className="text-[9px] text-slate-500 font-bold mt-1.5 truncate max-w-xs mx-auto">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAvatarModal(false)}
                className="text-xs font-bold rounded-xl h-9"
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isUploading || !selectedFile}
                onClick={async () => {
                  if (!selectedFile) return;
                  setIsUploading(true);
                  showToast('Mengunggah foto profil ke Supabase...', 'info');
                  try {
                    const url = await uploadAvatarToSupabaseStorage(selectedFile, nip);
                    setAvatar(url);
                    
                    const updated = { ...currentTeacher, avatar: url };
                    setCurrentTeacher(updated);
                    localStorage.setItem('sdn_bobong_teacher', JSON.stringify(updated));
                    
                    await saveTeacherToSupabase({
                      nip: currentTeacher.nip,
                      name: currentTeacher.name,
                      role: currentTeacher.role,
                      subject: currentTeacher.subject || 'Bahasa Inggris',
                      password: currentTeacher.password,
                      avatar_url: url
                    });
                    await syncData();

                    showToast('Foto profil berhasil diperbarui!', 'success');
                    setShowAvatarModal(false);
                  } catch (err) {
                    showToast('Gagal memperbarui foto profil.', 'error');
                  }
                  setIsUploading(false);
                }}
                className="text-xs font-black bg-primary hover:bg-primary-dark text-white rounded-xl gap-1 h-9 shadow-sm"
              >
                {isUploading ? <i className="ri-refresh-line animate-spin" /> : <i className="ri-checkbox-circle-line" />}
                Simpan Foto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
