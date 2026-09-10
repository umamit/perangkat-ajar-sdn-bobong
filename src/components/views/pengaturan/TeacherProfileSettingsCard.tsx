"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveTeacherToSupabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AvatarUploadModal } from "./AvatarUploadModal";
import { PasswordFields } from "./PasswordFields";

const profileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  nip: z.string().min(3, "NIP minimal 3 karakter"),
  role: z.string().min(3, "Role/Jabatan minimal 3 karakter"),
  school: z.string().min(3, "Nama sekolah minimal 3 karakter"),
  oldPassword: z.string().optional(),
  password: z.string().min(6, "Kata sandi minimal 6 karakter")
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function TeacherProfileSettingsCard() {
  const { currentTeacher, setCurrentTeacher, showToast, syncData } = useApp();
  const [avatar, setAvatar] = useState(currentTeacher.avatar || "/assets/logo-sdn-bobong.png");
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentTeacher.name || "", nip: currentTeacher.nip || "", role: currentTeacher.role || "",
      school: currentTeacher.school || "", oldPassword: "", password: currentTeacher.password || ""
    }
  });

  const onSubmitForm = async (data: ProfileFormValues) => {
    setIsSaving(true);
    if (data.password !== currentTeacher.password && data.oldPassword !== currentTeacher.password) {
      showToast("Kata sandi lama salah! Perubahan ditolak.", "error");
      setIsSaving(false); return;
    }
    const updated = { ...currentTeacher, ...data, avatar };
    setCurrentTeacher(updated);
    try { localStorage.setItem("sdn_bobong_teacher", JSON.stringify(updated)); } catch {}

    const payload = {
      nip: data.nip.trim(), name: data.name.trim(), role: data.role.trim(),
      subject: currentTeacher.subject || "Bahasa Inggris & Manajemen Sekolah",
      password: data.password.trim(), avatar_url: avatar
    };
    const success = await saveTeacherToSupabase(payload);
    await syncData();
    reset({ ...data, oldPassword: "" });
    setIsSaving(false);
    if (success) showToast("Profil & Kata Sandi Baru berhasil tersimpan!", "success");
    else showToast("Profil diperbarui secara lokal (offline).", "info");
  };

  return (
    <>
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-xs font-black text-slate-800 flex items-center gap-2">
            <i className="ri-shield-keyhole-line text-primary text-base" />
            <span>Form Informasi Akun & Keamanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 text-xs">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100/50">
              <div onClick={() => setShowAvatarModal(true)} className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer group border-2 border-primary/20 shadow-md transition-all hover:scale-105" title="Klik untuk mengubah foto profil">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
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
                <label className="font-bold text-slate-600">Nama Lengkap Guru / Admin:</label>
                <Input type="text" {...register("name")} className="h-9 rounded-xl" />
                {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.name.message}</p>}
              </div>
              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-600">NIP Login:</label>
                <Input type="text" {...register("nip")} disabled={currentTeacher?.nip !== "199610272019032006"} className="h-9 rounded-xl bg-slate-50 disabled:opacity-80" />
                {errors.nip && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.nip.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-600">Role / Jabatan:</label>
                <Input type="text" {...register("role")} disabled={currentTeacher?.nip !== "199610272019032006"} className="h-9 rounded-xl bg-slate-50 disabled:opacity-80" />
                {errors.role && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.role.message}</p>}
              </div>
              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-600">Nama Sekolah:</label>
                <Input type="text" {...register("school")} className="h-9 rounded-xl" />
                {errors.school && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.school.message}</p>}
              </div>
            </div>

            <PasswordFields register={register} errors={errors} />

            <Button type="submit" disabled={isSaving} className="mt-2 font-black text-[11px] h-9 rounded-xl bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 gap-1">
              <i className="ri-save-line" /> {isSaving ? "Menyimpan..." : "Simpan Profil & Kata Sandi"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AvatarUploadModal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} currentTeacher={currentTeacher} avatar={avatar} setAvatar={setAvatar} setCurrentTeacher={setCurrentTeacher} showToast={showToast} syncData={syncData} />
    </>
  );
}
