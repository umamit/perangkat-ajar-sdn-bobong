'use client';

import React, { useState } from 'react';
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`bg-white border transition-all rounded-lg p-6 sm:p-7 space-y-4 shadow-xs ${
        isFocused
          ? 'border-[#12A5B8] border-l-4 border-l-[#12A5B8]'
          : 'border-slate-200/80'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-normal text-slate-900 leading-snug">
            {field.label}
            {field.is_required && <span className="text-rose-500 font-bold ml-1">*</span>}
          </h3>
          {field.description && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{field.description}</p>
          )}
        </div>
        {field.points ? (
          <span className="text-xs font-medium text-slate-400 shrink-0 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
            {field.points} poin
          </span>
        ) : null}
      </div>

      <div className="pt-2">
        <PublicFieldDispatcher
          field={field}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
