'use client';

import React from 'react';
import { FormModel } from '@/types/form';

interface PublicFormHeaderProps {
  form: FormModel;
  progressPercent: number;
}

export const PublicFormHeader: React.FC<PublicFormHeaderProps> = ({ form, progressPercent }) => {
  return (
    <div className="bg-white border border-slate-200/80 shadow-xs rounded-lg overflow-hidden">
      {/* Top Accent Bar khas Google Forms */}
      <div className="h-2.5 w-full bg-[#12A5B8]" />

      <div className="p-6 sm:p-7 space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight leading-tight">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-slate-600 text-sm mt-3 leading-relaxed whitespace-pre-line">
              {form.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Progres Pengisian</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#12A5B8] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="pt-2 text-xs text-rose-600 font-medium flex items-center gap-1">
          <span>* Menunjukkan pertanyaan yang wajib diisi</span>
        </div>
      </div>
    </div>
  );
};
