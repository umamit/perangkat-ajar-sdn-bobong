import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveAssignmentToSupabase } from '@/lib/supabase';

export function TugasView() {
  const { assignments, setAssignments, currentTeacher, classes, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    classId: classes[0]?.id || '1A',
    type: 'Formatif',
    dueDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      const newAssignment = {
        id: `TSK-${Date.now()}`,
        title: form.title.trim(),
        classId: form.classId,
        type: form.type,
        dueDate: form.dueDate,
        status: 'Aktif',
        description: form.description.trim(),
        teacherNip: currentTeacher?.nip
      };

      const success = await saveAssignmentToSupabase(newAssignment);
      if (success) {
        setAssignments(prev => [newAssignment, ...prev]);
        showToast(`Penugasan "${form.title}" berhasil ditambahkan`, 'success');
        setShowModal(false);
        setForm({
          title: '',
          classId: classes[0]?.id || '1A',
          type: 'Formatif',
          dueDate: new Date().toISOString().split('T')[0],
          description: ''
        });
      } else {
        showToast('Gagal menyimpan penugasan ke cloud', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const itemList = assignments && assignments.length > 0 ? assignments : [
    { id: '1', title: 'Tugas 1: Vocabulary Greetings', classId: '1A', dueDate: '2026-08-10', status: 'Aktif' },
    { id: '2', title: 'Tugas 2: Listening & Repeating', classId: '4A', dueDate: '2026-08-12', status: 'Aktif' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Manajemen Tugas &amp; Evaluasi Siswa</h3>
          <p className="text-xs text-slate-500">Daftar penugasan terstruktur {currentTeacher?.subject || 'Mata Pelajaran'} SD (Terhubung Supabase Cloud)</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <i className="ri-add-line" /> Buat Tugas Baru
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Judul Penugasan</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Tenggat Waktu</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemList.map((item, idx) => (
                <TableRow key={item.id || idx} className="hover:bg-slate-50/80">
                  <TableCell className="font-semibold text-xs text-slate-500">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-slate-800 text-xs">{item.title}</TableCell>
                  <TableCell><Badge variant="default" className="font-extrabold">{item.classId}</Badge></TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">{item.dueDate}</TableCell>
                  <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Tambah Penugasan Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="tugasTitle">Judul Penugasan</Label>
              <Input
                id="tugasTitle"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Contoh: Kuis Kosakata Family Members"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tugasClass">Target Kelas</Label>
              <select
                id="tugasClass"
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
              <Label htmlFor="tugasType">Jenis Penugasan</Label>
              <select
                id="tugasType"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Formatif">Formatif (LM)</option>
                <option value="Sumatif">Sumatif (STS/SAS)</option>
                <option value="Proyek">Proyek P5</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="tugasDueDate">Tenggat Waktu (Deadline)</Label>
              <Input
                id="tugasDueDate"
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tugasDescription">Deskripsi / Instruksi Tugas</Label>
              <textarea
                id="tugasDescription"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Tuliskan petunjuk pengerjaan tugas untuk siswa..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                rows={3}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Penugasan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
