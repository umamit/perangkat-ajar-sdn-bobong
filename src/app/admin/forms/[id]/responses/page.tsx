'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Users, Award, Calendar } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { FormModel, FormFieldModel, FormResponseModel } from '@/types/form';
import { exportFormResponsesToExcel } from '@/modules/forms/analytics/exportFormResponses';

export default function FormResponsesPage() {
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<FormModel | null>(null);
  const [fields, setFields] = useState<FormFieldModel[]>([]);
  const [responses, setResponses] = useState<FormResponseModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = getSupabase();
      const { data: formData } = await supabase.from('forms').select('*').eq('id', formId).single();
      const { data: fieldData } = await supabase.from('form_fields').select('*').eq('form_id', formId).order('order_index', { ascending: true });
      const { data: respData } = await supabase.from('form_responses').select('*').eq('form_id', formId).order('created_at', { ascending: false });

      if (formData) setForm(formData as FormModel);
      if (fieldData) setFields(fieldData as FormFieldModel[]);
      if (respData) setResponses(respData as FormResponseModel[]);
      setLoading(false);
    }
    loadData();
  }, [formId]);

  if (loading || !form) return <div className="p-8 text-center text-slate-500">Memuat data respon...</div>;

  const avgScore = form.type === 'quiz' && responses.length > 0
    ? (responses.reduce((acc, r) => acc + (r.score || 0), 0) / responses.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/forms" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Formulir
        </Link>
        <button
          onClick={() => exportFormResponsesToExcel(form.title, fields, responses)}
          disabled={responses.length === 0}
          className="h-10 px-4 rounded-xl bg-[#2A9D5C] hover:bg-[#23824c] text-white text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-40"
        >
          <Download className="w-4 h-4" /> Ekspor ke Excel (.xlsx)
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-slate-800">{form.title}</h1>
        <p className="text-slate-500 text-xs mt-1">Rekapitulasi Tanggapan Masuk</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#12A5B8]/10 text-[#12A5B8] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Tanggapan</p>
              <p className="text-2xl font-bold text-slate-800">{responses.length}</p>
            </div>
          </div>
          {avgScore !== null && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Rata-rata Skor</p>
                <p className="text-2xl font-bold text-amber-700">{avgScore}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Nama Responden</th>
                {form.type === 'quiz' && <th className="px-4 py-3">Skor</th>}
                {fields.slice(0, 4).map((f) => (
                  <th key={f.id} className="px-4 py-3 truncate max-w-[200px]">{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {responses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Belum ada respon yang masuk.</td>
                </tr>
              ) : (
                responses.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.respondent_name || 'Anonim'}</td>
                    {form.type === 'quiz' && <td className="px-4 py-3 font-semibold text-[#12A5B8]">{r.score}/{r.max_score}</td>}
                    {fields.slice(0, 4).map((f) => (
                      <td key={f.id} className="px-4 py-3 text-xs truncate max-w-[200px] text-slate-600">
                        {Array.isArray(r.answers[f.id]) ? r.answers[f.id].join(', ') : String(r.answers[f.id] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
