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
          placeholder="Jawaban Anda"
          className="w-full sm:w-80 border-0 border-b border-slate-300 focus:border-b-2 focus:border-[#12A5B8] focus:outline-none bg-transparent py-1.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors"
        />
      );

    case 'textarea':
      return (
        <textarea
          rows={3}
          disabled={disabled}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Jawaban Anda"
          className="w-full border-0 border-b border-slate-300 focus:border-b-2 focus:border-[#12A5B8] focus:outline-none bg-transparent py-1.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors resize-y"
        />
      );

    case 'radio':
      return (
        <div className="space-y-3 pt-1">
          {(field.options || []).map((opt, idx) => {
            const isChecked = value === opt.value;
            return (
              <label
                key={idx}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={isChecked}
                  disabled={disabled}
                  onChange={() => onChange(opt.value)}
                  className="w-4 h-4 text-[#12A5B8] focus:ring-[#12A5B8] border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-800 group-hover:text-slate-900 leading-normal">
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      );

    case 'checkbox':
      const currentList: string[] = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-3 pt-1">
          {(field.options || []).map((opt, idx) => {
            const isChecked = currentList.includes(opt.value);
            return (
              <label
                key={idx}
                className="flex items-center gap-3 cursor-pointer group select-none"
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
                  className="w-4 h-4 rounded text-[#12A5B8] focus:ring-[#12A5B8] border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-800 group-hover:text-slate-900 leading-normal">
                  {opt.label}
                </span>
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
          className="w-full sm:w-64 h-11 px-3 text-sm rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#12A5B8] focus:border-[#12A5B8] cursor-pointer"
        >
          <option value="" disabled>Pilih</option>
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
          className="w-full sm:w-64 border-0 border-b border-slate-300 focus:border-b-2 focus:border-[#12A5B8] focus:outline-none bg-transparent py-1.5 text-sm text-slate-800"
        />
      );

    default:
      return <p className="text-sm text-slate-400">Tipe input tidak didukung</p>;
  }
};
