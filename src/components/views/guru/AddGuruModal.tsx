"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveTeacherToSupabase } from "@/lib/supabase";
import { TeacherAvatarPicker } from "./TeacherAvatarPicker";
import { TeacherRoleSelectFields } from "./TeacherRoleSelectFields";

const defaultForm = {
  name: "", nip: "", role: "Guru Mata Pelajaran", subject: "Bahasa Inggris", password: "sdnbobong", classId: "1A",
};

export function AddGuruModal({ open, onOpenChange, classes, onSuccess, showToast }: any) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return showToast("File harus berupa gambar", "error");
      if (file.size > 5 * 1024 * 1024) return showToast("Ukuran file maksimal 5MB", "error");
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => { setForm(defaultForm); setAvatarFile(null); setAvatarPreview(""); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.nip.trim()) return showToast("Nama dan NIP wajib diisi", "error");
    setSaving(true);
    try {
      let avatarUrl = "/assets/logo-sdn-bobong.png";
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("nip", form.nip.trim());
        const uploadRes = await fetch("/api/upload/avatar", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) avatarUrl = uploadData.url;
      }

      const isGuruKelas = form.role === "Guru Kelas";
      const newTeacher = {
        nip: form.nip.trim(), name: form.name.trim(), role: form.role,
        subject: isGuruKelas ? ("Guru Kelas " + (form.classId || "1A")) : form.subject.trim(),
        password: form.password.trim() || "sdnbobong", avatar_url: avatarUrl,
      };

      if (await saveTeacherToSupabase(newTeacher)) {
        onSuccess(newTeacher);
        showToast("Data guru " + newTeacher.name + " berhasil ditambahkan", "success");
        onOpenChange(false); resetForm();
      } else {
        showToast("Gagal menyimpan data guru ke Supabase Cloud", "error");
      }
    } catch { showToast("Terjadi kesalahan saat menyimpan", "error"); }
    finally { setSaving(false); }
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
          <TeacherAvatarPicker avatarPreview={avatarPreview} avatarFile={avatarFile} handleAvatarChange={handleAvatarChange} />
          <div className="space-y-1">
            <Label htmlFor="teacherName">Nama Lengkap <span className="text-rose-500">*</span></Label>
            <Input id="teacherName" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama lengkap guru" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="teacherNip">NIP <span className="text-rose-500">*</span></Label>
            <Input id="teacherNip" value={form.nip} onChange={e => setForm(f => ({ ...f, nip: e.target.value }))} placeholder="Nomor Induk Pegawai" required />
          </div>
          <TeacherRoleSelectFields form={form} setForm={setForm} classes={classes} />
          <div className="space-y-1">
            <Label htmlFor="teacherPassword">Password Login</Label>
            <Input id="teacherPassword" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Password untuk login" />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>Batal</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <><i className="ri-loader-4-line animate-spin" /> Menyimpan...</> : <><i className="ri-save-line" /> Simpan</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
