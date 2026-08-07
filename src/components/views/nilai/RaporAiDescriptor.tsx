'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

interface RaporAiDescriptorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  studentClass: string;
  subject: string;
  score: number;
}

export function RaporAiDescriptor({ open, onOpenChange, studentName, studentClass, subject, score }: RaporAiDescriptorProps) {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setDesc(null);
    try {
      const res = await fetch('/api/ai/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: studentName,
          mode: 'deskripsi_rapor',
          grade: `Kelas ${studentClass}`,
          subject: subject,
          score: score
        }),
      });

      const data = await res.json();
      if (data.result) {
        setDesc(data.result);
        showToast('Deskripsi Capaian Kompetensi Berhasil Dibuat!', 'success');
      } else if (data.fallbackResponse) {
        setDesc(data.fallbackResponse);
        showToast('Menampilkan draf bawaan (API Key belum diatur)', 'info');
      } else {
        showToast(data.error || 'Gagal memanggil AI', 'error');
      }
    } catch (e) {
      showToast('Gagal memanggil AI, silakan periksa koneksi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!desc) return;
    navigator.clipboard.writeText(desc);
    showToast('Deskripsi berhasil disalin ke clipboard!', 'success');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
            <i className="ri-magic-line text-primary" /> Asisten Deskripsi Rapor AI
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-500">Nama Siswa:</span>
              <span className="text-slate-800 font-bold">{studentName}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-slate-500">Kelas / Mapel:</span>
              <span className="text-slate-800 font-bold">{studentClass} / {subject}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-slate-500">Nilai Akhir:</span>
              <span className="text-primary font-black text-sm">{score}</span>
            </div>
          </div>

          {desc ? (
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">Rekomendasi Narasi Rapor:</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-none focus:border-primary font-medium leading-relaxed bg-slate-50/50"
              />
              <Button onClick={handleCopy} className="w-full gap-1.5 text-xs font-bold" variant="outline">
                <i className="ri-file-copy-line" /> Salin Deskripsi
              </Button>
            </div>
          ) : (
            <p className="text-slate-400 text-center font-medium py-3">
              Klik tombol di bawah untuk membuat rumusan narasi deskripsi otomatis berdasarkan nilai Kurikulum Merdeka.
            </p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            <Button onClick={handleGenerate} disabled={loading} className="gap-1.5 font-bold">
              {loading ? (
                <>Menghitung...</>
              ) : (
                <>
                  <i className="ri-cpu-line" /> {desc ? 'Generate Ulang' : 'Generate Deskripsi'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
