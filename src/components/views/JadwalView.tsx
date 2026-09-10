'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { getTeacherAssignedClass } from '@/lib/utils';
import { saveScheduleToSupabase, deleteScheduleFromSupabase } from '@/lib/supabaseSchedule';
import { Schedule } from '@/types';
import { ScheduleGrid } from './jadwal/ScheduleGrid';
import { ScheduleModal } from './jadwal/ScheduleModal';
import { JadwalHeader } from './jadwal/JadwalHeader';
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
    <div className="flex flex-col gap-6 animate-fade-in">
      <JadwalHeader
        isKepsek={isKepsek}
        lockedClass={lockedClass}
        selectedClass={selectedClass}
        printing={printing}
        hasSchedules={filteredSchedules.length > 0}
        onPrint={handlePrint}
        onAdd={() => { setEditingSchedule(null); setShowModal(true); }}
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {isKepsek && (
          <button onClick={() => setSelectedClass('ALL')}
            className={`shrink-0 px-3.5 py-1.5 rounded-apple-md text-xs font-extrabold border transition-all cursor-pointer ${selectedClass === 'ALL' ? 'bg-gradient-to-b from-primary to-primary-dark text-white border-white/30 shadow-md shadow-primary/20' : 'bg-white/70 backdrop-blur-md text-slate-600 border-slate-200/80 hover:bg-white/90'}`}>
            Semua Kelas
          </button>
        )}
        {availableClasses.map(c => (
          <button key={c.id} onClick={() => setSelectedClass(c.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-apple-md text-xs font-extrabold border transition-all cursor-pointer ${selectedClass === c.id ? 'bg-gradient-to-b from-primary to-primary-dark text-white border-white/30 shadow-md shadow-primary/20' : 'bg-white/70 backdrop-blur-md text-slate-600 border-slate-200/80 hover:bg-white/90'}`}>
            Kelas {c.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
          <i className="ri-list-check" />
          {filteredSchedules.length} slot jadwal
          {selectedClass !== 'ALL' && ` — ${selectedClassInfo?.name || selectedClass}`}
        </span>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-5">
        <ScheduleGrid
          schedules={filteredSchedules}
          onEdit={s => { setEditingSchedule(s); setShowModal(true); }}
          onDelete={handleDelete}
        />
      </div>

      {showModal && (
        <ScheduleModal
          schedule={editingSchedule}
          classes={availableClasses}
          lockedClassId={lockedClass || undefined}
          defaultClassId={selectedClass !== 'ALL' ? selectedClass : undefined}
          teacherNip={currentTeacher?.nip || ''}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingSchedule(null); }}
        />
      )}
    </div>
  );
}
