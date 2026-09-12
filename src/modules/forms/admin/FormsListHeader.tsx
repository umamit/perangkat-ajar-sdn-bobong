'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';

interface FormsListHeaderProps {
  creating: boolean;
  onCreateNew: () => void;
}

export const FormsListHeader: React.FC<FormsListHeaderProps> = ({ creating, onCreateNew }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">FormAjar</h1>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Formulir digital mandiri, kuis penilaian otomatis, & survei online.
        </p>
      </div>
      <button
        onClick={onCreateNew}
        disabled={creating}
        className="h-11 px-5 rounded-xl bg-[#12A5B8] hover:bg-[#0A7E8D] text-white font-semibold text-sm inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
      >
        <Plus className="w-4 h-4" /> {creating ? 'Membuat...' : 'Buat Formulir Baru'}
      </button>
    </div>
  );
};
