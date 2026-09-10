import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StudentPersonalFields({ form, setForm, classes, birthPlace, birthDate, handlePlaceChange, handleDateChange, idPrefix = "student" }: any) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={idPrefix + "Name"} className="font-bold text-slate-600">Nama Lengkap Siswa</Label>
        <Input id={idPrefix + "Name"} value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="Masukkan nama lengkap siswa" required className="h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "Nis"} className="font-bold text-slate-600">NIS</Label>
          <Input id={idPrefix + "Nis"} value={form.nis} onChange={e => setForm((f: any) => ({ ...f, nis: e.target.value }))} placeholder="NIS" className="h-10 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "Nisn"} className="font-bold text-slate-600">NISN</Label>
          <Input id={idPrefix + "Nisn"} value={form.nisn} onChange={e => setForm((f: any) => ({ ...f, nisn: e.target.value }))} placeholder="NISN" className="h-10 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "Class"} className="font-bold text-slate-600">Kelas</Label>
          <select id={idPrefix + "Class"} value={form.classId} onChange={e => setForm((f: any) => ({ ...f, classId: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10">
            {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "Gender"} className="font-bold text-slate-600">Jenis Kelamin</Label>
          <select id={idPrefix + "Gender"} value={form.gender} onChange={e => setForm((f: any) => ({ ...f, gender: e.target.value as "L" | "P" }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10">
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "BirthPlace"} className="font-bold text-slate-600">Tempat Lahir</Label>
          <Input id={idPrefix + "BirthPlace"} value={birthPlace} onChange={e => handlePlaceChange(e.target.value)} placeholder="Contoh: Bobong" className="h-10 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "BirthDate"} className="font-bold text-slate-600">Tanggal Lahir</Label>
          <Input id={idPrefix + "BirthDate"} type="date" value={birthDate} onChange={e => handleDateChange(e.target.value)} className="h-10 rounded-xl text-slate-700" />
        </div>
      </div>
    </>
  );
}
