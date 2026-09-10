import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TeacherRoleSelectFields({ form, setForm, classes }: any) {
  return (
    <>
      <div className="space-y-1">
        <Label>Jabatan / Peran</Label>
        <Select
          value={form.role}
          onValueChange={(v: string) => setForm((f: any) => {
            let sub = f.subject;
            if (v === "Guru Kelas") sub = "Semua Mata Pelajaran (Tematik)";
            else if (v === "Guru Mata Pelajaran") sub = "Bahasa Inggris";
            else if (v === "Kepala Sekolah") sub = "Manajemen Sekolah";
            else if (v === "Tenaga Kependidikan") sub = "Administrasi Sekolah";
            return { ...f, role: v, subject: sub };
          })}
        >
          <SelectTrigger id="teacherRole" className="bg-white"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Guru Mata Pelajaran">Guru Mata Pelajaran</SelectItem>
            <SelectItem value="Guru Kelas">Guru Kelas</SelectItem>
            <SelectItem value="Kepala Sekolah">Kepala Sekolah</SelectItem>
            <SelectItem value="Tenaga Kependidikan">Tenaga Kependidikan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {form.role === "Guru Kelas" && (
        <div className="space-y-1">
          <Label htmlFor="teacherClass">Kelas Binaan (Wali Kelas) <span className="text-rose-500">*</span></Label>
          <select id="teacherClass" value={form.classId || "1A"} onChange={e => setForm((f: any) => ({ ...f, classId: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 h-10">
            {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {form.role === "Guru Mata Pelajaran" && (
        <div className="space-y-1">
          <Label htmlFor="teacherSubject">Mata Pelajaran <span className="text-rose-500">*</span></Label>
          <select id="teacherSubject" value={form.subject || "Bahasa Inggris"} onChange={e => setForm((f: any) => ({ ...f, subject: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 h-10">
            <option value="Bahasa Inggris">Bahasa Inggris</option>
            <option value="PJOK">PJOK (Pendidikan Jasmani, Olahraga & Kesehatan)</option>
            <option value="PAI">PAI (Pendidikan Agama Islam)</option>
          </select>
        </div>
      )}
    </>
  );
}
