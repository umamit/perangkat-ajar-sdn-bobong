'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit3, BarChart2, Share2, Check, Trash2 } from 'lucide-react';
import { FormModel } from '@/types/form';

interface FormCardProps {
  form: FormModel;
  copiedSlug: string | null;
  onCopyLink: (slug: string) => void;
  onRequestDelete: (form: FormModel) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  form,
  copiedSlug,
  onCopyLink,
  onRequestDelete,
}) => {
  const isCopied = copiedSlug === form.slug;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            form.type === 'quiz' ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'
          }`}>
            {form.type === 'quiz' ? 'Kuis' : 'Standar'}
          </span>
          <span className={`text-xs font-semibold ${form.is_active ? 'text-[#2A9D5C]' : 'text-slate-400'}`}>
            {form.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-800 line-clamp-1">{form.title}</h3>
        <p className="text-slate-500 text-xs mt-1 line-clamp-2">{form.description || 'Tidak ada deskripsi.'}</p>
        {form.created_by && (
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Guru: {form.created_by}</p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onCopyLink(form.slug)}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-[#2A9D5C]" /> : <Share2 className="w-3.5 h-3.5" />}
          {isCopied ? 'Tersalin' : 'Bagikan'}
        </button>
        <div className="flex items-center gap-1.5">
          <Link href={`/admin/forms/${form.id}/responses`} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#12A5B8]" title="Lihat Tanggapan">
            <BarChart2 className="w-4 h-4" />
          </Link>
          <Link href={`/admin/forms/${form.id}/edit`} className="p-2 rounded-lg bg-[#12A5B8] text-white hover:bg-[#0A7E8D]" title="Edit Formulir">
            <Edit3 className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => onRequestDelete(form)}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 transition-colors"
            title="Hapus Formulir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
