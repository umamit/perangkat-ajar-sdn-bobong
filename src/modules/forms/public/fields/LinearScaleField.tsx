'use client';

import React from 'react';
import { PublicFormField } from '@/types/form';

interface LinearScaleFieldProps {
  field: PublicFormField;
  value: number | string | undefined;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const LinearScaleField: React.FC<LinearScaleFieldProps> = ({
  field,
  value,
  onChange,
  disabled = false,
}) => {
  const min = field.scale_min ?? 1;
  const max = field.scale_max ?? 5;
  const currentValue = Number(value);

  const steps = [];
  for (let i = min; i <= max; i++) {
    steps.push(i);
  }

  return (
    <div className="w-full py-2">
      <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((num) => {
          const isSelected = currentValue === num;
          return (
            <button
              key={num}
              type="button"
              disabled={disabled}
              onClick={() => onChange(num)}
              className={`flex-1 min-w-[44px] h-12 rounded-xl text-base font-semibold transition-all border ${
                isSelected
                  ? 'bg-[#12A5B8] text-white border-[#0A7E8D] shadow-sm scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200'
              } disabled:opacity-50`}
            >
              {num}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between items-center text-xs text-slate-500 font-medium px-1 mt-1">
        <span>{field.scale_min_label || `Nilai terkecil (${min})`}</span>
        <span>{field.scale_max_label || `Nilai terbesar (${max})`}</span>
      </div>
    </div>
  );
};
