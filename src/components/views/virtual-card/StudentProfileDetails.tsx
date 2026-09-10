import React from "react";

export function StudentProfileDetails({ s }: any) {
  return (
    <div className="flex-1 space-y-4 text-left">
      <div>
        <span className="text-[9px] font-black text-primary tracking-wider uppercase">Data Induk Profil Lengkap</span>
        <h3 className="text-xl font-black text-slate-800 leading-tight truncate">{s.name}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">NISN</span>
          <span className="text-slate-800">{s.nisn || "-"}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">NIK</span>
          <span className="text-slate-800">{s.nik || "-"}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Tempat, Tgl Lahir</span>
          <span className="text-slate-800">{s.birthInfo || "-"}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Agama</span>
          <span className="text-slate-800">{s.religion || "-"}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Nama Orang Tua / Wali</span>
          <span className="text-slate-800">{s.parentName || "-"}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Pekerjaan Orang Tua</span>
          <span className="text-slate-800">{s.parentJob || "-"}</span>
        </div>
        <div className="col-span-2 space-y-1">
          <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Alamat Tempat Tinggal</span>
          <span className="block text-slate-600 font-medium leading-relaxed">{s.address || "-"}</span>
        </div>
      </div>
    </div>
  );
}
