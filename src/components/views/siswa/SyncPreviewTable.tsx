'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SyncPreviewTableProps {
  previewData: any[];
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function SyncPreviewTable({
  previewData,
  loading,
  onSave,
  onCancel,
}: SyncPreviewTableProps) {
  if (previewData.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 text-left">
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Preview Hasil Pemetaan ({previewData.length} Siswa)
        </h5>
        <Badge className="bg-teal-500/10 text-teal-700 border border-teal-500/20 text-[9px] font-black rounded-lg">
          Siap Disinkronkan
        </Badge>
      </div>

      <div className="border border-slate-200/80 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left text-[10px] border-collapse min-w-[340px]">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-200/80 font-bold text-slate-600">
              <tr>
                <th className="p-2 whitespace-nowrap">Nama Lengkap</th>
                <th className="p-2 whitespace-nowrap">NISN</th>
                <th className="p-2 whitespace-nowrap">L/P</th>
                <th className="p-2 whitespace-nowrap">Pemetaan Kelas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
              {previewData.slice(0, 10).map((s, idx) => (
                <tr key={s.id || idx}>
                  <td className="p-2 font-bold truncate max-w-[140px]">{s.name}</td>
                  <td className="p-2 whitespace-nowrap">{s.nisn || '-'}</td>
                  <td className="p-2">{s.gender}</td>
                  <td className="p-2">
                    <Badge className="bg-primary/10 text-primary font-black border border-primary/25 rounded px-1.5 py-0.5">
                      {s.classId}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {previewData.length > 10 && (
          <div className="bg-slate-50 p-2 text-center text-[9px] font-bold text-slate-400 border-t border-slate-100">
            + {previewData.length - 10} data siswa lainnya...
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 mt-4 print:hidden">
        <Button
          onClick={onSave}
          disabled={loading}
          className="flex-1 h-9 rounded-xl bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 text-xs font-black gap-2"
        >
          {loading ? (
            <>
              <i className="ri-loader-4-line animate-spin text-sm" /> Menyimpan Data ke Cloud...
            </>
          ) : (
            <>
              <i className="ri-database-2-line text-sm" /> Simpan {previewData.length} Siswa ke Database
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="h-9 rounded-xl text-xs font-bold border-slate-200"
        >
          Batal
        </Button>
      </div>
    </div>
  );
}
