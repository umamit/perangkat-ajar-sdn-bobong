'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CounselingLog, Student } from '@/types';

interface CounselingTimelineProps {
  logs: CounselingLog[];
  students: Student[];
  classes: Array<{ id: string; name: string }>;
  filterClass: string;
  setFilterClass: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isKepsek: boolean;
  onDelete: (id: string) => void;
}

export function CounselingTimeline({
  logs,
  students,
  classes,
  filterClass,
  setFilterClass,
  filterCategory,
  setFilterCategory,
  searchQuery,
  setSearchQuery,
  isKepsek,
  onDelete,
}: CounselingTimelineProps) {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Bimbingan': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      case 'Konseling': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Kunjungan Rumah': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Telepon Orang Tua': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Card */}
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="font-bold text-slate-600 text-xs">Filter Kelas</Label>
            <select
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 mt-1"
            >
              <option value="ALL">Semua Kelas</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <Label className="font-bold text-slate-600 text-xs">Kategori</Label>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 mt-1"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Bimbingan">Bimbingan</option>
              <option value="Konseling">Konseling</option>
              <option value="Kunjungan Rumah">Kunjungan Rumah</option>
              <option value="Telepon Orang Tua">Telepon Orang Tua</option>
            </select>
          </div>

          <div>
            <Label className="font-bold text-slate-600 text-xs">Cari Siswa</Label>
            <Input
              type="text"
              placeholder="Nama / NIS..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-9 rounded-xl text-xs mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Timeline List */}
      <div className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-white/60 border border-slate-100 rounded-2xl">
            <i className="ri-folder-shield-2-line text-3xl opacity-60 mb-2 block" />
            Tidak ditemukan catatan pembinaan yang cocok.
          </div>
        ) : (
          logs.map(log => {
            const student = students.find(s => s.id === log.studentId);
            return (
              <div key={log.id} className="p-4 bg-white/80 border border-slate-200/80 rounded-2xl relative space-y-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-800 text-xs">{student?.name || 'Siswa Hilang'}</span>
                    <Badge variant="default" className="text-[9px] rounded-md px-1.5 py-0.5">{student?.classId}</Badge>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getCategoryBadge(log.category)}`}>
                      {log.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold">{log.date}</span>
                    {isKepsek && (
                      <button
                        onClick={() => log.id && onDelete(log.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded"
                        title="Hapus Catatan"
                      >
                        <i className="ri-delete-bin-6-line text-sm" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed font-semibold text-xs">{log.notes}</p>
                {log.followUp && (
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="font-extrabold text-slate-600">Tindak Lanjut: </span>
                    {log.followUp}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
