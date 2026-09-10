"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CounselingLog, Student } from "@/types";
import { saveCounselingLogToSupabase } from "@/lib/supabase";
import { StudentPicker } from "./StudentPicker";

interface CounselingFormProps {
  students: Student[];
  currentTeacher: any;
  onSuccess: (newLog: CounselingLog) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

export function CounselingForm({ students, currentTeacher, onSuccess, showToast }: CounselingFormProps) {
  const [saving, setSaving] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentSearchText, setStudentSearchText] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [category, setCategory] = useState<any>("Bimbingan");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return showToast("Pilih siswa terlebih dahulu!", "error");
    if (!notes.trim()) return showToast("Catatan bimbingan wajib diisi!", "error");

    setSaving(true);
    const newLog: CounselingLog = {
      id: crypto.randomUUID(), studentId: selectedStudentId, date, category,
      notes: notes.trim(), followUp: followUp.trim() || undefined, teacherNip: currentTeacher?.nip || ""
    };

    onSuccess(newLog);
    setNotes(""); setFollowUp(""); setSelectedStudentId(""); setStudentSearchText("");
    showToast("Catatan BK berhasil disimpan di memori.", "success");

    try {
      const ok = await saveCounselingLogToSupabase(newLog);
      if (ok) showToast("Catatan BK tersimpan permanen di Supabase Cloud!", "success");
      else showToast("Gagal sinkronisasi catatan BK ke Supabase.", "error");
    } catch {
      showToast("Terjadi kesalahan jaringan saat menyimpan BK.", "error");
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSave} className="p-5 bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl shadow-xs space-y-4">
      <h4 className="font-black text-sm text-slate-800 flex items-center gap-1.5 mb-1">
        <i className="ri-add-circle-line text-primary text-base" /> Input Pembinaan Baru
      </h4>

      <StudentPicker
        students={students}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        studentSearchText={studentSearchText}
        setStudentSearchText={setStudentSearchText}
        showStudentDropdown={showStudentDropdown}
        setShowStudentDropdown={setShowStudentDropdown}
      />

      <div className="space-y-1 text-left">
        <Label className="font-bold text-slate-600 text-xs">Kategori Bimbingan</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-10 rounded-xl bg-white/70 text-xs font-semibold"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Bimbingan">Bimbingan (Karakter/Belajar)</SelectItem>
            <SelectItem value="Konseling">Konseling Individual</SelectItem>
            <SelectItem value="Kunjungan Rumah">Kunjungan Rumah (Home Visit)</SelectItem>
            <SelectItem value="Telepon Orang Tua">Telepon Orang Tua / Wali</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1 text-left">
        <Label className="font-bold text-slate-600 text-xs">Tanggal Pelaksanaan</Label>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10 rounded-xl bg-white/70 text-xs font-semibold" required />
      </div>

      <div className="space-y-1 text-left">
        <Label className="font-bold text-slate-600 text-xs">Catatan Masalah & Pendekatan</Label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tuliskan latar belakang masalah atau topik..." rows={3} className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white/70 font-semibold outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed" required />
      </div>

      <div className="space-y-1 text-left">
        <Label className="font-bold text-slate-600 text-xs">Rencana Tindak Lanjut</Label>
        <Input type="text" value={followUp} onChange={e => setFollowUp(e.target.value)} placeholder="Contoh: Pantau 1 minggu..." className="h-10 rounded-xl bg-white/70 text-xs font-semibold" />
      </div>

      <Button type="submit" disabled={saving} className="w-full h-10 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 hover:brightness-105">
        {saving ? "Menyimpan..." : "Simpan Catatan Pembinaan"}
      </Button>
    </form>
  );
}
