import React from 'react';
import { MeetingNote } from '@/types/meeting';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { downloadNotulaPDF } from '@/modules/generateNotulaPDF';

interface MeetingCardProps {
  meeting: MeetingNote;
  isKepsek: boolean;
  onViewDetail: (m: MeetingNote) => void;
  onEdit: (m: MeetingNote) => void;
  onDelete: (id: string, title: string) => void;
}

export function MeetingCard({ meeting, isKepsek, onViewDetail, onEdit, onDelete }: MeetingCardProps) {
  const hadirCount = meeting.attendees?.filter(a => a.status === 'Hadir').length || 0;
  const totalCount = meeting.attendees?.length || 0;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <Badge variant={meeting.status === 'Selesai' ? 'default' : 'secondary'} className="text-[10px] font-bold px-2.5 py-0.5">
            <i className={meeting.status === 'Selesai' ? 'ri-checkbox-circle-line mr-1' : 'ri-time-line mr-1'} />
            {meeting.status}
          </Badge>
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <i className="ri-calendar-line" />
            {meeting.date}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-2 mb-2" title={meeting.title}>
          {meeting.title}
        </h3>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <i className="ri-map-pin-2-line text-primary text-sm" />
            <span className="truncate">{meeting.location || 'Ruang Guru'}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-time-line text-primary text-sm" />
            <span>{meeting.timeStart} {meeting.timeEnd ? `- ${meeting.timeEnd} WIT` : 'WIT'}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-user-star-line text-primary text-sm" />
            <span className="truncate">Pemimpin: {meeting.leaderName}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-team-line text-emerald-600 text-sm" />
            <span>Kehadiran: <strong>{hadirCount}</strong> / {totalCount} Guru</span>
          </div>
        </div>

        {meeting.decisions && (
          <div className="mt-3.5 p-2.5 bg-teal-50/60 rounded-xl border border-teal-100/70 text-[11px] text-teal-900 line-clamp-2">
            <strong>Keputusan:</strong> {meeting.decisions}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={() => onViewDetail(meeting)} className="h-8 text-xs font-bold rounded-xl text-slate-700">
            <i className="ri-file-text-line mr-1 text-primary" /> Notula
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadNotulaPDF(meeting)} title="Unduh Berita Acara PDF" className="h-8 text-xs font-bold rounded-xl text-emerald-700 hover:bg-emerald-50">
            <i className="ri-download-2-line mr-1 text-emerald-600" /> PDF
          </Button>
        </div>

        {isKepsek && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(meeting)} className="h-8 w-8 p-0 rounded-xl text-slate-500 hover:text-primary">
              <i className="ri-edit-line text-sm" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(meeting.id, meeting.title)} className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-rose-600">
              <i className="ri-delete-bin-line text-sm" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
