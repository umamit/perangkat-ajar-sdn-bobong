'use client';

import React from 'react';
import { FormModel } from '@/types/form';

interface PublicFormHeaderProps {
  form: FormModel;
  progressPercent: number;
}

export const PublicFormHeader: React.FC<PublicFormHeaderProps> = ({ form, progressPercent }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{form.title}</h1>
      {form.description && <p className="text-slate-600 text-sm mt-2 leading-relaxed">{form.description}</p>}

      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
          <span>Progres Pengisian</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#12A5B8] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </div>
  );
};
