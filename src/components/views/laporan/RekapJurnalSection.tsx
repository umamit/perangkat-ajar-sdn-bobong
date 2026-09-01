'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { downloadRekapJurnalPDF, RekapJournalItem } from '@/modules/generateRekapJurnalPDF';

export function RekapJurnalSection() {
  const { journals, teachers, showToast } = useApp();
  
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth(); // 0-11

  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonthIdx + 1));
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedTeacherNip, setSelectedTeacherNip] = useState<string>('ALL');
  const [printing, setPrinting] = useState(false);

  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  const years = [
    String(currentYear - 1),
    String(currentYear),
    String(currentYear + 1)
  ];

  const handleCetakPDF = async () => {
    setPrinting(true);
    try {
      // 1. Filter journals by selected month and year
      const filteredJournals = journals.filter(j => {
        if (!j.date) return false;
        const d = new Date(j.date);
        const matchMonth = d.getMonth() + 1 === Number(selectedMonth);
        const matchYear = d.getFullYear() === Number(selectedYear);
        const matchTeacher = selectedTeacherNip === 'ALL' || j.teacherNip === selectedTeacherNip;
        return matchMonth && matchYear && matchTeacher;
      });

      if (filteredJournals.length === 0) {
        showToast('Tidak ada data jurnal mengajar pada periode yang dipilih.', 'error');
        setPrinting(false);
        return;
      }

      // Sort journals chronologically
      const sortedJournals = [...filteredJournals].sort((a, b) => a.date.localeCompare(b.date));

      // Map to RekapJournalItem format
      const rekapItems: RekapJournalItem[] = sortedJournals.map(j => {
        const teacher = teachers.find(t => t.nip === j.teacherNip);
        // Date formatting: e.g. "Senin, 12 Agt"
        let formattedDate = j.date;
        try {
          const dateObj = new Date(j.date);
          formattedDate = dateObj.toLocaleDateString('id-ID', {
            weekday: 'short', day: 'numeric', month: 'short'
          });
        } catch {}

        return {
          date: formattedDate,
          teacherName: teacher?.name || 'Guru Mata Pelajaran',
          classId: `Kelas ${j.classId}`,
          topic: j.topic,
          notes: j.notes
        };
      });

      const selectedMonthLabel = months.find(m => m.value === selectedMonth)?.label || '';
      const periodStr = `${selectedMonthLabel} ${selectedYear}`;
      const teacherName = selectedTeacherNip === 'ALL' ? undefined : teachers.find(t => t.nip === selectedTeacherNip)?.name;

      showToast('Menghasilkan berkas rekapitulasi...', 'info');
      await downloadRekapJurnalPDF({
        journals: rekapItems,
        periodStr,
        filterTeacherName: teacherName
      });
      showToast('Rekapitulasi Jurnal Berhasil Diunduh!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal menghasilkan rekapitulasi PDF.', 'error');
    } finally {
      setPrinting(false);
    }
  };

  return (
    <Card className="rounded-[24px] border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden text-left text-xs">
      <CardHeader className="pb-3 border-b border-slate-100 bg-white/35">
        <CardTitle className="text-base font-black text-slate-800 flex items-center gap-2">
          <i className="ri-file-pdf-2-line text-[#2A9D5C]" /> Cetak Rekap Jurnal Mengajar Guru
        </CardTitle>
        <p className="text-[10px] text-slate-455 font-bold">Fasilitas administrasi Kepala Sekolah untuk mengunduh kompilasi jurnal guru.</p>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-600">Pilih Bulan</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="h-10 rounded-xl bg-white border-slate-200">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-slate-600">Pilih Tahun</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-10 rounded-xl bg-white border-slate-200">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {years.map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-slate-600">Guru Mengajar</Label>
            <Select value={selectedTeacherNip} onValueChange={setSelectedTeacherNip}>
              <SelectTrigger className="h-10 rounded-xl bg-white border-slate-200">
                <SelectValue placeholder="Semua Guru" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL">Semua Guru ({teachers.length})</SelectItem>
                {teachers.map(t => (
                  <SelectItem key={t.nip} value={t.nip}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleCetakPDF}
            disabled={printing}
            className="w-full sm:w-auto px-6 rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 flex items-center gap-2"
          >
            {printing ? (
              <>Memproses PDF...</>
            ) : (
              <>
                <i className="ri-printer-line text-sm" /> Unduh Rekap Jurnal Harian (PDF)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
