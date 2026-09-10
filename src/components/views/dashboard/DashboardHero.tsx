import React from "react";
import { Button } from "@/components/ui/button";

export function DashboardHero({ currentTeacher, setActiveView }: any) {
  return (
    <div className="relative overflow-hidden p-8 sm:p-10 text-white shadow-2xl rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary-dark border border-white/10">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-widest uppercase text-cyan-50 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SD NEGERI BOBONG &bull; KABUPATEN PULAU TALIABU</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md">
          Perangkat Ajar Online & Digital Learning
        </h1>

        <p className="text-xs sm:text-sm text-cyan-50/90 leading-relaxed font-semibold max-w-2xl">
          Platform administrasi terpadu {currentTeacher?.subject || "Mata Pelajaran"} SD, Modul Ajar Kurikulum Merdeka, Presensi Harian, dan Jurnal Mengajar.
        </p>

        <div className="pt-3 flex flex-wrap gap-3">
          <Button onClick={() => setActiveView("siswa")} className="bg-secondary text-slate-950 hover:bg-amber-400 font-black px-5 h-11 shadow-lg shadow-amber-500/25 text-xs rounded-xl">
            <i className="ri-group-line text-base" /> Kelola Data Siswa
          </Button>
          <Button onClick={() => setActiveView("ai_assistant")} className="bg-cyan-500 hover:bg-cyan-600 text-white font-black px-5 h-11 shadow-lg shadow-cyan-500/25 text-xs rounded-xl">
            <i className="ri-magic-line text-base" /> AI Asisten Guru
          </Button>
          <Button variant="outline" onClick={() => setActiveView("absensi")} className="bg-white/15 hover:bg-white/25 border-white/20 text-white font-black px-5 h-11 backdrop-blur-md text-xs rounded-xl">
            <i className="ri-checkbox-line text-base" /> Presensi Kelas
          </Button>
        </div>
      </div>
    </div>
  );
}
