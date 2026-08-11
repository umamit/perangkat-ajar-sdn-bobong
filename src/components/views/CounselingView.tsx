'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CounselingLog } from '@/types';
import { saveCounselingLogToSupabase, deleteCounselingLogFromSupabase } from '@/lib/supabase';

export function CounselingView() {
  const { counselingLogs, setCounselingLogs, students, classes, currentTeacher, showToast } = useApp();
  const [saving, setSaving] = useState(false);
  
  // Filter states
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentSearchText, setStudentSearchText] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [category, setCategory] = useState<'Bimbingan' | 'Konseling' | 'Kunjungan Rumah' | 'Telepon Orang Tua'>('Bimbingan');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');

  const isKepsek = currentTeacher?.nip === '199610272019032006';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      showToast('Pilih siswa terlebih dahulu!', 'error');
      return;
    }
    if (!notes.trim()) {
      showToast('Catatan bimbingan wajib diisi!', 'error');
      return;
    }

    setSaving(true);
    const newLog: CounselingLog = {
      id: crypto.randomUUID(),
      studentId: selectedStudentId,
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
    setSelectedStudentId('');
    setStudentSearchText('');
    showToast('Catatan bimbingan berhasil disimpan.', 'success');

    const success = await saveCounselingLogToSupabase(newLog);
    if (!success) {
      const { addToOfflineQueue } = require('@/lib/offlineSync');
      addToOfflineQueue('saveCounselingLog', newLog);
      showToast('Koneksi lambat, data disimpan offline.', 'info');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan bimbingan ini?')) return;
    setCounselingLogs(prev => prev.filter(log => log.id !== id));
    showToast('Catatan BK terhapus.', 'success');

    const success = await deleteCounselingLogFromSupabase(id);
    if (!success) {
      const { addToOfflineQueue } = require('@/lib/offlineSync');
      addToOfflineQueue('deleteCounselingLog', id);
      showToast('Koneksi terganggu, penghapusan tertunda.', 'error');
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Bimbingan': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      case 'Konseling': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Kunjungan Rumah': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Telepon Orang Tua': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-50 text-slate-650 border-slate-200';
    }
  };

  // Filter logs logic
  const filteredLogs = counselingLogs.filter(log => {
    const student = students.find(s => s.id === log.studentId);
    if (!student) return false;

    const matchesClass = filterClass === 'ALL' || student.classId === filterClass;
    const matchesCategory = filterCategory === 'ALL' || log.category === filterCategory;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (student.nis || '').includes(searchQuery);

    return matchesClass && matchesCategory && matchesSearch;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 text-xs">
      <div>
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Pusat Layanan Bimbingan Konseling (BK)</h3>
        <p className="text-[11px] text-slate-500 font-semibold">Timeline pembinaan karakter siswa dan riwayat bimbingan terintegrasi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: global timeline */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filters Card */}
          <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="font-bold text-slate-600">Filter Kelas</Label>
                <select
                  value={filterClass}
                  onChange={e => setFilterClass(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ALL">Semua Kelas</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <Label className="font-bold text-slate-600">Kategori</Label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="Bimbingan">Bimbingan</option>
                  <option value="Konseling">Konseling</option>
                  <option value="Kunjungan Rumah">Kunjungan Rumah</option>
                  <option value="Telepon Orang Tua">Telepon Orang Tua</option>
                </select>
              </div>

              <div>
                <Label className="font-bold text-slate-600">Cari Siswa</Label>
                <Input
                  type="text"
                  placeholder="Nama / NIS..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </div>
            </div>
          </Card>

          {/* Timeline list */}
          <div className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-16 text-slate-450 bg-white/60 border border-slate-100 rounded-2xl">
                <i className="ri-folder-shield-2-line text-3xl opacity-60 mb-2 block" />
                Tidak ditemukan catatan pembinaan yang cocok.
              </div>
            ) : (
              filteredLogs.map(log => {
                const student = students.find(s => s.id === log.studentId);
                return (
                  <div key={log.id} className="p-4 bg-white/80 border border-slate-150 rounded-2xl relative space-y-2 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 text-xs">{student?.name || 'Siswa Hilang'}</span>
                        <Badge variant="default" className="text-[9px] rounded-md px-1.5 py-0.2">{student?.classId}</Badge>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getCategoryBadge(log.category)}`}>
                          {log.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold">{log.date}</span>
                        {(log.teacherNip === currentTeacher?.nip || isKepsek) && (
                          <button
                            onClick={() => log.id && handleDelete(log.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded"
                            title="Hapus Catatan"
                          >
                            <i className="ri-delete-bin-6-line" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-semibold">{log.notes}</p>
                    {log.followUp && (
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                        <span className="font-extrabold text-slate-650">Tindak Lanjut: </span>
                        {log.followUp}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: add form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSave} className="p-5 bg-white/85 border border-white/90 rounded-[24px] shadow-sm space-y-4 sticky top-24">
            <h4 className="font-black text-sm text-slate-800 flex items-center gap-1.5 border-b pb-2">
              <i className="ri-add-circle-line text-primary" /> Input Pembinaan Baru
            </h4>

            <div className="space-y-1 text-left relative">
              <Label className="font-bold text-slate-650">Pilih Siswa</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ketik nama / kelas..."
                  value={studentSearchText}
                  onChange={e => {
                    setStudentSearchText(e.target.value);
                    setShowStudentDropdown(true);
                  }}
                  onFocus={() => setShowStudentDropdown(true)}
                  className="h-9 rounded-xl pr-8 text-xs font-semibold"
                  required={!selectedStudentId}
                />
                <button
                  type="button"
                  onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <i className="ri-arrow-down-s-line" />
                </button>
              </div>

              {showStudentDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStudentDropdown(false)} />
                  <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-1 space-y-0.5">
                    {students
                      .filter(s => 
                        s.name.toLowerCase().includes(studentSearchText.toLowerCase()) || 
                        (s.classId || '').toLowerCase().includes(studentSearchText.toLowerCase())
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .slice(0, 15)
                      .map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSelectedStudentId(s.id);
                            setStudentSearchText(`${s.name} (${s.classId})`);
                            setShowStudentDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors ${selectedStudentId === s.id ? 'bg-primary/5 text-primary' : 'text-slate-700'}`}
                        >
                          {s.name} ({s.classId})
                        </button>
                      ))}
                    {students.filter(s => 
                      s.name.toLowerCase().includes(studentSearchText.toLowerCase()) || 
                      (s.classId || '').toLowerCase().includes(studentSearchText.toLowerCase())
                    ).length === 0 && (
                      <p className="text-center py-3 text-slate-400 font-semibold">Siswa tidak ditemukan</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-600">Tanggal Kegiatan</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="h-9 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-600">Kategori</Label>
              <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                <SelectTrigger className="h-9 rounded-xl">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Bimbingan">Bimbingan Siswa</SelectItem>
                  <SelectItem value="Konseling">Konseling Pribadi</SelectItem>
                  <SelectItem value="Kunjungan Rumah">Kunjungan Rumah (Home Visit)</SelectItem>
                  <SelectItem value="Telepon Orang Tua">Telepon Orang Tua</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-600">Catatan Kejadian</Label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Tuliskan kendala / catatan pembinaan..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                rows={3}
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-600">Tindak Lanjut</Label>
              <textarea
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                placeholder="Rencana penanganan / follow up..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                rows={2}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full rounded-xl h-10 font-black bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10">
              {saving ? 'Menyimpan...' : 'Simpan Bimbingan'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
