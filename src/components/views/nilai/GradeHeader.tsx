'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface GradeHeaderProps {
  selectedSubject: string;
  onExportExcel: () => void;
  onDownloadPDF: () => void;
}

export function GradeHeader({
  selectedSubject,
  onExportExcel,
  onDownloadPDF,
}: GradeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="text-lg font-black text-slate-800 tracking-tight">
          Daftar Nilai Rapor Kelas - {selectedSubject}
        </h3>
        <p className="text-xs text-slate-500 font-semibold">
          Kalkulasi nilai otomatis berdasarkan pembagian subjek dan guru yang login
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportExcel}
          className="text-xs font-black bg-emerald-50/80 backdrop-blur-sm text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100/80 shadow-xs gap-1.5 rounded-xl"
        >
          <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadPDF}
          className="text-xs font-black bg-rose-50/80 backdrop-blur-sm text-rose-700 border border-rose-200/60 hover:bg-rose-100/80 shadow-xs gap-1.5 rounded-xl"
        >
          <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Nilai
        </Button>
      </div>
    </div>
  );
}
