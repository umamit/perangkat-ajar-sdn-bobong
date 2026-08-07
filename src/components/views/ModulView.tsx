'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { downloadModulPDF } from '@/modules/generateModulPDF';

export function ModulView() {
  const { modules, currentTeacher, showToast } = useApp();

  const handleDownloadPDF = async (m: any) => {
    try {
      showToast(`Memproses Berkas PDF Modul ${m.title}...`, 'info');
      await downloadModulPDF({
        modul: {
          title: m.title,
          fase: m.grade || m.phase || 'Fase A',
          classId: m.classId || '1A',
          description: m.tp ? `TP: ${m.tp}\nATP: ${m.atp || '-'}` : undefined,
        },
        teacherName: currentTeacher?.name,
        teacherNip: currentTeacher?.nip,
        teacherRole: currentTeacher?.role,
        teacherSubject: currentTeacher?.subject,
      });
      showToast(`PDF Modul ${m.title} Berhasil Diunduh!`, 'success');
    } catch (e) {
      showToast('Gagal mencetak PDF Modul Ajar', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Perangkat & Modul Ajar Kurikulum Merdeka</h3>
          <p className="text-xs text-slate-500">Modul Ajar {currentTeacher?.subject || 'Mata Pelajaran'} SD Negeri Bobong (TP, ATP, Alokasi Waktu)</p>
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
                <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(m)} className="gap-1 font-bold text-rose-700 border-rose-300 hover:bg-rose-50">
                  <i className="ri-file-pdf-2-line text-rose-600" /> Unduh PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
