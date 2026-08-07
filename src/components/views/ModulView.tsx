import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveModuleToSupabase } from '@/lib/supabase';

import { downloadModulPDF } from '@/modules/generateModulPDF';

export function ModulView() {
  const { modules, currentTeacher, classes, showToast, setModules } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    classId: classes[0]?.id || '1A',
    duration: '2 x 35 Menit',
    tp: '',
    cp: ''
  });

  const handleDownloadPDF = async (m: any) => {
    try {
      showToast(`Memproses Berkas PDF Modul ${m.title}...`, 'info');
      await downloadModulPDF({
        modul: {
          title: m.title,
          fase: m.grade || m.phase || 'Fase A',
          classId: m.classId || '1A',
          description: m.tp ? `TP: ${m.tp}\nATP: ${m.atp || '-'}` : undefined,
        },
        teacherName: currentTeacher?.name,
        teacherNip: currentTeacher?.nip,
        teacherRole: currentTeacher?.role,
        teacherSubject: currentTeacher?.subject,
      });
      showToast(`PDF Modul ${m.title} Berhasil Diunduh!`, 'success');
    } catch (e) {
      showToast('Gagal mencetak PDF Modul Ajar', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.tp.trim() || !form.cp.trim()) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      const selectedClassObj = classes.find(c => c.id === form.classId);
      const phase = selectedClassObj?.phase || 'Fase A';
      const grade = selectedClassObj?.name || `Kelas ${form.classId}`;

      const newModul = {
        id: `MOD-${Date.now()}`,
        title: form.title.trim(),
        grade: grade,
        classId: form.classId,
        phase: phase,
        duration: form.duration.trim(),
        tp: form.tp.trim(),
        atp: form.tp.trim(),
        cp: form.cp.trim(),
        teacherNip: currentTeacher?.nip
      };

      const success = await saveModuleToSupabase(newModul);
      if (success) {
        setModules((prev: any[]) => [newModul, ...prev]);
        showToast(`Modul Ajar "${form.title}" berhasil ditambahkan ke Supabase Cloud`, 'success');
        setShowModal(false);
        setForm({
          title: '',
          classId: classes[0]?.id || '1A',
          duration: '2 x 35 Menit',
          tp: '',
          cp: ''
        });
      } else {
        showToast('Gagal menyimpan modul ke cloud', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Perangkat & Modul Ajar Kurikulum Merdeka</h3>
          <p className="text-xs text-slate-500">Modul Ajar {currentTeacher?.subject || 'Mata Pelajaran'} SD Negeri Bobong (TP, ATP, Alokasi Waktu)</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <i className="ri-upload-cloud-line" /> Unggah Modul Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m, idx) => (
          <Card key={m.id || idx} className="hover:border-primary/50 transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge variant="default">{m.grade || m.phase || 'Fase A'}</Badge>
                <i className="ri-file-text-line text-2xl text-primary" />
              </div>
              <CardTitle className="text-base font-bold text-slate-800 mt-2">
                {m.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Tujuan Pembelajaran (TP):</span>
                <p className="text-slate-500 line-clamp-2">{m.tp || 'Mengidentifikasi kosakata dasar'}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Alur Tujuan Pembelajaran (ATP):</span>
                <p className="text-slate-500 line-clamp-2">{m.atp || 'Menyimak, menirukan, dan merespon instruksi sederhana'}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 font-semibold">
                <span className="text-slate-400">Waktu: {m.duration || '2 x 35 Menit'}</span>
                <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(m)} className="gap-1 font-bold text-rose-700 border-rose-300 hover:bg-rose-50">
                  <i className="ri-file-pdf-2-line text-rose-600" /> Unduh PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Buat Modul Ajar / RPP Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="modulTitle">Judul Modul / Topik</Label>
              <Input
                id="modulTitle"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Contoh: Unit 3 - My Family"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="modulClass">Target Kelas</Label>
              <select
                id="modulClass"
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
              <Label htmlFor="modulDuration">Alokasi Waktu</Label>
              <Input
                id="modulDuration"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="modulTarget">Tujuan Pembelajaran (TP)</Label>
              <textarea
                id="modulTarget"
                value={form.tp}
                onChange={e => setForm(f => ({ ...f, tp: e.target.value }))}
                placeholder="Tujuan pembelajaran yang ingin dicapai..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                rows={2}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="modulCP">Capaian Pembelajaran (CP)</Label>
              <textarea
                id="modulCP"
                value={form.cp}
                onChange={e => setForm(f => ({ ...f, cp: e.target.value }))}
                placeholder="Ringkasan CP / instruksi materi..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                rows={2}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowModal(false); setForm({ title: '', classId: classes[0]?.id || '1A', duration: '2 x 35 Menit', tp: '', cp: '' }); }}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Modul'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
