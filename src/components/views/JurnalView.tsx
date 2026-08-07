import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { downloadJurnalPDF } from '@/modules/generateJurnalPDF';
import { exportJurnalExcel } from '@/modules/exportJurnalExcel';
import { saveJournalToSupabase, deleteJournalFromSupabase } from '@/lib/supabase';

export function JurnalView() {
  const { journals, setJournals, classes, currentTeacher, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '07.30 - 08.40',
    classId: classes[0]?.id || '1A',
    topic: '',
    notes: '',
    attendance: 'Hadir Seluruh Siswa'
  });

  const [beautifying, setBeautifying] = useState(false);

  const handleBeautifyNotes = async () => {
    if (!form.notes.trim()) {
      showToast('Ketik draf catatan guru terlebih dahulu', 'error');
      return;
    }
    setBeautifying(true);
    try {
      const res = await fetch('/api/ai/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: form.notes,
          mode: 'sempurnakan_jurnal',
          grade: `Kelas ${form.classId}`,
          subject: currentTeacher?.subject || 'Bahasa Inggris'
        }),
      });

      const data = await res.json();
      if (data.result) {
        setForm(f => ({ ...f, notes: data.result }));
        showToast('Catatan jurnal berhasil disempurnakan!', 'success');
      } else if (data.fallbackResponse) {
        setForm(f => ({ ...f, notes: data.fallbackResponse }));
        showToast('Menampilkan draf bawaan (API Key belum diaktifkan)', 'info');
      } else {
        showToast(data.error || 'Gagal menyempurnakan catatan', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan koneksi', 'error');
    } finally {
      setBeautifying(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus entry jurnal mengajar ini?')) {
      try {
        setJournals(prev => prev.filter(j => j.id !== id));
        await deleteJournalFromSupabase(id);
        showToast('Jurnal mengajar berhasil dihapus dari cloud', 'info');
      } catch (e) {
        showToast('Gagal menghapus jurnal', 'error');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      showToast('Topik pembelajaran wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      const newJ = {
        id: `J-${Date.now()}`,
        date: form.date,
        time: form.time,
        classId: form.classId,
        topic: form.topic.trim(),
        notes: form.notes.trim() || '-',
        attendance: form.attendance,
        teacherNip: currentTeacher?.nip
      };
      
      const success = await saveJournalToSupabase(newJ);
      if (success) {
        setJournals(prev => [newJ, ...prev]);
        showToast('Jurnal mengajar berhasil disimpan ke Supabase Cloud', 'success');
        setShowModal(false);
        setForm({
          date: new Date().toISOString().split('T')[0],
          time: '07.30 - 08.40',
          classId: classes[0]?.id || '1A',
          topic: '',
          notes: '',
          attendance: 'Hadir Seluruh Siswa'
        });
      } else {
        showToast('Gagal menyimpan jurnal ke cloud', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
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
    } catch (e) {
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
    } catch (e) {
      showToast('Gagal mengekspor file Excel Jurnal', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Jurnal Mengajar {currentTeacher?.role || 'Guru'}</h3>
          <p className="text-xs text-slate-500 font-semibold">Catatan pelaksanaan pembelajaran harian dan topik per kelas</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-black text-emerald-700 border-emerald-200 hover:bg-emerald-50/50 gap-1.5 rounded-xl">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-black text-rose-700 border-rose-250 hover:bg-rose-50/50 gap-1.5 rounded-xl">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Jurnal
          </Button>
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1 rounded-xl font-black text-xs bg-primary hover:bg-primary-dark text-white">
            <i className="ri-add-line" /> Isi Jurnal Hari Ini
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Tanggal & Jam</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Kelas</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Materi / Topik</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Presensi</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Catatan</TableHead>
                <TableHead className="text-center w-20 font-black text-[10px] uppercase text-slate-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journals.map((j, idx) => (
                <TableRow key={j.id || idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                  <TableCell className="font-bold text-xs text-slate-700">
                    {j.date}
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{j.time || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="font-black text-[10px] rounded-md px-2 py-0.5">{j.classId}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs text-slate-800">{j.topic}</TableCell>
                  <TableCell className="text-xs font-semibold text-slate-600">{j.attendance || '-'}</TableCell>
                  <TableCell className="text-xs font-medium text-slate-500 max-w-xs truncate">{j.notes || '-'}</TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleDelete(j.id)}
                      className="p-1.5 rounded-lg text-rose-450 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Hapus Jurnal"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {journals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs font-semibold">
                    Belum ada jurnal mengajar terisi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
              <i className="ri-book-mark-line text-primary" /> Tambah Jurnal Mengajar Harian
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="jurnalDate" className="font-bold text-slate-650">Tanggal Mengajar</Label>
              <Input
                id="jurnalDate"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="jurnalClass" className="font-bold text-slate-655">Kelas</Label>
              <select
                id="jurnalClass"
                value={form.classId}
                onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="jurnalTopic" className="font-bold text-slate-650">Materi / Topik Pembelajaran</Label>
              <Input
                id="jurnalTopic"
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                placeholder="Contoh: Unit 2 - Family Members"
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <div className="flex justify-between items-center mb-0.5">
                <Label htmlFor="jurnalNotes" className="font-bold text-slate-650">Catatan / Refleksi Guru</Label>
                <button
                  type="button"
                  onClick={handleBeautifyNotes}
                  disabled={beautifying}
                  className="text-[9px] text-primary hover:bg-cyan-50/50 font-black flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 transition-all duration-300 transform active:scale-95 shadow-sm"
                >
                  {beautifying ? 'Memproses...' : '✨ Perbaiki dengan AI'}
                </button>
              </div>
              <textarea
                id="jurnalNotes"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Catatan perkembangan atau kendala pembelajaran..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
              />
            </div>
            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="rounded-xl h-10 text-xs font-bold">
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10">
                {saving ? 'Menyimpan...' : 'Simpan Jurnal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
