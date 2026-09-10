import React from 'react';
import { getFileBadgeInfo } from '@/components/views/tugas/FileBadge';

interface PublicUploadFormProps {
  form: {
    senderName: string;
    senderContact: string;
    subject: string;
    title: string;
    classId: string;
    type: string;
    description: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export function PublicUploadForm({
  form,
  setForm,
  selectedFile,
  setSelectedFile,
  onSubmit,
  submitting,
}: PublicUploadFormProps) {
  const fileInfo = selectedFile ? getFileBadgeInfo(selectedFile.name) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5 text-xs text-left">
          <label className="font-bold text-slate-700">Nama Pengunggah / Instansi *</label>
          <input
            type="text"
            value={form.senderName}
            onChange={e => setForm((f: any) => ({ ...f, senderName: e.target.value }))}
            placeholder="Contoh: Bpk. Ahmad, S.Pd / Guru Tamu"
            required
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-xs"
          />
        </div>
        <div className="space-y-1.5 text-xs text-left">
          <label className="font-bold text-slate-700">Nomor WhatsApp / Kontak (Opsional)</label>
          <input
            type="text"
            value={form.senderContact}
            onChange={e => setForm((f: any) => ({ ...f, senderContact: e.target.value }))}
            placeholder="Contoh: 081234567890"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="space-y-1.5 text-xs text-left">
          <label className="font-bold text-slate-700">Mata Pelajaran</label>
          <input
            type="text"
            value={form.subject}
            onChange={e => setForm((f: any) => ({ ...f, subject: e.target.value }))}
            placeholder="Contoh: Bahasa Inggris"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-xs"
          />
        </div>
        <div className="space-y-1.5 text-xs text-left">
          <label className="font-bold text-slate-700">Target Kelas</label>
          <select
            value={form.classId}
            onChange={e => setForm((f: any) => ({ ...f, classId: e.target.value }))}
            className="w-full h-10 px-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-xs"
          >
            {['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'].map(cls => (
              <option key={cls} value={cls}>Kelas {cls}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 text-xs text-left">
          <label className="font-bold text-slate-700">Jenis Soal</label>
          <select
            value={form.type}
            onChange={e => setForm((f: any) => ({ ...f, type: e.target.value }))}
            className="w-full h-10 px-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-xs"
          >
            <option value="Formatif">Formatif (LM)</option>
            <option value="Sumatif">Sumatif (STS/SAS)</option>
            <option value="Proyek">Proyek P5</option>
            <option value="Latihan">Latihan Mandiri</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-left">
        <label className="font-bold text-slate-700">Judul Penugasan / Berkas Soal *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))}
          placeholder="Contoh: Soal Ujian Tengah Semester Bahasa Inggris Kelas 4"
          required
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-xs"
        />
      </div>

      <div className="space-y-1.5 text-xs text-left">
        <label className="font-bold text-slate-700 flex justify-between items-center">
          <span>Unggah Berkas Soal *</span>
          <span className="text-[10px] text-slate-400 font-normal">Word, PDF, Excel, PPT, ZIP (Maks 20MB)</span>
        </label>
        <input
          type="file"
          accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.zip,.rar,.7z"
          onChange={e => setSelectedFile(e.target.files?.[0] || null)}
          required
          className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary"
        />
        {fileInfo && selectedFile && (
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <i className={`${fileInfo.icon} ${fileInfo.iconColor} text-base`} />
            <span className="font-bold">{fileInfo.label}:</span>
            <span className="truncate max-w-[220px] font-medium">{selectedFile.name}</span>
            <span className="text-[10px] text-slate-400 ml-auto font-semibold">
              ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-left">
        <label className="font-bold text-slate-700">Catatan / Petunjuk Pengerjaan</label>
        <textarea
          value={form.description}
          onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
          placeholder="Tuliskan petunjuk umum pengerjaan soal atau keterangan untuk guru..."
          rows={3}
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-11 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {submitting ? (
          <>
            <i className="ri-loader-4-line animate-spin text-sm" /> Mengunggah Berkas Soal...
          </>
        ) : (
          <>
            <i className="ri-send-plane-fill text-sm" /> Kirim Berkas Soal ke Sekolah
          </>
        )}
      </button>
    </form>
  );
}
