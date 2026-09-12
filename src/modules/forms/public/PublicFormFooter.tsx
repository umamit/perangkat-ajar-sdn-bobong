'use client';

import React from 'react';

interface PublicFormFooterProps {
  isSubmitting: boolean;
  onClearForm: () => void;
}

export const PublicFormFooter: React.FC<PublicFormFooterProps> = ({
  isSubmitting,
  onClearForm,
}) => {
  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-6 bg-[#12A5B8] hover:bg-[#0A7E8D] text-white rounded font-medium shadow-xs transition-colors text-sm disabled:opacity-50 active:scale-98"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim'}
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClearForm}
          className="text-xs text-slate-500 hover:text-[#12A5B8] font-medium transition-colors"
        >
          Kosongkan formulir
        </button>
      </div>

      <div className="pt-6 text-center text-xs text-slate-400 space-y-1">
        <p>Konten ini dibuat oleh SD Negeri Bobong.</p>
        <p className="font-semibold text-slate-500">FormAjar - Formulir Digital Mandiri</p>
      </div>
    </>
  );
};
