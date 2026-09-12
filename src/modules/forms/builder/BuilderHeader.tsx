'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { FormModel } from '@/types/form';

interface BuilderHeaderProps {
  form: FormModel;
  saving: boolean;
  onSave: () => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({ form, saving, onSave }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/admin/forms" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href={`/f/${form.slug}`}
          target="_blank"
          className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium inline-flex items-center gap-1.5 hover:bg-slate-50 shadow-sm"
        >
          <Eye className="w-4 h-4" /> Pratinjau
        </Link>
        <button
          onClick={onSave}
          disabled={saving}
          className="h-10 px-5 rounded-xl bg-[#12A5B8] hover:bg-[#0A7E8D] text-white text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  );
};
