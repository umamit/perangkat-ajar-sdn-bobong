import React from "react";
import { StudentRaporData } from "@/types/erapor";

interface EraporSheetViewProps {
  rapor: StudentRaporData;
  onUpdateNotes: (note: string) => void;
}

export function EraporSheetView({ rapor, onUpdateNotes }: EraporSheetViewProps) {
  const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-6 text-slate-800">
      <div className="flex items-center justify-between border-b-4 border-double border-slate-800 pb-4 gap-4">
        <img src="/assets/logo-kab-taliabu.png" alt="Logo Kabupaten" className="w-14 h-14 object-contain hidden sm:block" />
        <div className="text-center flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Pemerintah Kabupaten Pulau Taliabu</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Dinas Pendidikan</p>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 mt-0.5">{rapor.schoolName}</h2>
          <p className="text-[10px] italic text-slate-500 mt-0.5">{rapor.schoolAddress}</p>
        </div>
        <img src="/assets/logo-sdn-bobong.png" alt="Logo Sekolah" className="w-14 h-14 object-contain rounded-full hidden sm:block" />
      </div>

      <h3 className="text-sm font-black uppercase tracking-wide text-center text-slate-900">
        LAPORAN HASIL BELAJAR (RAPOR) PESERTA DIDIK
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
        <div className="flex"><span className="w-36 text-slate-500 font-semibold">Nama Peserta Didik</span><span className="font-black text-slate-900">: {rapor.name}</span></div>
        <div className="flex"><span className="w-32 text-slate-500 font-semibold">Kelas</span><span className="font-bold text-slate-800">: {rapor.className}</span></div>
        <div className="flex"><span className="w-36 text-slate-500 font-semibold">NIS / NISN</span><span className="font-bold text-slate-800">: {rapor.nis} / {rapor.nisn}</span></div>
        <div className="flex"><span className="w-32 text-slate-500 font-semibold">Fase</span><span className="font-bold text-slate-800">: {rapor.phase}</span></div>
        <div className="flex"><span className="w-36 text-slate-500 font-semibold">Sekolah</span><span className="font-bold text-slate-800">: {rapor.schoolName}</span></div>
        <div className="flex"><span className="w-32 text-slate-500 font-semibold">Semester</span><span className="font-bold text-slate-800">: {rapor.semester}</span></div>
        <div className="flex"><span className="w-36 text-slate-500 font-semibold">NPSN</span><span className="font-bold text-slate-800">: {rapor.npsn}</span></div>
        <div className="flex"><span className="w-32 text-slate-500 font-semibold">Tahun Pelajaran</span><span className="font-bold text-slate-800">: {rapor.academicYear}</span></div>
      </div>

      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-300">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-primary text-white font-black text-left">
              <th className="p-2.5 w-10 text-center border-r border-white/20">No</th>
              <th className="p-2.5 w-52 border-r border-white/20">Mata Pelajaran</th>
              <th className="p-2.5 w-24 text-center border-r border-white/20">Nilai Akhir</th>
              <th className="p-2.5">Capaian Kompetensi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rapor.subjects.map((sub) => (
              <tr key={sub.no} className="even:bg-slate-50/60">
                <td className="p-2.5 text-center font-bold text-slate-500 border-r border-slate-200">{sub.no}</td>
                <td className="p-2.5 font-extrabold text-slate-800 border-r border-slate-200">{sub.subject}</td>
                <td className="p-2.5 text-center font-black text-sm text-primary border-r border-slate-200">{sub.finalScore > 0 ? sub.finalScore : "-"}</td>
                <td className="p-2.5 text-[11px] leading-relaxed text-slate-700 space-y-1">
                  <p>{sub.competencyHigh}</p>
                  {sub.competencyGuidance !== "-" && <p className="text-slate-600 pt-1 border-t border-dashed border-slate-200">{sub.competencyGuidance}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-2.5">
        {rapor.subjects.map((sub) => (
          <div key={sub.no} className="p-3 rounded-xl border border-slate-200 bg-slate-50/40 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-800">{sub.no}. {sub.subject}</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-black text-xs">Nilai: {sub.finalScore > 0 ? sub.finalScore : "-"}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{sub.fullDescription}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="rounded-xl border border-slate-300 overflow-hidden">
          <div className="bg-slate-100 px-3 py-2 font-black text-xs text-slate-800 border-b border-slate-300">Ketidakhadiran</div>
          <div className="p-3 space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-600 font-semibold">Sakit</span><span className="font-black text-slate-800">{rapor.attendance.sakit} hari</span></div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-600 font-semibold">Izin</span><span className="font-black text-slate-800">{rapor.attendance.izin} hari</span></div>
            <div className="flex justify-between"><span className="text-slate-600 font-semibold">Tanpa Keterangan</span><span className="font-black text-slate-800">{rapor.attendance.alpa} hari</span></div>
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-slate-300 overflow-hidden flex flex-col">
          <div className="bg-slate-100 px-3 py-2 font-black text-xs text-slate-800 border-b border-slate-300 flex justify-between items-center">
            <span>Catatan Wali Kelas</span>
            <span className="text-[10px] font-semibold text-slate-500">Dapat disunting langsung</span>
          </div>
          <textarea
            value={rapor.homeroomNotes}
            onChange={e => onUpdateNotes(e.target.value)}
            rows={3}
            className="w-full p-3 text-xs text-slate-700 font-medium leading-relaxed outline-none focus:bg-cyan-50/20 resize-none flex-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs text-center">
        <div className="space-y-12">
          <div><p className="text-slate-500">Mengetahui,</p><p className="font-bold text-slate-800">Orang Tua / Wali</p></div>
          <p className="font-bold text-slate-600">( ............................................ )</p>
        </div>
        <div className="space-y-12">
          <div><p className="text-slate-500">Mengetahui,</p><p className="font-bold text-slate-800">Kepala SD Negeri Bobong</p></div>
          <div><p className="font-black text-slate-900 underline">{rapor.headmasterName}</p><p className="text-[11px] text-slate-500">NIP. {rapor.headmasterNip}</p></div>
        </div>
        <div className="space-y-12">
          <div><p className="text-slate-500">Bobong, {todayStr}</p><p className="font-bold text-slate-800">Wali Kelas {rapor.classId}</p></div>
          <div><p className="font-black text-slate-900 underline">{rapor.homeroomTeacherName}</p><p className="text-[11px] text-slate-500">NIP. {rapor.homeroomTeacherNip}</p></div>
        </div>
      </div>
    </div>
  );
}
