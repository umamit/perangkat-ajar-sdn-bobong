'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, X, Check, FileCheck, HelpCircle } from 'lucide-react';
import { FormModel, FormFieldModel } from '@/types/form';

interface AiFormGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (generated: { title: string; description?: string; type: any; fields: any[] }) => void;
}

export const AiFormGeneratorModal: React.FC<AiFormGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [prompt, setPrompt] = useState('');
  const [formType, setFormType] = useState('assessment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Survei Kepuasan Wali Murid', type: 'assessment', text: 'Buatkan survei kepuasan layanan sekolah untuk orang tua siswa dengan skala Likert 1-5 dan saran' },
    { label: 'Asesmen Formatif Karakter', type: 'assessment', text: 'Buatkan lembar instrumen asesmen observasi karakter Profil Pelajar Pancasila skala 1-4' },
    { label: 'Kuis IPA Kelas 5', type: 'quiz', text: 'Buatkan kuis IPA Kelas 5 materi Rantai Makanan 5 butir soal pilihan ganda lengkap dengan kunci jawaban' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/forms/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), formType }),
      });
      const json = await res.json();
      if (!json.success || !json.data) throw new Error('Gagal menghasilkan formulir.');

      onApply(json.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan generate AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#12A5B8]/10 text-[#12A5B8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">AI Form & Asesmen Generator</h3>
              <p className="text-xs text-slate-500">Tuliskan kebutuhan Anda, AI akan menyusun formulir otomatis</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Pilihan Cepat (Template):</label>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(qp.text);
                    setFormType(qp.type);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-600 transition-colors"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Deskripsikan Formulir / Asesmen:</label>
            <textarea
              rows={3}
              value={prompt}
              disabled={loading}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Buatkan instrumen asesmen diagnostik membaca permulaan kelas 1 SD dengan 5 indikator skala 1-4..."
              className="w-full p-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[#12A5B8] resize-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={loading || !prompt.trim()}
            onClick={handleGenerate}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#12A5B8] to-[#0A7E8D] hover:opacity-95 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'AI Sedang Merancang...' : 'Rancang dengan AI'}
          </button>
        </div>
      </div>
    </div>
  );
};
