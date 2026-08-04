'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_DATA } from '@/data';

export function TugasView() {
  const { showToast } = useApp();

  const assignments = (INITIAL_DATA as any).assignments || [
    { title: 'Worksheet 1: Greetings & Self Introduction', classId: '1A', type: 'LKS', date: '2025-08-10' },
    { title: 'Task 2: My Family Tree Drawing & Labeling', classId: '2A', type: 'Tugas Proyek', date: '2025-08-15' },
    { title: 'Quiz 1: School Objects Vocabulary', classId: '3A', type: 'Bank Soal', date: '2025-08-20' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Tugas & Lembar Kerja Siswa (LKS)</h3>
          <p className="text-xs text-slate-500">Bank soal, tugas proyek, dan lembar kerja cetak siswa SD</p>
        </div>
        <Button size="sm" onClick={() => (window as any).showAddTugasModal()}>
          <i className="ri-add-line" /> Buat Tugas Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((t: any, idx: number) => (
          <Card key={idx} className="hover:border-primary/50 transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge variant="default">{t.classId}</Badge>
                <Badge variant="secondary">{t.type}</Badge>
              </div>
              <CardTitle className="text-base font-bold text-slate-800 mt-2">
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-slate-500">Tanggal Dibuat: {t.date}</p>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => showToast('Mencetak lembar kerja siswa...', 'info')}>
                  <i className="ri-printer-line" /> Cetak LKS
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
