'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CardHeader } from '@/components/ui/card';

interface StudentHeaderProps {
  handleExportExcel: () => void;
  handleDownloadPDF: () => void;
  isKepsek: boolean;
  setShowAddModal: (val: boolean) => void;
  setShowImportModal: (val: boolean) => void;
  search: string;
  setSearch: (val: string) => void;
  lockedClass: string | null;
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  classes: any[];
  students: any[];
  normalizeClass: (c: string) => string;
}

export function StudentHeader({
  handleExportExcel,
  handleDownloadPDF,
  isKepsek,
  setShowAddModal,
  setShowImportModal,
  search,
  setSearch,
  lockedClass,
  selectedClass,
  setSelectedClass,
  classes,
  students,
  normalizeClass
}: StudentHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Daftar Siswa SD Negeri Bobong</h3>
          <p className="text-xs text-slate-500 font-semibold">Kelola data siswa, NIS/NISN, dan kelas binaan</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-black text-emerald-700 border-emerald-200 hover:bg-emerald-50/50 gap-1.5 rounded-xl">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-black text-rose-700 border-rose-250 hover:bg-rose-50/50 gap-1.5 rounded-xl">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Siswa
          </Button>
          {isKepsek && (
            <>
              <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1 rounded-xl font-black text-xs bg-primary hover:bg-primary-dark text-white">
                <i className="ri-user-add-line" /> Tambah Siswa
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)} className="gap-1 rounded-xl font-black text-xs border-primary/20 text-primary hover:bg-cyan-50/30">
                <i className="ri-upload-2-line" /> Impor Excel
              </Button>
            </>
          )}
        </div>
      </div>

      <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-72">
            <i className="ri-search-line absolute left-3 top-2.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nama atau NIS siswa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 text-xs h-9 rounded-xl focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600">Filter Kelas:</label>
            {lockedClass ? (
              <Badge variant="default" className="text-[10px] font-black px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                Kelas {lockedClass} (Binaan)
              </Badge>
            ) : (
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white/80 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="ALL">Semua Kelas ({students.length} Siswa)</option>
                {classes.map(c => {
                  const count = students.filter(s => normalizeClass(s.classId) === normalizeClass(c.id)).length;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({count} Siswa)
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
      </CardHeader>
    </>
  );
}
