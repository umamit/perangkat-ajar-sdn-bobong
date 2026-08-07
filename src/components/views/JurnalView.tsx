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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Jurnal Mengajar {currentTeacher?.role || 'Guru'}</h3>
          <p className="text-xs text-slate-500">Catatan pelaksanaan pembelajaran harian dan topik per kelas</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1.5">
            <i className="ri-file-excel-2-line text-sm text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50 gap-1.5">
            <i className="ri-file-pdf-2-line text-sm" /> Cetak PDF Jurnal
          </Button>
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1">
            <i className="ri-add-line" /> Isi Jurnal Hari Ini
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal & Jam</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Materi / Topik</TableHead>
                <TableHead>Presensi</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-center w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journals.map((j, idx) => (
                <TableRow key={j.id || idx}>
                  <TableCell className="font-bold text-xs">
                    {j.date}
                    <div className="text-[10px] text-slate-400 font-normal">{j.time || '-'}</div>
                  </TableCell>
                  <TableCell><Badge variant="default">{j.classId}</Badge></TableCell>
                  <TableCell className="font-semibold text-xs text-slate-800">{j.topic}</TableCell>
                  <TableCell className="text-xs text-slate-600">{j.attendance || '-'}</TableCell>
                  <TableCell className="text-xs text-slate-500 max-w-xs truncate">{j.notes || '-'}</TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleDelete(j.id)}
                      className="p-1.5 rounded-apple-sm text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                      title="Hapus Jurnal"
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {journals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8 text-xs">
                    Belum ada jurnal mengajar terisi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Tambah Jurnal Mengajar Harian</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="jurnalDate">Tanggal Mengajar</Label>
              <Input
                id="jurnalDate"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="jurnalClass">Kelas</Label>
              <select
                id="jurnalClass"
                value={form.classId}
                onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="jurnalTopic">Materi / Topik Pembelajaran</Label>
              <Input
                id="jurnalTopic"
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                placeholder="Contoh: Unit 2 - Family Members"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="jurnalNotes">Catatan / Refleksi Guru</Label>
              <Input
                id="jurnalNotes"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Catatan perkembangan atau kendala..."
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Jurnal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
