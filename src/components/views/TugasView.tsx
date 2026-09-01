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
        id: crypto.randomUUID(),
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

  const itemList = assignments || [];
 
  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Manajemen Tugas &amp; Evaluasi Siswa</h3>
          <p className="text-xs text-slate-500 font-semibold">Daftar penugasan terstruktur {currentTeacher?.subject || 'Mata Pelajaran'} SD (Supabase Sync)</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
          <i className="ri-add-line" /> Buat Tugas Baru
        </Button>
      </div>
 
      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                <TableHead className="w-12 font-black text-[10px] uppercase text-slate-400">No</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Judul Penugasan</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Kelas</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Tenggat Waktu</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs font-semibold text-slate-400">
                    <i className="ri-inbox-2-line text-lg block mb-1 text-slate-300" />
                    Belum ada penugasan terdaftar. Klik &apos;Buat Tugas Baru&apos; untuk menambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                itemList.map((item, idx) => (
                  <TableRow key={item.id || idx} className="hover:bg-white/40 border-slate-100 transition-colors">
                    <TableCell className="font-bold text-xs text-slate-400">{idx + 1}</TableCell>
                    <TableCell className="font-bold text-slate-800 text-xs">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="font-black text-[10px] rounded-md px-2 py-0.5">{item.classId}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-600">{item.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Aktif' ? 'success' : 'secondary'} className="font-black text-[10px] rounded-md px-2 py-0.5">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
 
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
              <i className="ri-task-line text-primary" /> Tambah Penugasan Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="tugasTitle" className="font-bold text-slate-600">Judul Penugasan</Label>
              <Input
                id="tugasTitle"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Contoh: Kuis Kosakata Family Members"
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="tugasClass" className="font-bold text-slate-655">Target Kelas</Label>
              <select
                id="tugasClass"
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
              <Label htmlFor="tugasType" className="font-bold text-slate-655">Jenis Penugasan</Label>
              <select
                id="tugasType"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Formatif">Formatif (LM)</option>
                <option value="Sumatif">Sumatif (STS/SAS)</option>
                <option value="Proyek">Proyek P5</option>
              </select>
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="tugasDueDate" className="font-bold text-slate-600">Tenggat Waktu (Deadline)</Label>
              <Input
                id="tugasDueDate"
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="tugasDescription" className="font-bold text-slate-600">Deskripsi / Instruksi Tugas</Label>
              <textarea
                id="tugasDescription"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Tuliskan petunjuk pengerjaan tugas untuk siswa..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                rows={3}
                required
              />
            </div>
            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="rounded-xl h-10 text-xs font-bold">
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
                {saving ? 'Menyimpan...' : 'Simpan Penugasan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
