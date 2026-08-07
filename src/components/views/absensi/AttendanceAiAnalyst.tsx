'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';

interface AttendanceAiAnalystProps {
  selectedClass: string;
}

export function AttendanceAiAnalyst({ selectedClass }: AttendanceAiAnalystProps) {
  const { attendance, students, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    classId: string;
    details: string;
  } | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Group absences by student_id
  const classStudents = students.filter(s => s.classId === selectedClass);
  
  const flagged = classStudents.map(student => {
    const studentAbsences = attendance.filter(a => a.student_id === student.id && a.class_id === selectedClass);
    const sakit = studentAbsences.filter(a => a.status === 'Sakit').length;
    const izin = studentAbsences.filter(a => a.status === 'Izin').length;
    const alpa = studentAbsences.filter(a => a.status === 'Alpa').length;
    const total = sakit + izin + alpa;

    return {
      student,
      sakit,
      izin,
      alpa,
      total
    };
  }).filter(item => item.total >= 3);

  const handleAnalystClick = async (studentName: string, classId: string, details: string) => {
    setLoading(true);
    setAiReport(null);
    setSelectedStudent({ name: studentName, classId, details });
    try {
      const res = await fetch('/api/ai/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: studentName,
          mode: 'rekomendasi_absensi',
          grade: `Kelas ${classId}`,
          details: details
        }),
      });

      const data = await res.json();
      if (data.result) {
        setAiReport(data.result);
        showToast('Analisis absensi & draf surat berhasil dirumuskan!', 'success');
      } else if (data.fallbackResponse) {
        setAiReport(data.fallbackResponse);
        showToast('Menampilkan draf bawaan (API Key belum diaktifkan)', 'info');
      } else {
        showToast(data.error || 'Gagal memanggil AI', 'error');
      }
    } catch (e) {
      showToast('Gagal memproses analisis AI', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    showToast('Teks analisis & draf surat berhasil disalin!', 'success');
  };

  if (flagged.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
          <i className="ri-error-warning-line text-base text-amber-600 animate-pulse" /> Deteksi Dini Absensi Siswa (Peringatan AI)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-3">
        <p className="text-amber-700 font-medium">
          Ditemukan {flagged.length} siswa dengan ketidakhadiran 3 kali atau lebih di Kelas {selectedClass}. Guru disarankan menindaklanjuti.
        </p>
        <div className="space-y-2">
          {flagged.map(({ student, sakit, izin, alpa, total }) => {
            const detailsText = `${sakit} Sakit, ${izin} Izin, ${alpa} Alpa (Total: ${total} Hari)`;
            return (
              <div key={student.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">{student.name}</span>
                  <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                    {detailsText}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAnalystClick(student.name, student.classId, detailsText)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] h-7 px-3 gap-1"
                >
                  <i className="ri-magic-line" /> Rekomendasi AI
                </Button>
              </div>
            );
          })}
        </div>

        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-lg bg-white p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <i className="ri-file-text-line text-primary" /> Analisis Peringatan Kehadiran AI
              </DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4 mt-2 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Nama Siswa:</span>
                    <span className="text-slate-800 font-bold">{selectedStudent.name}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Ketidakhadiran:</span>
                    <span className="text-rose-600 font-bold">{selectedStudent.details}</span>
                  </div>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-slate-400 font-semibold flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    AI sedang merumuskan draf surat panggilan dan bimbingan konseling...
                  </div>
                ) : (
                  aiReport && (
                    <div className="space-y-2">
                      <label className="font-bold text-slate-700 block">Rekomendasi Tindakan & Draf Surat:</label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed font-mono text-[10px] text-slate-800">
                        {aiReport}
                      </div>
                      <Button onClick={handleCopy} className="w-full gap-1.5 font-bold mt-2" variant="outline">
                        <i className="ri-file-copy-line" /> Salin Draf Surat & Rekomendasi
                      </Button>
                    </div>
                  )
                )}

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                    Tutup
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
