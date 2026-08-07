'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AiAssistantView() {
  const { showToast, classes, currentTeacher } = useApp();
  const [mode, setMode] = useState<'modul_ajar' | 'soal_asesmen' | 'konsultasi' | 'alur_tujuan' | 'lkpd_interaktif' | 'projek_p5'>('modul_ajar');
  const [grade, setGrade] = useState('Kelas 6');
  const [subject, setSubject] = useState(currentTeacher?.subject || 'Bahasa Inggris');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const QUICK_TEMPLATES = [
    `Pengantar materi ${subject || 'pelajaran'} untuk pemula`,
    `Latihan soal ${subject || 'pelajaran'} tingkat dasar`,
    `Kegiatan diskusi kelompok materi ${subject || 'pelajaran'}`,
    `Proyek berbasis masalah (PBL) materi ${subject || 'pelajaran'}`,
    `Asesmen formatif ${subject || 'pelajaran'} Kurikulum Merdeka`
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) {
      showToast('Masukkan topik atau pertanyaan terlebih dahulu', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToUse, mode, grade, subject }),
      });

      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        showToast('Berhasil dimuat dari Groq AI!', 'success');
      } else if (data.fallbackResponse) {
        setResult(data.fallbackResponse);
        showToast('Menampilkan template (Groq API Key belum diisi)', 'info');
      } else {
        showToast(data.error || 'Gagal terhubung ke AI', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    showToast('Teks berhasil disalin ke clipboard!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Asisten Kurikulum Merdeka</h3>
            <span className="text-[9px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <i className="ri-flashlight-fill text-amber-500" /> Powered by Groq AI
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold">Generator Modul Ajar, Bank Soal &amp; Konsultasi Pedagogi SD Negeri Bobong</p>
        </div>
      </div>
 
      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
        <button
          onClick={() => setMode('modul_ajar')}
          className={`px-3 py-2 text-xs font-black rounded-xl transition-all duration-300 ${
            mode === 'modul_ajar' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-white/60 text-slate-600 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          <i className="ri-book-open-line mr-1" /> Modul Ajar (RPP)
        </button>
        <button
          onClick={() => setMode('alur_tujuan')}
          className={`px-3 py-2 text-xs font-black rounded-xl transition-all duration-300 ${
            mode === 'alur_tujuan' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-white/60 text-slate-600 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          <i className="ri-node-tree mr-1" /> Alur Tujuan (ATP)
        </button>
        <button
          onClick={() => setMode('lkpd_interaktif')}
          className={`px-3 py-2 text-xs font-black rounded-xl transition-all duration-300 ${
            mode === 'lkpd_interaktif' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-white/60 text-slate-600 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          <i className="ri-pages-line mr-1" /> Lembar Kerja (LKPD)
        </button>
        <button
          onClick={() => setMode('soal_asesmen')}
          className={`px-3 py-2 text-xs font-black rounded-xl transition-all duration-300 ${
            mode === 'soal_asesmen' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-white/60 text-slate-600 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          <i className="ri-file-list-3-line mr-1" /> Bank Soal Asesmen
        </button>
        <button
          onClick={() => setMode('projek_p5')}
          className={`px-3 py-2 text-xs font-black rounded-xl transition-all duration-300 ${
            mode === 'projek_p5' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-white/60 text-slate-600 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          <i className="ri-palette-line mr-1" /> Rancangan P5
        </button>
        <button
          onClick={() => setMode('konsultasi')}
          className={`px-3 py-2 text-xs font-black rounded-xl transition-all duration-300 ${
            mode === 'konsultasi' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-white/60 text-slate-600 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          <i className="ri-question-answer-line mr-1" /> Tanya Jawab Pedagogi
        </button>
      </div>
 
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-sm font-black text-slate-800">
            {mode === 'modul_ajar' && '🎯 Buat Modul Ajar Kurikulum Merdeka'}
            {mode === 'alur_tujuan' && '🌿 Susun Alur Tujuan Pembelajaran (ATP)'}
            {mode === 'lkpd_interaktif' && '📑 Buat Lembar Kerja Peserta Didik (LKPD) Menarik'}
            {mode === 'soal_asesmen' && '📝 Buat Bank Soal (Formatif / Sumatif)'}
            {mode === 'projek_p5' && '🎨 Rancang Modul Projek Penguatan Profil Pelajar Pancasila (P5)'}
            {mode === 'konsultasi' && '💡 Konsultasi & Tanya Jawab Kurikulum Merdeka'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-xs text-left">
              <label className="font-bold text-slate-650 block mb-1">Tingkat Kelas</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Kelas 1">Kelas 1 (Fase A)</option>
                <option value="Kelas 2">Kelas 2 (Fase A)</option>
                <option value="Kelas 3">Kelas 3 (Fase B)</option>
                <option value="Kelas 4">Kelas 4 (Fase B)</option>
                <option value="Kelas 5">Kelas 5 (Fase C)</option>
                <option value="Kelas 6">Kelas 6 (Fase C)</option>
              </select>
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <label className="font-bold text-slate-650 block mb-1">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Matematika">Matematika</option>
                <option value="IPAS">IPAS (IPA &amp; IPS)</option>
                <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                <option value="Pendidikan Agama Islam">Pendidikan Agama Islam</option>
                <option value="Pendidikan Agama Kristen">Pendidikan Agama Kristen</option>
                <option value="PJOK">PJOK</option>
                <option value="Seni Budaya">Seni Budaya</option>
                <option value="Muatan Lokal">Muatan Lokal</option>
              </select>
            </div>
          </div>
 
          <div className="space-y-1.5 text-xs text-left">
            <label className="font-bold text-slate-650 block mb-1">Topik / Pertanyaan Pembelajaran</label>
            <Input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Contoh: Topik ${subject || 'pelajaran'} yang ingin dibuat modul atau soalnya...`}
              className="text-xs py-5 rounded-xl focus:ring-2 focus:ring-primary/20"
            />
          </div>
 
          {/* Quick Template Chips */}
          <div className="space-y-1.5 text-xs text-left">
            <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase mb-1.5">Template Topik Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(tmpl);
                    handleGenerate(tmpl);
                  }}
                  className="text-[10px] bg-white border border-slate-100 hover:bg-primary/5 hover:text-primary text-slate-600 font-bold px-2.5 py-1 rounded-lg transition-colors"
                >
                  + {tmpl}
                </button>
              ))}
            </div>
          </div>
 
          <Button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-primary/10 transition-all duration-300"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin text-base" /> Memproses dengan Groq AI...
              </>
            ) : (
              <>
                <i className="ri-sparkles-fill text-amber-400 text-sm" /> Hasilkan Sekarang
              </>
            )}
          </Button>
        </CardContent>
      </Card>
 
      {/* Result Output Card */}
      {result && (
        <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden animate-fade-in">
          <CardHeader className="pb-2 border-b border-slate-100 bg-white/35 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
              <i className="ri-article-line text-primary" /> Hasil AI Kurikulum Merdeka
            </CardTitle>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="text-[10px] font-black h-8 rounded-lg border-slate-200 hover:bg-slate-50 gap-1"
            >
              <i className="ri-file-copy-line" /> Salin Teks
            </Button>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <div className="prose prose-slate max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100 overflow-x-auto">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
