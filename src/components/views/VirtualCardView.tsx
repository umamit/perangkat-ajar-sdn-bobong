'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudentCardItem } from './virtual-card/StudentCardItem';
import { StudentCardModal } from './virtual-card/StudentCardModal';

export function VirtualCardView() {
  const { students, classes } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isModalCardFlipped, setIsModalCardFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  useEffect(() => {
    setSelectedStudent(null);
  }, [selectedClassId]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintSingle = () => {
    document.body.classList.add('print-single-active');
    
    const cleanup = () => {
      document.body.classList.remove('print-single-active');
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();

    // Fallback cleanup
    setTimeout(cleanup, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 print:space-y-0 print:p-0 virtual-card-view">
      {/* Controls: Hidden on print */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden virtual-card-controls">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
            <i className="ri-contacts-fill text-primary" /> Kartu Siswa Virtual
          </h3>
          <p className="text-xs text-slate-500 font-semibold">Cetak kartu pelajar virtual resmi dilengkapi QR Code absensi digital</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-bold outline-none focus:ring-2 focus:ring-primary/20 h-10 shadow-sm"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <Button
            onClick={handlePrint}
            disabled={filteredStudents.length === 0}
            className="h-10 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 gap-2 shadow-md shadow-primary/10"
          >
            <i className="ri-printer-line text-sm" /> Cetak Kartu Kelas ({filteredStudents.length})
          </Button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 font-bold text-xs bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl print:hidden virtual-card-grid">
          <i className="ri-user-unfollow-line text-3xl block text-slate-400 mb-2" />
          Belum ada data siswa di kelas ini.
        </Card>
      ) : (
        /* Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center print:grid-cols-2 print:gap-4 print:bg-white print:w-full print:block virtual-card-grid">
          {filteredStudents.map(s => (
            <StudentCardItem
              key={s.id}
              student={s}
              selectedClassId={selectedClassId}
              isFlipped={!!flippedCards[s.id]}
              onFlip={(e) => toggleFlip(s.id, e)}
              onClick={() => {
                setSelectedStudent(s);
                setIsModalCardFlipped(false);
              }}
            />
          ))}
        </div>
      )}

      {/* DETAIL MODAL (MODAL POPUP) */}
      <StudentCardModal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
        selectedClassId={selectedClassId}
        isModalCardFlipped={isModalCardFlipped}
        setIsModalCardFlipped={setIsModalCardFlipped}
        handlePrintSingle={handlePrintSingle}
      />

      {/* Print Single Card Container (Visible only on print when print-single-active is active) */}
      {selectedStudent && (
        <div className="hidden print-single-card-container">
          <StudentCardItem
            student={selectedStudent}
            selectedClassId={selectedClassId}
          />
        </div>
      )}
    </div>
  );
}
