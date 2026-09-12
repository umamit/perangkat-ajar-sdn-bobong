'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import AdminFormsListPage from '@/app/admin/forms/page';

export const FormsView: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Modul Formulir Digital Mandiri (FormAjar)</h2>
          <p className="text-xs text-slate-500">Kelola kuis ujian otomatis, kuisioner survei, & formulir tanpa login Google.</p>
        </div>
        <Link
          href="/admin/forms"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          <span>Buka Tab Penuh</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden">
        <AdminFormsListPage />
      </div>
    </div>
  );
};
