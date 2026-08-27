'use client';

import React, { useState } from 'react';
import { Schedule, ClassInfo } from '@/types';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

interface ScheduleModalProps {
  schedule?: Schedule | null;
  classes: ClassInfo[];
  lockedClassId?: string;
  defaultClassId?: string;
  teacherNip: string;
  onSave: (data: Omit<Schedule, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export function ScheduleModal({ schedule, classes, lockedClassId, defaultClassId, teacherNip, onSave, onClose }: ScheduleModalProps) {
  const [day, setDay] = useState(schedule?.day || 'Senin');
  const [timeStart, setTimeStart] = useState(schedule?.timeStart || schedule?.time_start || '07:30');
  const [timeEnd, setTimeEnd] = useState(schedule?.timeEnd || schedule?.time_end || '08:30');
  const [classId, setClassId] = useState(schedule?.classId || schedule?.class_id || lockedClassId || defaultClassId || classes[0]?.id || '');
  const [subject, setSubject] = useState(schedule?.subject || '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) return;
    setSaving(true);
    await onSave({ id: schedule?.id, day, timeStart, timeEnd, classId, subject, teacherNip });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-800">{schedule ? 'Edit Slot Jadwal' : 'Tambah Slot Jadwal'}</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Isi detail jam pelajaran</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
            <i className="ri-close-line text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block">Hari</label>
            <div className="grid grid-cols-3 gap-2">
              {DAYS.map(d => (
                <button key={d} type="button"
                  onClick={() => setDay(d)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${day === d ? 'bg-primary text-white border-primary shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary/50'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block">Jam Mulai</label>
              <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block">Jam Selesai</label>
              <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </div>

          {/* Class */}
          {!lockedClassId && (
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block">Kelas</label>
              <select value={classId} onChange={e => setClassId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block">Mata Pelajaran</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required
              placeholder="cth: Matematika, Bahasa Indonesia..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-colors">Batal</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><i className="ri-loader-4-line animate-spin" /> Menyimpan...</> : <><i className="ri-save-line" /> Simpan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
