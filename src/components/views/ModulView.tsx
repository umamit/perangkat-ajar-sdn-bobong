import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveModuleToSupabase, uploadFileToSupabase, deleteModuleFromSupabase } from '@/lib/supabase';

import { downloadModulPDF } from '@/modules/generateModulPDF';

export function ModulView() {
  const { modules, currentTeacher, classes, teachers, showToast, setModules, syncData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: '',
    classId: classes[0]?.id || '1A',
    duration: '2 x 35 Menit',
    tp: '',
    cp: ''
  });

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (confirm('Apakah Anda yakin ingin menghapus modul ajar ini dari cloud?')) {
      try {
        setModules((prev: any[]) => prev.filter(m => m.id !== id));
        const success = await deleteModuleFromSupabase(id);
        if (success) {
          showToast('Modul ajar berhasil dihapus', 'success');
        } else {
          showToast('Gagal menghapus modul dari database cloud', 'error');
          await syncData();
        }
      } catch (e) {
        showToast('Terjadi kesalahan saat menghapus modul', 'error');
      }
    }
  };

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

      let fileUrl = null;
      if (selectedFile) {
        if (selectedFile.size > 15 * 1024 * 1024) {
          showToast('Ukuran berkas modul maksimal 15MB', 'error');
          setSaving(false);
          return;
        }
        showToast('Mengunggah dokumen modul...', 'info');
        const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const path = `${currentTeacher?.nip || 'unknown'}_mod_${Date.now()}_${cleanFileName}`;
        const uploadResult = await uploadFileToSupabase('documents', path, selectedFile);
        if (uploadResult.success) {
          fileUrl = uploadResult.url || null;
        } else {
          showToast(`Gagal mengunggah berkas asli modul: ${uploadResult.error}`, 'error');
          setSaving(false);
          return;
        }
      }

      const newModul: any = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        grade: grade,
        classId: form.classId,
        phase: phase,
        duration: form.duration.trim(),
        tp: form.tp.trim(),
        atp: form.tp.trim(),
        cp: form.cp.trim(),
        teacherNip: currentTeacher?.nip,
        fileUrl: fileUrl || undefined
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
        setSelectedFile(null);
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
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Perangkat &amp; Modul Ajar Kurikulum Merdeka</h3>
          <p className="text-xs text-slate-500 font-semibold">Modul Ajar {currentTeacher?.subject || 'Mata Pelajaran'} SD Negeri Bobong (TP, ATP, Alokasi Waktu)</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1 rounded-xl font-black text-xs bg-primary hover:bg-primary-dark text-white">
          <i className="ri-upload-cloud-line" /> Unggah Modul Baru
        </Button>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m, idx) => (
          <Card key={m.id || idx} className="rounded-2xl border border-white/85 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/20">
            <CardHeader className="pb-2 bg-white/35 border-b border-slate-100/50">
              <div className="flex justify-between items-center">
                <Badge variant="default" className="font-black text-[10px] rounded-lg px-2.5 py-0.5">
                  {classes.find(c => c.id === (m.classId || m.class_id))?.name || m.grade || m.phase || 'Fase A'}
                </Badge>
                <div className="flex items-center gap-1.5">
                  {(currentTeacher?.nip === '199610272019032006' || currentTeacher?.nip === (m.teacherNip || m.teacher_nip)) && (
                    <button
                      onClick={() => m.id && handleDelete(m.id)}
                      className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                      title="Hapus Modul"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                    <i className="ri-file-text-line text-base" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-sm font-extrabold text-slate-850 mt-3 line-clamp-1">
                {m.title}
              </CardTitle>
              {currentTeacher?.nip === '199610272019032006' && (
                <div className="text-[10px] font-black text-primary mt-1 flex items-center gap-1">
                  <i className="ri-user-line text-[10px]" />
                  <span>Oleh: {teachers.find(t => t.nip === (m.teacherNip || m.teacher_nip))?.name || `Guru (NIP: ${m.teacherNip || m.teacher_nip})`}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4 text-xs pt-4">
              <div className="space-y-1">
                <span className="font-black text-slate-400 text-[10px] uppercase tracking-wider block">Tujuan Pembelajaran (TP):</span>
                <p className="text-slate-650 font-semibold line-clamp-2 leading-relaxed">{m.tp || 'Mengidentifikasi kosakata dasar'}</p>
              </div>
              <div className="space-y-1">
                <span className="font-black text-slate-400 text-[10px] uppercase tracking-wider block">Alur Tujuan Pembelajaran (ATP):</span>
                <p className="text-slate-650 font-semibold line-clamp-2 leading-relaxed">{m.atp || 'Menyimak, menirukan, dan merespon instruksi sederhana'}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 font-bold">
                <span className="text-slate-450 text-[10px] font-black uppercase">Waktu: {m.duration || '2 x 35 Menit'}</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(m)} className="h-8 rounded-lg text-[10px] font-black text-rose-700 border-rose-250 hover:bg-rose-50/50 gap-1">
                    <i className="ri-file-pdf-2-line text-rose-600" /> PDF
                  </Button>
                  {(m.file_url || m.fileUrl) && (
                    <Button variant="outline" size="sm" onClick={() => window.open(m.file_url || m.fileUrl, '_blank')} className="h-8 rounded-lg text-[10px] font-black text-emerald-700 border-emerald-200 hover:bg-emerald-50/50 gap-1">
                      <i className="ri-file-download-line text-emerald-600" /> Berkas
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
 
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
              <i className="ri-add-box-line text-primary" /> Buat Modul Ajar / RPP Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="modulTitle" className="font-bold text-slate-650">Judul Modul / Topik</Label>
              <Input
                id="modulTitle"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Contoh: Unit 3 - My Family"
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="modulClass" className="font-bold text-slate-655">Target Kelas</Label>
              <select
                id="modulClass"
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
              <Label htmlFor="modulDuration" className="font-bold text-slate-650">Alokasi Waktu</Label>
              <Input
                id="modulDuration"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="modulTarget" className="font-bold text-slate-650">Tujuan Pembelajaran (TP)</Label>
              <textarea
                id="modulTarget"
                value={form.tp}
                onChange={e => setForm(f => ({ ...f, tp: e.target.value }))}
                placeholder="Tujuan pembelajaran yang ingin dicapai..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                rows={2}
                required
              />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="modulCP" className="font-bold text-slate-650">Capaian Pembelajaran (CP)</Label>
              <textarea
                id="modulCP"
                value={form.cp}
                onChange={e => setForm(f => ({ ...f, cp: e.target.value }))}
                placeholder="Ringkasan CP / instruksi materi..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                rows={2}
                required
              />
            </div>
            <div className="space-y-1.5 text-xs text-left">
              <Label htmlFor="modulFile" className="font-bold text-slate-650">Unggah Berkas Asli (PDF/Word/Zip) - Opsional</Label>
              <Input
                id="modulFile"
                type="file"
                accept=".pdf,.docx,.doc,.zip"
                onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                className="h-10 rounded-xl pt-2"
              />
            </div>
            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => { setShowModal(false); setForm({ title: '', classId: classes[0]?.id || '1A', duration: '2 x 35 Menit', tp: '', cp: '' }); setSelectedFile(null); }} className="rounded-xl h-10 text-xs font-bold">
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10">
                {saving ? 'Menyimpan...' : 'Simpan Modul'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
