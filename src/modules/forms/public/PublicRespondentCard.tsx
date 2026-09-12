'use client';

import React from 'react';

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
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-5 sm:p-6">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Anda (Opsional)</label>
      <input
        type="text"
        disabled={disabled}
        value={respondentName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tuliskan nama lengkap..."
        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12A5B8] transition-all text-sm"
      />
    </div>
  );
};
