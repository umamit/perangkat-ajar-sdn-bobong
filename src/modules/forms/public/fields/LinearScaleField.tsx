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
  for (let i = min; i <= max; i++) steps.push(i);

  return (
    <div className="w-full pt-2 pb-1 overflow-x-auto">
      <div className="min-w-[320px] flex items-center justify-between gap-2 px-2">
        {field.scale_min_label && (
          <span className="text-xs text-slate-500 font-normal self-end pb-1 pr-2 max-w-[100px] text-right leading-tight">
            {field.scale_min_label}
          </span>
        )}

        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-1 py-1">
          {steps.map((num) => {
            const isSelected = currentValue === num;
            return (
              <label
                key={num}
                className="flex flex-col items-center gap-3 cursor-pointer group select-none"
              >
                <span className="text-xs text-slate-600 font-normal group-hover:text-slate-900">
                  {num}
                </span>
                <input
                  type="radio"
                  name={field.id}
                  disabled={disabled}
                  checked={isSelected}
                  onChange={() => onChange(num)}
                  className="w-4 h-4 text-[#12A5B8] focus:ring-[#12A5B8] border-slate-300 cursor-pointer"
                />
              </label>
            );
          })}
        </div>

        {field.scale_max_label && (
          <span className="text-xs text-slate-500 font-normal self-end pb-1 pl-2 max-w-[100px] text-left leading-tight">
            {field.scale_max_label}
          </span>
        )}
      </div>
    </div>
  );
};
