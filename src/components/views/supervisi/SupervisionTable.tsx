'use client';

import React from 'react';
import { SupervisionItem } from '@/types/supervision';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  items: SupervisionItem[];
  onEdit: (item: SupervisionItem) => void;
  onDelete: (id: string, name: string) => void;
  onPrint: (item: SupervisionItem) => void;
}

export function SupervisionTable({ items, onEdit, onDelete, onPrint }: Props) {
  const getBadgeVariant = (pred: string) => {
    switch (pred) {
      case 'Sangat Baik': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Baik': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Cukup': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-xs font-semibold">
        <i className="ri-shield-check-line text-3xl block mb-2 text-slate-300" />
        Belum ada catatan observasi supervisi kelas. Klik &apos;Tambah Observasi Baru&apos; untuk memulai.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase">
            <th className="py-3 px-4">Tanggal</th>
            <th className="py-3 px-4">Guru yang Disupervisi</th>
            <th className="py-3 px-4">Mapel & Kelas</th>
            <th className="py-3 px-4">Topik Pembelajaran</th>
            <th className="py-3 px-4 text-center">Skor & Predikat</th>
            <th className="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-4 font-bold text-slate-600 whitespace-nowrap">{item.date}</td>
              <td className="py-3 px-4">
                <span className="font-extrabold text-slate-900 block">{item.teacherName}</span>
                <span className="text-[10px] text-slate-400 font-mono">NIP: {item.teacherNip || '-'}</span>
              </td>
              <td className="py-3 px-4">
                <span className="font-bold text-slate-800 block">{item.subject}</span>
                <span className="text-[10px] text-slate-500 font-bold">Kelas {item.classId}</span>
              </td>
              <td className="py-3 px-4 text-slate-600 font-medium max-w-[200px] truncate" title={item.topic}>
                {item.topic}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="font-black text-slate-800 block">{item.totalScore}/28 ({item.percentage}%)</span>
                <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md border mt-0.5 ${getBadgeVariant(item.predicate)}`}>
                  {item.predicate}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPrint(item)}
                    className="h-7 px-2 rounded-lg text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100 text-[10px] font-bold flex items-center gap-1"
                    title="Cetak Berita Acara & Lembar PDF"
                  >
                    <i className="ri-file-pdf-2-line text-xs" /> PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="h-7 w-7 p-0 rounded-lg text-slate-600 hover:bg-slate-100"
                    title="Edit Observasi"
                  >
                    <i className="ri-edit-line text-xs" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id, item.teacherName)}
                    className="h-7 w-7 p-0 rounded-lg text-rose-600 border-rose-100 hover:bg-rose-50"
                    title="Hapus"
                  >
                    <i className="ri-delete-bin-line text-xs" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
