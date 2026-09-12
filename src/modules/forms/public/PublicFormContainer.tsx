'use client';

import React, { useState, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { FormModel, PublicFormField, FormSubmitResult } from '@/types/form';
import { PublicFieldDispatcher } from './PublicFieldDispatcher';
import { PublicFormHeader } from './PublicFormHeader';
import { SubmissionSuccessView } from './SubmissionSuccessView';

interface PublicFormContainerProps {
  form: FormModel;
  fields: PublicFormField[];
}

export const PublicFormContainer: React.FC<PublicFormContainerProps> = ({ form, fields }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [respondentName, setRespondentName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

  const storageKey = `formajar_draft_${form.id}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.respondentName) setRespondentName(parsed.respondentName);
      }
    } catch {}
  }, [storageKey]);

  const handleAnswerChange = (fieldId: string, val: any) => {
    const updated = { ...answers, [fieldId]: val };
    setAnswers(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers: updated, respondentName }));
    } catch {}
  };

  const filledCount = fields.filter((f) => answers[f.id] !== undefined && answers[f.id] !== '' && (!Array.isArray(answers[f.id]) || answers[f.id].length > 0)).length;
  const progressPercent = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    for (const f of fields) {
      if (f.is_required) {
        const val = answers[f.id];
        if (val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
          setErrorMsg(`Pertanyaan "${f.label}" wajib diisi.`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id: form.id, respondent_name: respondentName.trim() || undefined, answers }),
      });

      const data: FormSubmitResult = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Gagal mengirim formulir.');

      localStorage.removeItem(storageKey);
      setSubmitResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitResult) {
    return (
      <SubmissionSuccessView
        form={form}
        result={submitResult}
        onReset={() => {
          setSubmitResult(null);
          setAnswers({});
          setRespondentName('');
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto pb-12">
      <PublicFormHeader form={form} progressPercent={progressPercent} />

      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-5 sm:p-6">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Anda (Opsional)</label>
        <input
          type="text"
          value={respondentName}
          onChange={(e) => setRespondentName(e.target.value)}
          placeholder="Tuliskan nama lengkap..."
          className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12A5B8] transition-all text-sm"
        />
      </div>

      {fields.map((f, idx) => (
        <div key={f.id} className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-5 sm:p-6 space-y-3">
          <div>
            <span className="text-xs font-bold text-[#12A5B8] uppercase tracking-wider">Pertanyaan {idx + 1}</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <h3 className="text-base font-semibold text-slate-800">{f.label}</h3>
              {f.is_required && <span className="text-rose-500 font-bold">*</span>}
            </div>
            {f.description && <p className="text-xs text-slate-500 mt-1">{f.description}</p>}
          </div>

          <PublicFieldDispatcher
            field={f}
            value={answers[f.id]}
            onChange={(val) => handleAnswerChange(f.id, val)}
            disabled={isSubmitting}
          />
        </div>
      ))}

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-13 bg-[#12A5B8] hover:bg-[#0A7E8D] text-white rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 text-base"
      >
        <Send className="w-5 h-5" />
        {isSubmitting ? 'Mengirim tanggapan...' : 'Kirim Tanggapan'}
      </button>
    </form>
  );
};
