'use client';

import React, { useState } from 'react';

interface PublicRespondentCardProps {
  respondentName: string;
  disabled?: boolean;
  onChange: (name: string) => void;
}

export const PublicRespondentCard: React.FC<PublicRespondentCardProps> = ({
  respondentName,
  disabled = false,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`bg-white border transition-all rounded-lg p-6 sm:p-7 space-y-4 shadow-xs ${
        isFocused
          ? 'border-[#12A5B8] border-l-4 border-l-[#12A5B8]'
          : 'border-slate-200/80'
      }`}
    >
      <div>
        <label className="block text-base font-normal text-slate-900 leading-snug">
          Nama Lengkap <span className="text-slate-400 text-xs">(Opsional)</span>
        </label>
        <p className="text-xs text-slate-500 mt-0.5">Tuliskan nama Anda jika diperlukan</p>
      </div>

      <div className="pt-2">
        <input
          type="text"
          disabled={disabled}
          value={respondentName}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Jawaban Anda"
          className="w-full sm:w-80 border-0 border-b border-slate-300 focus:border-b-2 focus:border-[#12A5B8] focus:outline-none bg-transparent py-1.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors"
        />
      </div>
    </div>
  );
};
