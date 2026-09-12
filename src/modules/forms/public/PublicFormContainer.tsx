'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { FormModel, PublicFormField, FormSubmitResult } from '@/types/form';
import { PublicFormHeader } from './PublicFormHeader';
import { PublicRespondentCard } from './PublicRespondentCard';
import { PublicQuestionCard } from './PublicQuestionCard';
import { PublicFormFooter } from './PublicFormFooter';
import { QuizCountdownTimer } from './QuizCountdownTimer';
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
  const startStorageKey = `formajar_start_${form.id}`;

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

  const handleClearForm = () => {
    if (confirm('Kosongkan semua isian formulir?')) {
      setAnswers({});
      setRespondentName('');
      localStorage.removeItem(storageKey);
    }
  };

  const filledCount = fields.filter((f) => answers[f.id] !== undefined && answers[f.id] !== '' && (!Array.isArray(answers[f.id]) || answers[f.id].length > 0)).length;
  const progressPercent = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

  const executeSubmit = useCallback(async (isAutoTimeout = false) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id: form.id, respondent_name: respondentName.trim() || undefined, answers }),
      });

      const data: FormSubmitResult = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Gagal mengirim formulir.');

      localStorage.removeItem(storageKey);
      localStorage.removeItem(startStorageKey);
      setSubmitResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  }, [form.id, respondentName, answers, storageKey, startStorageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const f of fields) {
      if (f.is_required) {
        const val = answers[f.id];
        if (val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
          setErrorMsg(`Pertanyaan "${f.label}" wajib diisi.`);
          return;
        }
      }
    }
    await executeSubmit(false);
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

  const hasTimer = form.type === 'quiz' && !!form.duration_minutes && form.duration_minutes > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto pb-16 relative">
      {hasTimer && (
        <QuizCountdownTimer
          formId={form.id}
          durationMinutes={form.duration_minutes!}
          onTimeout={() => executeSubmit(true)}
          disabled={isSubmitting}
        />
      )}

      <PublicFormHeader form={form} progressPercent={progressPercent} />
      <PublicRespondentCard respondentName={respondentName} disabled={isSubmitting} onChange={setRespondentName} />

      {fields.map((f, idx) => (
        <PublicQuestionCard
          key={f.id}
          field={f}
          index={idx}
          value={answers[f.id]}
          disabled={isSubmitting}
          onChange={(val) => handleAnswerChange(f.id, val)}
        />
      ))}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <PublicFormFooter isSubmitting={isSubmitting} onClearForm={handleClearForm} />
    </form>
  );
};
