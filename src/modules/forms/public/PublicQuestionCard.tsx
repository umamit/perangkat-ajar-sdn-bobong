'use client';

import React from 'react';
import { PublicFormField } from '@/types/form';
import { PublicFieldDispatcher } from './PublicFieldDispatcher';

interface PublicQuestionCardProps {
  field: PublicFormField;
  index: number;
  value: any;
  disabled?: boolean;
  onChange: (val: any) => void;
}

export const PublicQuestionCard: React.FC<PublicQuestionCardProps> = ({
  field,
  index,
  value,
  disabled = false,
  onChange,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-5 sm:p-6 space-y-3">
      <div>
        <span className="text-xs font-bold text-[#12A5B8] uppercase tracking-wider">Pertanyaan {index + 1}</span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <h3 className="text-base font-semibold text-slate-800">{field.label}</h3>
          {field.is_required && <span className="text-rose-500 font-bold">*</span>}
        </div>
        {field.description && <p className="text-xs text-slate-500 mt-1">{field.description}</p>}
      </div>

      <PublicFieldDispatcher
        field={field}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};
