'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormOption } from '@/types/form';

interface FieldOptionsEditorProps {
  options: FormOption[];
  onChange: (opts: FormOption[]) => void;
  disabled?: boolean;
}

export const FieldOptionsEditor: React.FC<FieldOptionsEditorProps> = ({
  options = [],
  onChange,
  disabled = false,
}) => {
  const handleAdd = () => {
    const nextIdx = options.length + 1;
    const newOpt: FormOption = { label: `Opsi ${nextIdx}`, value: `opsi_${nextIdx}` };
    onChange([...options, newOpt]);
  };

  const handleUpdate = (index: number, newLabel: string) => {
    const updated = [...options];
    updated[index] = { label: newLabel, value: newLabel.trim().toLowerCase().replace(/\s+/g, '_') };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(options.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2 pt-2">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daftar Pilihan Jawaban</label>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-4 font-mono">{idx + 1}.</span>
            <input
              type="text"
              disabled={disabled}
              value={opt.label}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              className="flex-1 h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[#12A5B8]"
            />
            <button
              type="button"
              disabled={disabled || options.length <= 1}
              onClick={() => handleRemove(idx)}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#12A5B8] hover:text-[#0A7E8D] pt-1"
      >
        <Plus className="w-4 h-4" /> Tambah Pilihan
      </button>
    </div>
  );
};
