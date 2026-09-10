import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CounselingFormModal({ saving, onSave }: any) {
  const [category, setCategory] = useState<any>("Bimbingan");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onSave({ date, category, notes, followUp });
    setNotes(""); setFollowUp("");
  };

  return (
    <form onSubmit={handleSubmit} className="md:col-span-5 space-y-3.5 border-t md:border-t-0 md:border-l md:pl-5 pt-4 md:pt-0">
      <h3 className="font-bold text-slate-600 flex items-center gap-1.5 border-b pb-1 text-xs">
        <i className="ri-edit-box-line" /> Tambah Catatan Baru
      </h3>
      <div className="space-y-1">
        <Label className="font-bold text-slate-600">Tanggal Kegiatan</Label>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10 rounded-xl text-slate-700" required />
      </div>
      <div className="space-y-1">
        <Label className="font-bold text-slate-600">Kategori Kegiatan</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
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
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Deskripsi bimbingan / masalah siswa..." className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed" rows={3} required />
      </div>
      <div className="space-y-1">
        <Label className="font-bold text-slate-600">Rencana Tindak Lanjut</Label>
        <textarea value={followUp} onChange={e => setFollowUp(e.target.value)} placeholder="Rencana penanganan / hasil diskusi..." className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed" rows={2} />
      </div>
      <Button type="submit" disabled={saving} className="w-full rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 mt-1">
        {saving ? "Menyimpan..." : "Simpan Catatan"}
      </Button>
    </form>
  );
}
