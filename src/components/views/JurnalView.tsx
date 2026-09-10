'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { downloadJurnalPDF } from '@/modules/generateJurnalPDF';
import { exportJurnalExcel } from '@/modules/exportJurnalExcel';
import { deleteJournalFromSupabase } from '@/lib/supabase';
import { JournalTable } from './jurnal/JournalTable';
import { AddJournalModal } from './jurnal/AddJournalModal';
import { Journal } from '@/types';

export function JurnalView() {
  const { journals, setJournals, classes, currentTeacher, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Hapus jurnal mengajar ini?')) {
      setJournals(prev => prev.filter(j => j.id !== id));
      await deleteJournalFromSupabase(id);
      showToast('Jurnal mengajar berhasil dihapus', 'info');
    }
  };

  const handleDownloadPDF = async () => {
    if (journals.length === 0) {
      showToast('Belum ada jurnal mengajar untuk dicetak', 'error');
      return;
    }
    try {
      showToast('Memproses Berkas PDF Jurnal...', 'info');
      await downloadJurnalPDF({
        journals,
        teacherName: currentTeacher?.name,
        teacherNip: currentTeacher?.nip,
        teacherRole: currentTeacher?.role,
        teacherSubject: currentTeacher?.subject,
      });
      showToast('PDF Jurnal Mengajar Berhasil Diunduh!', 'success');
    } catch {
      showToast('Gagal mencetak PDF Jurnal', 'error');
    }
  };

  const handleExportExcel = () => {
    if (journals.length === 0) {
      showToast('Belum ada jurnal mengajar untuk diekspor', 'error');
      return;
    }
    try {
      showToast('Mengunduh File Excel Jurnal...', 'info');
      exportJurnalExcel(journals);
      showToast('Excel Jurnal Mengajar Berhasil Diunduh!', 'success');
    } catch {
      showToast('Gagal mengekspor file Excel Jurnal', 'error');
    }
  };

  const handleSuccessAdd = (newJournal: Journal) => {
    setJournals(prev => [newJournal, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Jurnal Mengajar {currentTeacher?.role || 'Guru'}
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Catatan pelaksanaan pembelajaran harian dan topik per kelas
          </p>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="text-xs font-black bg-emerald-50/80 backdrop-blur-sm text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100/80 shadow-xs gap-1.5 rounded-xl h-9"
          >
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            className="text-xs font-black bg-rose-50/80 backdrop-blur-sm text-rose-700 border border-rose-200/60 hover:bg-rose-100/80 shadow-xs gap-1.5 rounded-xl h-9"
          >
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Jurnal
          </Button>
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="col-span-2 sm:col-span-1 gap-1 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 h-9"
          >
            <i className="ri-add-line text-base" /> Isi Jurnal Hari Ini
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <JournalTable journals={journals} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <AddJournalModal
        open={showModal}
        onOpenChange={setShowModal}
        classes={classes}
        currentTeacher={currentTeacher}
        onSuccess={handleSuccessAdd}
        showToast={showToast}
      />
    </div>
  );
}
