'use client';

import React from 'react';
import { Trash2, GripVertical, CheckSquare } from 'lucide-react';
import { FormFieldModel, FormFieldType, FormType } from '@/types/form';
import { FieldOptionsEditor } from './FieldOptionsEditor';

interface FieldEditorCardProps {
  field: FormFieldModel;
  formType: FormType;
  index: number;
  onUpdate: (updated: FormFieldModel) => void;
  onDelete: () => void;
  disabled?: boolean;
}

export const FieldEditorCard: React.FC<FieldEditorCardProps> = ({
  field,
  formType,
  index,
  onUpdate,
  onDelete,
  disabled = false,
}) => {
  const hasOptions = ['radio', 'checkbox', 'dropdown'].includes(field.type);
  const isQuiz = formType === 'quiz';

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
          <span className="text-xs font-bold text-[#12A5B8] uppercase tracking-wider">No. {index + 1}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={field.is_required}
              disabled={disabled}
              onChange={(e) => onUpdate({ ...field, is_required: e.target.checked })}
              className="w-4 h-4 rounded text-[#12A5B8] focus:ring-[#12A5B8]"
            />
            Wajib Diisi
          </label>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Pertanyaan</label>
          <input
            type="text"
            value={field.label}
            disabled={disabled}
            onChange={(e) => onUpdate({ ...field, label: e.target.value })}
            placeholder="Tuliskan pertanyaan..."
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[#12A5B8]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Tipe Input</label>
          <select
            value={field.type}
            disabled={disabled}
            onChange={(e) => {
              const newType = e.target.value as FormFieldType;
              const defaultOpts = ['radio', 'checkbox', 'dropdown'].includes(newType) && (!field.options || field.options.length === 0)
                ? [{ label: 'Pilihan 1', value: 'pilihan_1' }]
                : field.options;
              onUpdate({ ...field, type: newType, options: defaultOpts });
            }}
            className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[#12A5B8]"
          >
            <option value="text">Teks Singkat</option>
            <option value="textarea">Paragraf Panjang</option>
            <option value="radio">Pilihan Ganda</option>
            <option value="checkbox">Kotak Centang (Multi)</option>
            <option value="dropdown">Menu Dropdown</option>
            <option value="linear_scale">Skala Linier (Likert)</option>
            <option value="date">Tanggal</option>
          </select>
        </div>
      </div>

      {hasOptions && (
        <FieldOptionsEditor
          options={field.options || []}
          onChange={(opts) => onUpdate({ ...field, options: opts })}
          disabled={disabled}
        />
      )}

      {isQuiz && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4" /> Kunci Jawaban & Skor Kuis
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-amber-900 font-medium block mb-1">Jawaban Benar</label>
              <input
                type="text"
                value={field.correct_answer || ''}
                disabled={disabled}
                onChange={(e) => onUpdate({ ...field, correct_answer: e.target.value })}
                placeholder="Misal: pilihan_1 atau teks jawaban"
                className="w-full h-10 px-3 text-sm rounded-lg border border-amber-200 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-amber-900 font-medium block mb-1">Bobot Poin</label>
              <input
                type="number"
                value={field.points || 0}
                disabled={disabled}
                onChange={(e) => onUpdate({ ...field, points: Number(e.target.value) })}
                className="w-full h-10 px-3 text-sm rounded-lg border border-amber-200 bg-white text-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
