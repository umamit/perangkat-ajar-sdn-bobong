'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function KelasView() {
  const { classes, students, setActiveView, setSelectedClassFilter } = useApp();

  const classMap = new Map<string, any>();
  (classes || []).forEach(c => {
    if (c && c.id && !classMap.has(c.id)) {
      classMap.set(c.id, c);
    }
  });
  const uniqueClasses = Array.from(classMap.values());

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Daftar Kelas SD Negeri Bobong</h3>
        <p className="text-xs text-slate-500">Daftar kelas binaan dan statistik jumlah siswa terdaftar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uniqueClasses.map(c => {
          const studentCount = students.filter(s => {
            const studentClassNorm = (s.classId || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            const classNorm = (c.id || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            return studentClassNorm === classNorm || s.classId === c.id;
          }).length;

          return (
            <Card
              key={c.id}
              className="cursor-pointer hover:border-primary/50 transition-all duration-200"
              onClick={() => {
                setSelectedClassFilter(c.id);
                setActiveView('siswa');
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Badge variant="default">{c.phase || 'Fase A'}</Badge>
                  <i className="ri-building-line text-2xl text-primary" />
                </div>
                <CardTitle className="text-lg font-extrabold text-slate-800 mt-2">
                  {c.name}
                </CardTitle>
                <p className="text-xs text-slate-500">{c.room || 'Ruang Kelas'}</p>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-between items-center text-xs font-semibold pt-3 border-t border-slate-100">
                  <span className="text-slate-500">Siswa Terdaftar:</span>
                  <span className={`font-black ${studentCount > 0 ? 'text-primary-dark' : 'text-slate-400'}`}>
                    {studentCount} Orang
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
