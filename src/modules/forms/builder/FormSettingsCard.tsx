'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { FormModel, FormType } from '@/types/form';

interface FormSettingsCardProps {
  form: FormModel;
  onChange: (updated: Partial<FormModel>) => void;
  disabled?: boolean;
}

export const FormSettingsCard: React.FC<FormSettingsCardProps> = ({
  form,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6 space-y-4">
      <input
        type="text"
        disabled={disabled}
        value={form.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Judul Formulir..."
        className="w-full text-2xl sm:text-3xl font-bold text-slate-800 bg-transparent border-b border-slate-200 pb-2 focus:outline-none focus:border-[#12A5B8]"
      />
      <textarea
        rows={2}
        disabled={disabled}
        value={form.description || ''}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Deskripsi atau petunjuk pengerjaan..."
        className="w-full text-sm text-slate-600 bg-transparent border-b border-slate-200 pb-2 focus:outline-none focus:border-[#12A5B8] resize-none"
      />
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          Tipe:
          <select
            value={form.type}
            disabled={disabled}
            onChange={(e) => onChange({ type: e.target.value as FormType })}
            className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium"
          >
            <option value="standard">Formulir Standar</option>
            <option value="quiz">Kuis / Ujian Dinilai</option>
            <option value="assessment">Instrumen Asesmen</option>
          </select>
        </label>

        {form.type === 'quiz' && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg border border-amber-200/60 text-xs font-semibold text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Durasi:</span>
            <input
              type="number"
              min={0}
              max={180}
              value={form.duration_minutes ?? ''}
              disabled={disabled}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10));
                onChange({ duration_minutes: val });
              }}
              placeholder="Tanpa batas"
              className="w-20 h-6 px-1.5 text-xs text-center rounded border border-amber-200 bg-white text-slate-800 font-medium"
            />
            <span className="text-[11px] font-normal text-amber-700">menit</span>
          </div>
        )}

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            disabled={disabled}
            onChange={(e) => onChange({ is_active: e.target.checked })}
            className="w-4 h-4 rounded text-[#12A5B8] focus:ring-[#12A5B8]"
          />
          Formulir Aktif & Dapat Diakses Publik
        </label>
      </div>
    </div>
  );
};
