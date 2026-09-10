'use client';

import React, { useState } from 'react';
import { PublicUploadForm } from '@/components/views/public/PublicUploadForm';

export default function UnggahSoalPage() {
  const [form, setForm] = useState({
    senderName: '',
    senderContact: '',
    subject: 'Bahasa Inggris',
    title: '',
    classId: '1A',
    type: 'Formatif',
    description: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ title: string; fileUrl?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.senderName.trim() || !form.title.trim()) {
      setErrorMsg('Nama pengunggah dan judul penugasan wajib diisi');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('senderName', form.senderName.trim());
      formData.append('senderContact', form.senderContact.trim());
      formData.append('subject', form.subject.trim());
      formData.append('title', form.title.trim());
      formData.append('classId', form.classId);
      formData.append('type', form.type);
      formData.append('description', form.description.trim());
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await fetch('/api/public/submit-assignment', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccessData({ title: form.title, fileUrl: data.fileUrl });
        setForm({
          senderName: '',
          senderContact: '',
          subject: 'Bahasa Inggris',
          title: '',
          classId: '1A',
          type: 'Formatif',
          description: '',
        });
        setSelectedFile(null);
      } else {
        setErrorMsg(data.error || 'Gagal mengirim berkas soal');
      }
    } catch {
      setErrorMsg('Terjadi masalah koneksi saat mengirim berkas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-teal-50/40 to-slate-200 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl border border-white/90 rounded-[28px] shadow-xl p-6 sm:p-8 text-center animate-fade-in space-y-6">
        {/* Header Identitas Sekolah */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/logo-sdn-bobong.png"
            alt="Logo SD Negeri Bobong"
            className="w-16 h-16 rounded-full shadow-md object-contain border-2 border-white/80"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Portal Unggah Soal &amp; Tugas
            </h1>
            <p className="text-xs font-bold text-primary mt-0.5">SD Negeri Bobong</p>
            <p className="text-[11px] text-slate-500 font-medium max-w-md mx-auto mt-1 leading-relaxed">
              Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791
            </p>
          </div>
        </div>

        {/* State Berhasil */}
        {successData ? (
          <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <i className="ri-check-line" />
            </div>
            <h2 className="text-base font-black text-emerald-950">Berkas Berhasil Terkirim!</h2>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              Penugasan &quot;{successData.title}&quot; telah tersimpan ke sistem SD Negeri Bobong dan siap diverifikasi oleh guru pengampu.
            </p>
            <button
              type="button"
              onClick={() => setSuccessData(null)}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Unggah Berkas Lainnya
            </button>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 font-semibold rounded-xl border border-rose-200 flex items-center gap-2 text-left">
                <i className="ri-error-warning-line text-rose-500 text-sm shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <PublicUploadForm
              form={form}
              setForm={setForm}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </>
        )}

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-2">
          <i className="ri-shield-check-line text-teal-600 text-sm" />
          <span>Layanan Resmi Pengumpulan Dokumen Digital SD Negeri Bobong</span>
        </div>
      </div>
    </div>
  );
}
