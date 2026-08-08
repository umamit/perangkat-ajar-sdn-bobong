'use client';

import React from 'react';
import { Schedule } from '@/types';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const DAY_COLORS: Record<string, string> = {
  Senin: 'bg-blue-50 text-blue-700 border-blue-100',
  Selasa: 'bg-violet-50 text-violet-700 border-violet-100',
  Rabu: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Kamis: 'bg-amber-50 text-amber-700 border-amber-100',
  Jumat: 'bg-rose-50 text-rose-700 border-rose-100',
  Sabtu: 'bg-teal-50 text-teal-700 border-teal-100',
};

interface ScheduleGridProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export function ScheduleGrid({ schedules, onEdit, onDelete }: ScheduleGridProps) {
  // --- Mobile: Card per day ---
  const MobileView = () => (
    <div className="space-y-5 md:hidden">
      {DAYS.map(day => {
        const daySlots = schedules
          .filter(s => s.day === day)
          .sort((a, b) => (a.timeStart || a.time_start || '').localeCompare(b.timeStart || b.time_start || ''));

        if (daySlots.length === 0) return null;

        return (
          <div key={day} className="space-y-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${DAY_COLORS[day] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
              <i className="ri-calendar-line" />
              {day}
            </div>
            <div className="space-y-2 ml-1">
              {daySlots.map(slot => (
                <div key={slot.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="shrink-0 text-center min-w-[56px]">
                    <div className="text-[11px] font-black text-primary leading-tight">{slot.timeStart || slot.time_start}</div>
                    <div className="text-[8px] text-slate-400 font-bold">—</div>
                    <div className="text-[11px] font-black text-slate-500 leading-tight">{slot.timeEnd || slot.time_end}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{slot.subject}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-0.5">{slot.classId || slot.class_id}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => onEdit(slot)} className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                      <i className="ri-edit-2-line text-primary text-xs" />
                    </button>
                    <button onClick={() => slot.id && onDelete(slot.id)} className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors">
                      <i className="ri-delete-bin-6-line text-rose-500 text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {schedules.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-calendar-schedule-line text-4xl text-slate-200 block mb-3" />
          <p className="text-sm text-slate-400 font-bold">Belum ada jadwal untuk kelas ini</p>
          <p className="text-[10px] text-slate-300 font-semibold mt-1">Tekan &ldquo;Tambah Slot&rdquo; untuk mulai mengisi jadwal</p>
        </div>
      )}
    </div>
  );

  // --- Desktop: Weekly Grid ---
  const DesktopView = () => {
    const allTimes = Array.from(new Set(
      schedules.flatMap(s => [s.timeStart || s.time_start || ''])
    )).sort();

    if (allTimes.length === 0) {
      return (
        <div className="hidden md:flex flex-col items-center justify-center py-16">
          <i className="ri-calendar-schedule-line text-5xl text-slate-200 block mb-3" />
          <p className="text-sm text-slate-400 font-bold">Belum ada jadwal untuk kelas ini</p>
        </div>
      );
    }

    return (
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-[10px] font-black text-slate-400 uppercase text-left px-2 py-1.5 w-24">Jam</th>
              {DAYS.map(d => (
                <th key={d} className={`text-[10px] font-black uppercase text-center px-2 py-1.5 rounded-xl ${DAY_COLORS[d] || 'bg-slate-50 text-slate-500'}`}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTimes.map(time => (
              <tr key={time}>
                <td className="text-[10px] font-black text-slate-400 px-2 py-2 whitespace-nowrap">{time}</td>
                {DAYS.map(day => {
                  const slot = schedules.find(s => s.day === day && (s.timeStart || s.time_start) === time);
                  return (
                    <td key={day} className="p-1">
                      {slot ? (
                        <div className="group relative p-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl transition-all cursor-pointer" onClick={() => onEdit(slot)}>
                          <p className="text-[10px] font-black text-slate-700 truncate">{slot.subject}</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">{slot.timeEnd || slot.time_end}</p>
                          <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-rose-100 hover:bg-rose-200"
                            onClick={e => { e.stopPropagation(); slot.id && onDelete(slot.id); }}>
                            <i className="ri-delete-bin-6-line text-rose-500 text-[10px]" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-10 rounded-xl bg-slate-50 border border-dashed border-slate-200" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}
