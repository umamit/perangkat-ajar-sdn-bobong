'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SupervisionTable } from './supervisi/SupervisionTable';
import { SupervisionModalForm } from './supervisi/SupervisionModalForm';
import { useSupervisionManagement } from './supervisi/useSupervisionManagement';

export function SupervisiView() {
  const s = useSupervisionManagement();

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Supervisi Akademik & Kinerja Guru</h3>
          <p className="text-xs text-slate-500 font-semibold">Instrumen penilaian dan catatan observasi pembelajaran kelas</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            s.setEditingItem(null);
            s.setIsModalOpen(true);
          }}
          className="gap-1.5 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 hover:brightness-105"
        >
          <i className="ri-add-line text-sm" /> Tambah Observasi Baru
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 p-3 rounded-2xl border border-white/80 shadow-xs">
        <div className="relative w-full sm:w-72">
          <i className="ri-search-line absolute left-3 top-2.5 text-slate-400 text-xs" />
          <Input
            type="text"
            placeholder="Cari guru, mapel, atau topik..."
            value={s.search}
            onChange={e => s.setSearch(e.target.value)}
            className="pl-8 text-xs h-9 rounded-xl border-slate-200 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Kelas:</span>
          <select
            value={s.filterClass}
            onChange={e => s.setFilterClass(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none w-full sm:w-auto"
          >
            <option value="ALL">Semua Kelas</option>
            {s.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <SupervisionTable
            items={s.items}
            onEdit={item => {
              s.setEditingItem(item);
              s.setIsModalOpen(true);
            }}
            onDelete={s.handleDelete}
            onPrint={s.handlePrint}
          />
        </CardContent>
      </Card>

      <SupervisionModalForm
        isOpen={s.isModalOpen}
        onOpenChange={s.setIsModalOpen}
        initialData={s.editingItem}
        teachers={s.teachers}
        classes={s.classes}
        onSave={s.handleSave}
      />
    </div>
  );
}
