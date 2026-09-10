import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MeetingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  isEdit: boolean;
}

export function MeetingModal({ isOpen, onOpenChange, form, setForm, onSubmit, saving, isEdit }: MeetingModalProps) {
  const updateAttendeeStatus = (nip: string, status: string) => {
    setForm((prev: any) => ({
      ...prev,
      attendees: prev.attendees.map((a: any) => a.nip === nip ? { ...a, status } : a)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
            <i className="ri-discuss-line text-primary" />
            {isEdit ? 'Edit Notula & Agenda Rapat' : 'Buat Agenda Rapat Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">Judul / Agenda Rapat *</Label>
            <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Contoh: Rapat Evaluasi Pembelajaran Tengah Semester" className="rounded-xl h-10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Tanggal Rapat</Label>
              <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Waktu Mulai</Label>
              <Input type="time" value={form.timeStart} onChange={e => setForm({ ...form, timeStart: e.target.value })} className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Waktu Selesai</Label>
              <Input type="time" value={form.timeEnd} onChange={e => setForm({ ...form, timeEnd: e.target.value })} className="rounded-xl h-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Tempat Pelaksanaan</Label>
              <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ruang Guru SD Negeri Bobong" className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Status Pertemuan</Label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold">
                <option value="Rencana">Diagendakan (Rencana)</option>
                <option value="Selesai">Terlaksana (Selesai)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Pemimpin Rapat</Label>
              <Input value={form.leaderName} onChange={e => setForm({ ...form, leaderName: e.target.value })} placeholder="Husnita Usman, M.Pd" className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Notulis Rapat</Label>
              <Input value={form.notaryName} onChange={e => setForm({ ...form, notaryName: e.target.value })} placeholder="Nama Notulis Rapat" className="rounded-xl h-10" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">Pokok Pembahasan / Agenda</Label>
            <textarea rows={2} value={form.agendaTopics} onChange={e => setForm({ ...form, agendaTopics: e.target.value })} placeholder="Daftar pokok bahasan yang didiskusikan..." className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" />
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">Ringkasan Notula & Jalannya Rapat</Label>
            <textarea rows={3} value={form.discussionSummary} onChange={e => setForm({ ...form, discussionSummary: e.target.value })} placeholder="Catatan jalannya rapat, masukan dewan guru..." className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" />
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">Keputusan / Tindak Lanjut</Label>
            <textarea rows={2} value={form.decisions} onChange={e => setForm({ ...form, decisions: e.target.value })} placeholder="Poin keputusan bersama hasil rapat..." className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" />
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <Label className="font-bold text-slate-700">Presensi Kehadiran Guru ({form.attendees?.length || 0})</Label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {form.attendees?.map((att: any) => (
                <div key={att.nip} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{att.name}</span>
                  <div className="flex gap-1">
                    {['Hadir', 'Izin', 'Sakit', 'Alpa'].map(st => (
                      <button type="button" key={st} onClick={() => updateAttendeeStatus(att.nip, st)} className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all ${att.status === st ? 'bg-primary text-white shadow-xs' : 'bg-white text-slate-500 border border-slate-200'}`}>
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Batal</Button>
            <Button type="submit" disabled={saving} className="rounded-xl font-extrabold bg-primary hover:bg-primary/90 text-white">
              {saving ? 'Menyimpan...' : 'Simpan Notula Rapat'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
