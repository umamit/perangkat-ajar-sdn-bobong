"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiModeTabs } from "./ai/AiModeTabs";
import { AiResultCard } from "./ai/AiResultCard";

export function AiAssistantView() {
  const { showToast, currentTeacher } = useApp();
  const [mode, setMode] = useState<any>("modul_ajar");
  const [grade, setGrade] = useState("Kelas 6");
  const [subject, setSubject] = useState(currentTeacher?.subject || "Bahasa Inggris");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const QUICK_TEMPLATES = [
    "Pengantar materi " + (subject || "pelajaran") + " untuk pemula",
    "Latihan soal " + (subject || "pelajaran") + " tingkat dasar",
    "Kegiatan diskusi kelompok materi " + (subject || "pelajaran"),
    "Proyek berbasis masalah (PBL) materi " + (subject || "pelajaran"),
    "Asesmen formatif " + (subject || "pelajaran") + " Kurikulum Merdeka"
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return showToast("Masukkan topik atau pertanyaan terlebih dahulu", "error");
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/ai/groq", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToUse, mode, grade, subject }),
      });
      const data = await res.json();
      if (data.result) { setResult(data.result); showToast("Berhasil dimuat dari Groq AI!", "success"); }
      else if (data.fallbackResponse) { setResult(data.fallbackResponse); showToast("Menampilkan template", "info"); }
      else { showToast(data.error || "Gagal terhubung ke AI", "error"); }
    } catch { showToast("Terjadi kesalahan jaringan", "error"); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    showToast("Teks berhasil disalin ke clipboard!", "success");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Asisten Kurikulum Merdeka</h3>
          <span className="text-[9px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full flex items-center gap-1">
            <i className="ri-flashlight-fill text-amber-500" /> Powered by Groq AI
          </span>
        </div>
        <p className="text-xs text-slate-500 font-semibold">Generator Modul Ajar, Bank Soal & Konsultasi Pedagogi SD Negeri Bobong</p>
      </div>

      <AiModeTabs mode={mode} setMode={setMode} />

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
            <i className="ri-sparkles-line text-primary text-base" /> Konfigurasi Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-xs text-left">
              <label className="font-bold text-slate-600 block mb-1">Tingkat Kelas</label>
              <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20">
                {["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <label className="font-bold text-slate-600 block mb-1">Mata Pelajaran</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20">
                {["Bahasa Inggris", "Bahasa Indonesia", "Matematika", "IPAS", "Pendidikan Pancasila", "Pendidikan Agama Islam", "Pendidikan Agama Kristen", "PJOK", "Seni Budaya", "Muatan Lokal"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-left">
            <label className="font-bold text-slate-600 block mb-1">Topik / Pertanyaan Pembelajaran</label>
            <Input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={"Contoh: Topik " + (subject || "pelajaran") + "..."} className="text-xs py-5 rounded-xl focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="space-y-1.5 text-xs text-left">
            <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase mb-1.5">Template Topik Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button key={idx} onClick={() => { setPrompt(tmpl); handleGenerate(tmpl); }} className="text-[10px] bg-white border border-slate-100 hover:bg-primary/5 hover:text-primary text-slate-600 font-bold px-2.5 py-1 rounded-lg transition-colors">
                  + {tmpl}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => handleGenerate()} disabled={loading} className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-primary/10">
            {loading ? (<><i className="ri-loader-4-line animate-spin text-base" /> Memproses dengan Groq AI...</>) : (<><i className="ri-sparkles-fill text-amber-400 text-sm" /> Hasilkan Sekarang</>)}
          </Button>
        </CardContent>
      </Card>

      <AiResultCard result={result} onCopy={handleCopy} />
    </div>
  );
}
