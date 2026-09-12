'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { FormModel } from '@/types/form';

interface DeleteFormDialogProps {
  form: FormModel | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteFormDialog: React.FC<DeleteFormDialogProps> = ({
  form,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-rose-600">
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Hapus Formulir?</h3>
            <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Apakah Anda yakin ingin menghapus formulir <span className="font-semibold text-slate-800">"{form.title}"</span>? Seluruh butir pertanyaan dan riwayat tanggapan yang telah masuk akan dihapus permanen.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Formulir'}
          </button>
        </div>
      </div>
    </div>
  );
};
