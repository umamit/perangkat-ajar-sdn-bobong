'use client';

import React from 'react';
import { ParsedStudent } from './StudentUploadForm';

interface StudentListPreviewProps {
  students: ParsedStudent[];
  targetClass: string;
  submitting: boolean;
  onRemove: (index: number) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export function StudentListPreview({
  students,
  targetClass,
  submitting,
  onRemove,
  onClear,
  onSubmit,
}: StudentListPreviewProps) {
  return (
    <div className="space-y-3">
      {students.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Daftar Siswa Siap Disimpan ({students.length} Siswa):</span>
            <button type="button" onClick={onClear} className="text-[11px] text-rose-600 hover:underline">
              Kosongkan
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
            {students.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">#{idx + 1}</span>
                  <span className="font-bold text-slate-800">{s.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                    {s.gender}
                  </span>
                  {s.nis && <span className="text-[10px] text-slate-400 font-mono">({s.nis})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={submitting || students.length === 0}
        onClick={onSubmit}
        className="w-full h-11 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-black text-xs shadow-md shadow-primary/20 hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <i className="ri-loader-4-line animate-spin" /> Menyimpan ke Database...
          </>
        ) : (
          <>
            <i className="ri-save-3-line text-sm" /> Simpan {students.length > 0 ? `(${students.length} Siswa)` : ''} ke Kelas {targetClass}
          </>
        )}
      </button>
    </div>
  );
}
