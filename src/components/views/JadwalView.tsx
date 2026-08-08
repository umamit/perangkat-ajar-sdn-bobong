'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { getTeacherAssignedClass } from '@/lib/utils';
import { saveScheduleToSupabase, deleteScheduleFromSupabase } from '@/lib/supabaseSchedule';
import { Schedule } from '@/types';
import { ScheduleGrid } from './jadwal/ScheduleGrid';
import { ScheduleModal } from './jadwal/ScheduleModal';
import { generateJadwalPDF } from '@/modules/generateJadwalPDF';

export function JadwalView() {
  const { classes, schedules, setSchedules, currentTeacher, showToast } = useApp();

  const isKepsek = !!(
    currentTeacher?.role?.toLowerCase().includes('kepala sekolah') ||
    currentTeacher?.role?.toLowerCase().includes('admin') ||
    currentTeacher?.nip === '199610272019032006'
  );

  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const [selectedClass, setSelectedClass] = useState(lockedClass || classes[0]?.id || 'ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);

  const availableClasses = useMemo(() => lockedClass
    ? classes.filter(c => c.id === lockedClass)
    : classes,
  [classes, lockedClass]);

  const filteredSchedules = useMemo(() =>
    selectedClass === 'ALL'
      ? schedules
      : schedules.filter(s => (s.classId || s.class_id || '').toUpperCase() === selectedClass.toUpperCase()),
  [schedules, selectedClass]);

  const selectedClassInfo = classes.find(c => c.id === selectedClass);

  async function handleSave(data: Omit<Schedule, 'id'> & { id?: string }) {
    const id = data.id || crypto.randomUUID();
    const payload = {
      id,
      day: data.day,
      time_start: data.timeStart,
      time_end: data.timeEnd,
      class_id: data.classId,
      subject: data.subject,
      teacher_nip: data.teacherNip || currentTeacher?.nip
    };

    const ok = await saveScheduleToSupabase(payload as any);
    if (ok) {
      const mapped: Schedule = { id, day: data.day, timeStart: data.timeStart, timeEnd: data.timeEnd, classId: data.classId, subject: data.subject, teacherNip: data.teacherNip };
      setSchedules(prev => data.id
        ? prev.map(s => s.id === data.id ? mapped : s)
        : [...prev, mapped]
      );
      showToast(data.id ? 'Jadwal diperbarui!' : 'Jadwal ditambahkan!', 'success');
    } else {
      showToast('Gagal menyimpan jadwal.', 'error');
    }
    setShowModal(false);
    setEditingSchedule(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus slot jadwal ini?')) return;
    setDeleting(id);
    const ok = await deleteScheduleFromSupabase(id);
    if (ok) {
      setSchedules(prev => prev.filter(s => s.id !== id));
      showToast('Slot jadwal dihapus.', 'success');
    } else {
      showToast('Gagal menghapus jadwal.', 'error');
    }
    setDeleting(null);
  }

  async function handlePrint() {
    setPrinting(true);
    try {
      await generateJadwalPDF(filteredSchedules, selectedClassInfo?.name || selectedClass, currentTeacher?.name || '');
    } catch (e) {
      showToast('Gagal menghasilkan PDF.', 'error');
    }
    setPrinting(false);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <i className="ri-calendar-schedule-line text-primary" />
            Jadwal Pelajaran
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isKepsek ? 'Lihat jadwal pelajaran semua kelas' : `Jadwal mengajar kelas ${lockedClass || selectedClass}`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handlePrint} disabled={printing || filteredSchedules.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors disabled:opacity-50">
            {printing ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-printer-line" />}
            Cetak PDF
          </button>
          <button onClick={() => { setEditingSchedule(null); setShowModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-dark transition-colors">
            <i className="ri-add-line" /> Tambah Slot
          </button>
        </div>
      </div>

      {/* Class Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {isKepsek && (
          <button onClick={() => setSelectedClass('ALL')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-black border transition-all ${selectedClass === 'ALL' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-primary/50'}`}>
            Semua Kelas
          </button>
        )}
        {availableClasses.map(c => (
          <button key={c.id} onClick={() => setSelectedClass(c.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-black border transition-all ${selectedClass === c.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-primary/50'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Summary badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
          <i className="ri-list-check" />
          {filteredSchedules.length} slot jadwal
          {selectedClass !== 'ALL' && ` — ${selectedClassInfo?.name || selectedClass}`}
        </span>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-5">
        <ScheduleGrid
          schedules={filteredSchedules}
          onEdit={s => { setEditingSchedule(s); setShowModal(true); }}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <ScheduleModal
          schedule={editingSchedule}
          classes={availableClasses}
          lockedClassId={lockedClass || undefined}
          teacherNip={currentTeacher?.nip || ''}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingSchedule(null); }}
        />
      )}
    </div>
  );
}
