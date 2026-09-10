import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeetingNote } from '@/types/meeting';
import { downloadNotulaPDF } from '@/modules/generateNotulaPDF';

interface MeetingDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: MeetingNote | null;
}

export function MeetingDetailModal({ isOpen, onOpenChange, meeting }: MeetingDetailModalProps) {
  if (!meeting) return null;

  const hadirList = meeting.attendees?.filter(a => a.status === 'Hadir') || [];
  const absentList = meeting.attendees?.filter(a => a.status !== 'Hadir') || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={meeting.status === 'Selesai' ? 'default' : 'secondary'} className="text-[10px] font-bold">
              {meeting.status}
            </Badge>
            <span className="text-xs text-slate-400 font-semibold">{meeting.date}</span>
          </div>
          <DialogTitle className="text-lg font-black text-slate-800 leading-snug">
            {meeting.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs text-slate-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Waktu</p>
              <p className="font-extrabold text-slate-800">{meeting.timeStart} {meeting.timeEnd ? `- ${meeting.timeEnd} WIT` : 'WIT'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Tempat</p>
              <p className="font-extrabold text-slate-800 truncate">{meeting.location}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Pemimpin</p>
              <p className="font-extrabold text-slate-800 truncate">{meeting.leaderName}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Notulis</p>
              <p className="font-extrabold text-slate-800 truncate">{meeting.notaryName || '-'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-black text-slate-900 flex items-center gap-1.5">
              <i className="ri-list-check text-primary" /> Pokok Bahasan
            </h4>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70 whitespace-pre-line leading-relaxed">
              {meeting.agendaTopics || '-'}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-black text-slate-900 flex items-center gap-1.5">
              <i className="ri-file-text-line text-primary" /> Ringkasan Jalannya Rapat
            </h4>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70 whitespace-pre-line leading-relaxed">
              {meeting.discussionSummary || 'Belum ada ringkasan notula.'}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-black text-slate-900 flex items-center gap-1.5">
              <i className="ri-checkbox-circle-line text-emerald-600" /> Keputusan / Tindak Lanjut
            </h4>
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 whitespace-pre-line leading-relaxed text-teal-950 font-medium">
              {meeting.decisions || 'Belum ada keputusan tercatat.'}
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <h4 className="font-black text-slate-900 flex items-center justify-between">
              <span>Kehadiran Dewan Guru</span>
              <span className="text-[11px] font-bold text-emerald-600">{hadirList.length} Hadir / {meeting.attendees?.length || 0} Total</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {meeting.attendees?.map(att => (
                <div key={att.nip} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                  <Badge variant={att.status === 'Hadir' ? 'default' : 'secondary'} className="text-[10px]">
                    {att.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 flex sm:justify-between items-center gap-2">
          <Button variant="outline" onClick={() => downloadNotulaPDF(meeting)} className="rounded-xl font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/60 border-emerald-200">
            <i className="ri-download-2-line mr-1.5" /> Unduh Berita Acara PDF
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
