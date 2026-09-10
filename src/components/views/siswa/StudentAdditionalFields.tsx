import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StudentAdditionalFields({ form, setForm, idPrefix = "student" }: any) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "Nik"} className="font-bold text-slate-600">NIK (KTP/KK)</Label>
          <Input id={idPrefix + "Nik"} value={form.nik} onChange={e => setForm((f: any) => ({ ...f, nik: e.target.value }))} placeholder="Nomor NIK" className="h-10 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "Religion"} className="font-bold text-slate-600">Agama</Label>
          <select id={idPrefix + "Religion"} value={form.religion} onChange={e => setForm((f: any) => ({ ...f, religion: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10">
            <option value="">Pilih Agama</option>
            <option value="Islam">Islam</option>
            <option value="Kristen">Kristen (Protestan)</option>
            <option value="Katolik">Katolik</option>
            <option value="Hindu">Hindu</option>
            <option value="Buddha">Buddha</option>
            <option value="Khonghucu">Khonghucu</option>
            <option value="Lainnya">Lainnya / Kepercayaan</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "ParentName"} className="font-bold text-slate-600">Nama Orang Tua</Label>
          <Input id={idPrefix + "ParentName"} value={form.parentName} onChange={e => setForm((f: any) => ({ ...f, parentName: e.target.value }))} placeholder="Nama Ayah / Ibu" className="h-10 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "ParentJob"} className="font-bold text-slate-600">Pekerjaan Orang Tua</Label>
          <select id={idPrefix + "ParentJob"} value={form.parentJob} onChange={e => setForm((f: any) => ({ ...f, parentJob: e.target.value }))} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10">
            <option value="">Pilih Pekerjaan</option>
            <option value="PNS / ASN">PNS / ASN</option>
            <option value="TNI / POLRI">TNI / POLRI</option>
            <option value="Karyawan Swasta">Karyawan Swasta</option>
            <option value="Wiraswasta / Pedagang">Wiraswasta / Pedagang</option>
            <option value="Petani / Pekebun">Petani / Pekebun</option>
            <option value="Nelayan">Nelayan</option>
            <option value="Buruh">Buruh</option>
            <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
            <option value="Tidak Bekerja">Tidak Bekerja</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "Address"} className="font-bold text-slate-600">Alamat Tempat Tinggal</Label>
          <Input id={idPrefix + "Address"} value={form.address} onChange={e => setForm((f: any) => ({ ...f, address: e.target.value }))} placeholder="Alamat" className="h-10 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idPrefix + "AdmissionYear"} className="font-bold text-slate-600">Tanggal Masuk Sekolah</Label>
          <Input id={idPrefix + "AdmissionYear"} type="date" value={form.admissionYear} onChange={e => setForm((f: any) => ({ ...f, admissionYear: e.target.value }))} className="h-10 rounded-xl text-slate-700" />
        </div>
      </div>
    </>
  );
}
