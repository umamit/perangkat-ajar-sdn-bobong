'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AiAssistantView() {
  const { showToast, classes } = useApp();
  const [mode, setMode] = useState<'modul_ajar' | 'soal_asesmen' | 'konsultasi'>('modul_ajar');
  const [grade, setGrade] = useState('Kelas 6');
  const [subject, setSubject] = useState('Bahasa Inggris');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const QUICK_TEMPLATES = [
    'Greetings & Introduction (Perkenalan Diri)',
    'Classroom Objects & Commands',
    'Family Members & Relationships',
    'Daily Activities & Simple Present Tense',
    'My School & Environment'
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-800">AI Asisten Kurikulum Merdeka</h3>
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <i className="ri-flashlight-fill text-amber-500" /> Powered by Groq AI
            </span>
          </div>
          <p className="text-xs text-slate-500">Generator Modul Ajar, Bank Soal & Konsultasi Pedagogi SD Negeri Bobong</p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setMode('modul_ajar')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'modul_ajar' ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <i className="ri-book-open-line mr-1.5" /> Modul Ajar (RPP)
        </button>
        <button
          onClick={() => setMode('soal_asesmen')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'soal_asesmen' ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <i className="ri-file-list-3-line mr-1.5" /> Bank Soal Asesmen
        </button>
        <button
          onClick={() => setMode('konsultasi')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'konsultasi' ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <i className="ri-question-answer-line mr-1.5" /> Tanya Jawab Pedagogi
        </button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-800">
            {mode === 'modul_ajar' && '🎯 Buat Modul Ajar Kurikulum Merdeka'}
            {mode === 'soal_asesmen' && '📝 Buat Bank Soal (Formatif / Sumatif)'}
            {mode === 'konsultasi' && '💡 Konsultasi & Tanya Jawab Kurikulum Merdeka'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Tingkat Kelas</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Kelas 1">Kelas 1 (Fase A)</option>
                <option value="Kelas 2">Kelas 2 (Fase A)</option>
                <option value="Kelas 3">Kelas 3 (Fase B)</option>
                <option value="Kelas 4">Kelas 4 (Fase B)</option>
                <option value="Kelas 5">Kelas 5 (Fase C)</option>
                <option value="Kelas 6">Kelas 6 (Fase C)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Matematika">Matematika</option>
                <option value="IPAS">IPAS (IPA & IPS)</option>
                <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Topik / Pertanyaan Pembelajaran</label>
            <Input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Contoh: Greetings & Perkenalan Diri atau Cara mengajar HOTS..."
              className="text-xs py-5 rounded-xl"
            />
          </div>

          {/* Quick Template Chips */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Template Topik Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(tmpl);
                    handleGenerate(tmpl);
                  }}
                  className="text-[11px] bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-600 font-medium px-2.5 py-1 rounded-lg transition-colors"
                >
                  + {tmpl}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
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
        <Card className="border-slate-200 shadow-sm bg-white animate-fade-in">
          <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <i className="ri-[article-line] text-primary" /> Hasil AI Kurikulum Merdeka
            </CardTitle>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="text-xs font-semibold rounded-xl flex items-center gap-1"
            >
              <i className="ri-file-copy-line" /> Salin Teks
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="prose prose-slate max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 overflow-x-auto">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
