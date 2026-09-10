import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MeetingCard } from './rapat/MeetingCard';
import { MeetingModal } from './rapat/MeetingModal';
import { MeetingDetailModal } from './rapat/MeetingDetailModal';
import { useMeetingManagement } from './rapat/useMeetingManagement';

export function RapatView() {
  const m = useMeetingManagement();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <i className="ri-discuss-line text-primary" /> Agenda Rapat & Notula Digital
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Dokumentasi rapat dewan guru, keputusan bersama, dan presensi resmi SD Negeri Bobong
          </p>
        </div>

        {m.isKepsek && (
          <Button onClick={m.handleOpenAdd} className="rounded-xl font-extrabold bg-primary hover:bg-primary/90 text-white shadow-xs self-start sm:self-auto">
            <i className="ri-add-circle-line mr-1.5 text-base" /> Buat Agenda Rapat
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={m.search}
            onChange={e => m.setSearch(e.target.value)}
            placeholder="Cari judul agenda, tempat, atau pokok bahasan..."
            className="pl-9 h-10 rounded-xl bg-white/80 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'Rencana', 'Selesai'] as const).map(st => (
            <button
              key={st}
              onClick={() => m.setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${m.statusFilter === st ? 'bg-primary text-white shadow-xs' : 'bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-white'}`}
            >
              {st === 'ALL' ? 'Semua Agenda' : st}
            </button>
          ))}
        </div>
      </div>

      {m.filteredMeetings.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <i className="ri-calendar-event-line text-2xl" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-700">Belum Ada Agenda Rapat</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Belum ada dokumentasi rapat yang tercatat. Tekan tombol buat agenda rapat untuk mulai mencatat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {m.filteredMeetings.map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              isKepsek={m.isKepsek}
              onViewDetail={item => {
                m.setSelectedMeeting(item);
                m.setShowDetailModal(true);
              }}
              onEdit={m.handleOpenEdit}
              onDelete={m.handleDelete}
            />
          ))}
        </div>
      )}

      <MeetingModal
        isOpen={m.showModal}
        onOpenChange={m.setShowModal}
        form={m.form}
        setForm={m.setForm}
        onSubmit={m.handleSubmit}
        saving={m.saving}
        isEdit={!!m.selectedMeeting}
      />

      <MeetingDetailModal
        isOpen={m.showDetailModal}
        onOpenChange={m.setShowDetailModal}
        meeting={m.selectedMeeting}
      />
    </div>
  );
}
