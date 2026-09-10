'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { saveTeacherToSupabase, uploadAvatarToSupabaseStorage } from '@/lib/supabase';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTeacher: any;
  avatar: string;
  setAvatar: (url: string) => void;
  setCurrentTeacher: (teacher: any) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  syncData: () => Promise<void>;
}

export function AvatarUploadModal({
  isOpen,
  onClose,
  currentTeacher,
  avatar,
  setAvatar,
  setCurrentTeacher,
  showToast,
  syncData,
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(avatar);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveAvatar = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    showToast('Mengunggah foto profil ke Supabase...', 'info');
    try {
      const url = await uploadAvatarToSupabaseStorage(selectedFile, currentTeacher.nip);
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
        avatar_url: url,
      });
      await syncData();

      showToast('Foto profil berhasil diperbarui!', 'success');
      onClose();
    } catch (err) {
      showToast('Gagal memperbarui foto profil.', 'error');
    }
    setIsUploading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 text-slate-800 border-none shadow-2xl">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="text-sm font-black flex items-center gap-2">
            <i className="ri-image-edit-line text-primary" /> Perbarui Foto Profil
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-50 flex items-center justify-center shadow-inner relative group">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>

          <div className="w-full text-center">
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
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
            onClick={onClose}
            className="text-xs font-bold rounded-xl h-9"
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isUploading || !selectedFile}
            onClick={handleSaveAvatar}
            className="text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 rounded-xl gap-1 h-9 shadow-sm"
          >
            {isUploading ? <i className="ri-refresh-line animate-spin" /> : <i className="ri-checkbox-circle-line" />}
            Simpan Foto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
