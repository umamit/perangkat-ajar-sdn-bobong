'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';

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
  const [formType, setFormType] = useState('quiz');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Kuis IPA 10 Soal', type: 'quiz', count: 10, text: 'Kuis IPA Kelas 5 materi Rantai Makanan pilihan ganda 4 opsi A-D lengkap dengan kunci jawaban' },
    { label: 'Kuis MTK 15 Soal', type: 'quiz', count: 15, text: 'Kuis Matematika Kelas 4 materi Pecahan dan Operasi Hitung pilihan ganda dengan kunci jawaban' },
    { label: 'Survei Kepuasan', type: 'assessment', count: 5, text: 'Survei kepuasan wali murid terhadap sarana kebersihan, kantin, dan keramahan guru skala 1-5' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/forms/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), formType, questionCount }),
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
              <h3 className="text-base font-bold text-slate-800">AI Kuis & Asesmen Generator</h3>
              <p className="text-xs text-slate-500">Tentukan jumlah soal dan materi, AI akan merancangnya seketika</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <label className="text-xs font-semibold text-slate-700">Target Jumlah Soal:</label>
            <div className="flex items-center gap-1.5">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    questionCount === num
                      ? 'bg-[#12A5B8] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Contoh Cepat:</label>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(qp.text);
                    setFormType(qp.type);
                    setQuestionCount(qp.count);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-600 transition-colors"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Topik / Perintah Kuis:</label>
            <textarea
              rows={3}
              value={prompt}
              disabled={loading}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Buatkan kuis Bahasa Indonesia Kelas 6 materi Ide Pokok Paragraf 10 soal..."
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
            {loading ? `AI Merancang ${questionCount} Soal...` : `Rancang ${questionCount} Soal`}
          </button>
        </div>
      </div>
    </div>
  );
};
