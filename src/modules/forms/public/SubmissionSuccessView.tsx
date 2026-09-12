'use client';

import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { FormModel, FormSubmitResult } from '@/types/form';

interface SubmissionSuccessViewProps {
  form: FormModel;
  result: FormSubmitResult;
  onReset: () => void;
}

export const SubmissionSuccessView: React.FC<SubmissionSuccessViewProps> = ({
  form,
  result,
  onReset,
}) => {
  const isQuiz = form.type === 'quiz' && result.max_score !== undefined;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl p-6 sm:p-8 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-[#2A9D5C]/10 text-[#2A9D5C] rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">Jawaban Telah Terkirim!</h2>
      <p className="text-slate-600 text-sm mb-6">
        Terima kasih, tanggapan Anda untuk formulir <span className="font-semibold text-slate-800">"{form.title}"</span> telah berhasil tersimpan di sistem.
      </p>

      {isQuiz && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#12A5B8]/10 to-[#0A7E8D]/5 border border-[#12A5B8]/20 mb-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#0A7E8D] mb-1">Skor Kuis Anda</p>
          <div className="text-4xl font-extrabold text-[#0A7E8D]">
            {result.score} <span className="text-xl font-normal text-slate-500">/ {result.max_score}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-sm active:scale-95"
      >
        <RotateCcw className="w-4 h-4" />
        Kirim Tanggapan Lain
      </button>
    </div>
  );
};
