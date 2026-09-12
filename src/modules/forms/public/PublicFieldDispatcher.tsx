'use client';

import React from 'react';
import { PublicFormField } from '@/types/form';
import { LinearScaleField } from './fields/LinearScaleField';

interface PublicFieldDispatcherProps {
  field: PublicFormField;
  value: any;
  onChange: (val: any) => void;
  disabled?: boolean;
}

export const PublicFieldDispatcher: React.FC<PublicFieldDispatcherProps> = ({
  field,
  value,
  onChange,
  disabled = false,
}) => {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          disabled={disabled}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tuliskan jawaban Anda..."
          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12A5B8] transition-all"
        />
      );

    case 'textarea':
      return (
        <textarea
          rows={4}
          disabled={disabled}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tuliskan jawaban lengkap Anda di sini..."
          className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12A5B8] transition-all resize-y"
        />
      );

    case 'radio':
      return (
        <div className="space-y-2.5">
          {(field.options || []).map((opt, idx) => {
            const isChecked = value === opt.value;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'border-[#12A5B8] bg-[#12A5B8]/5 text-slate-900 font-medium'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={isChecked}
                  disabled={disabled}
                  onChange={() => onChange(opt.value)}
                  className="w-4 h-4 text-[#12A5B8] focus:ring-[#12A5B8]"
                />
                <span className="text-sm leading-relaxed">{opt.label}</span>
              </label>
            );
          })}
        </div>
      );

    case 'checkbox':
      const currentList: string[] = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2.5">
          {(field.options || []).map((opt, idx) => {
            const isChecked = currentList.includes(opt.value);
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'border-[#12A5B8] bg-[#12A5B8]/5 text-slate-900 font-medium'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={isChecked}
                  disabled={disabled}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...currentList, opt.value]);
                    } else {
                      onChange(currentList.filter((v) => v !== opt.value));
                    }
                  }}
                  className="w-4 h-4 rounded text-[#12A5B8] focus:ring-[#12A5B8]"
                />
                <span className="text-sm leading-relaxed">{opt.label}</span>
              </label>
            );
          })}
        </div>
      );

    case 'dropdown':
      return (
        <select
          value={value || ''}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12A5B8] transition-all cursor-pointer"
        >
          <option value="" disabled>-- Pilih salah satu --</option>
          {(field.options || []).map((opt, idx) => (
            <option key={idx} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );

    case 'linear_scale':
      return <LinearScaleField field={field} value={value} onChange={onChange} disabled={disabled} />;

    case 'date':
      return (
        <input
          type="date"
          disabled={disabled}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12A5B8] transition-all"
        />
      );

    default:
      return <p className="text-sm text-slate-400">Tipe input tidak didukung</p>;
  }
};
