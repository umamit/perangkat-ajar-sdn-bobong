'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CounselingLog, Student } from '@/types';
import { saveCounselingLogToSupabase, deleteCounselingLogFromSupabase } from '@/lib/supabase';

interface CounselingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function CounselingModal({ isOpen, onOpenChange, student }: CounselingModalProps) {
  const { counselingLogs, setCounselingLogs, currentTeacher, showToast } = useApp();
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<'Bimbingan' | 'Konseling' | 'Kunjungan Rumah' | 'Telepon Orang Tua'>('Bimbingan');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');

  const isKepsek = currentTeacher?.nip === '199610272019032006';

  if (!student) return null;

  // Filter logs for this student
  const studentLogs = counselingLogs
    .filter(log => log.studentId === student.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      showToast('Catatan bimbingan wajib diisi!', 'error');
      return;
    }

    setSaving(true);
    const newLog: CounselingLog = {
      id: crypto.randomUUID(),
      studentId: student.id,
      date,
      category,
      notes: notes.trim(),
      followUp: followUp.trim() || undefined,
      teacherNip: currentTeacher?.nip || ''
    };

    // Optimistic Update
    setCounselingLogs(prev => [newLog, ...prev]);
    setNotes('');
    setFollowUp('');
    showToast('Catatan BK berhasil disimpan di memori.', 'success');

    // Supabase Update
    const success = await saveCounselingLogToSupabase(newLog);
    if (!success) {
      const { addToOfflineQueue } = require('@/lib/offlineSync');
      addToOfflineQueue('saveCounselingLog', newLog);
      showToast('Koneksi lambat, data disimpan offline dan akan disinkronkan nanti.', 'info');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan bimbingan ini?')) return;
    
    // Optimistic Update
    setCounselingLogs(prev => prev.filter(log => log.id !== id));
    showToast('Catatan BK terhapus.', 'success');

    const success = await deleteCounselingLogFromSupabase(id);
    if (!success) {
      const { addToOfflineQueue } = require('@/lib/offlineSync');
      addToOfflineQueue('deleteCounselingLog', id);
      showToast('Koneksi terganggu, penghapusan akan diulang saat online.', 'error');
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Bimbingan':
        return 'bg-cyan-50 text-cyan-600 border-cyan-200/80';
      case 'Konseling':
        return 'bg-rose-50 text-rose-600 border-rose-200/80';
      case 'Kunjungan Rumah':
        return 'bg-amber-50 text-amber-600 border-amber-200/80';
      case 'Telepon Orang Tua':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200/80';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200/80';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-heart-pulse-line text-primary text-lg" />
            Catatan BK & Orang Tua: <span className="text-primary-dark">{student.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-3 text-xs">
          {/* History Section (Left/Top) */}
          <div className={isKepsek ? "md:col-span-7 space-y-3" : "md:col-span-12 space-y-3"}>
            <h3 className="font-bold text-slate-600 flex items-center gap-1.5 border-b pb-1 text-xs">
              <i className="ri-history-line" /> Riwayat Pembinaan ({studentLogs.length})
            </h3>
            {studentLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                <i className="ri-chat-history-line text-2xl opacity-60 mb-1.5 block" />
                Belum ada catatan bimbingan siswa ini.
              </div>
            ) : (
              <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
                {studentLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl relative space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black ${getCategoryBadge(log.category)}`}>
                        {log.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-medium">{log.date}</span>
                        {isKepsek && (
                          <button
                            type="button"
                            onClick={() => log.id && handleDelete(log.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded"
                            title="Hapus Catatan"
                          >
                            <i className="ri-delete-bin-6-line" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium mt-1">{log.notes}</p>
                    {log.followUp && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-600">Tindak Lanjut: </span>
                        {log.followUp}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Section (Right/Bottom) */}
          {isKepsek && (
            <form onSubmit={handleSave} className="md:col-span-5 space-y-3.5 border-t md:border-t-0 md:border-l md:pl-5 pt-4 md:pt-0">
            <h3 className="font-bold text-slate-600 flex items-center gap-1.5 border-b pb-1 text-xs">
              <i className="ri-edit-box-line" /> Tambah Catatan Baru
            </h3>

            <div className="space-y-1">
              <Label className="font-bold text-slate-600">Tanggal Kegiatan</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="h-10 rounded-xl text-slate-700"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-600">Kategori Kegiatan</Label>
              <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Bimbingan">Bimbingan Siswa</SelectItem>
                  <SelectItem value="Konseling">Konseling Pribadi</SelectItem>
                  <SelectItem value="Kunjungan Rumah">Kunjungan Rumah (Home Visit)</SelectItem>
                  <SelectItem value="Telepon Orang Tua">Hubungan Orang Tua / Telepon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-600">Catatan Kejadian / Masalah</Label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Deskripsi bimbingan / masalah siswa..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                rows={3}
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-600">Rencana Tindak Lanjut</Label>
              <textarea
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                placeholder="Rencana penanganan / hasil diskusi..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                rows={2}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 mt-1">
              {saving ? 'Menyimpan...' : 'Simpan Catatan'}
            </Button>
          </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
