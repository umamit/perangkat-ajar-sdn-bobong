'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ModulView() {
  const { modules, showToast } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Perangkat & Modul Ajar Kurikulum Merdeka</h3>
          <p className="text-xs text-slate-500">Modul Ajar Bahasa Inggris SD Negeri Bobong (TP, ATP, Alokasi Waktu)</p>
        </div>
        <Button size="sm" onClick={() => (window as any).showAddModulModal()}>
          <i className="ri-upload-cloud-line" /> Unggah Modul Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m, idx) => (
          <Card key={m.id || idx} className="hover:border-primary/50 transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge variant="default">{m.grade || m.phase || 'Fase A'}</Badge>
                <i className="ri-file-text-line text-2xl text-primary" />
              </div>
              <CardTitle className="text-base font-bold text-slate-800 mt-2">
                {m.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Tujuan Pembelajaran (TP):</span>
                <p className="text-slate-500 line-clamp-2">{m.tp || 'Mengidentifikasi kosakata dasar'}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Alur Tujuan Pembelajaran (ATP):</span>
                <p className="text-slate-500 line-clamp-2">{m.atp || 'Menyimak, menirukan, dan merespon instruksi sederhana'}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 font-semibold">
                <span className="text-slate-400">Waktu: {m.duration || '2 x 35 Menit'}</span>
                <Button variant="outline" size="sm" onClick={() => showToast('Membuka file modul ajar...', 'info')}>
                  <i className="ri-download-line" /> Unduh PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
