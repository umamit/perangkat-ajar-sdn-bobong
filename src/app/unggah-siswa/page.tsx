'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentUploadForm, ParsedStudent } from '@/components/views/public-siswa/StudentUploadForm';
import { StudentListPreview } from '@/components/views/public-siswa/StudentListPreview';

function UnggahSiswaContent() {
  const searchParams = useSearchParams();
  const rawClass = searchParams.get('kelas') || '1A';

  const [senderName, setSenderName] = useState('');
  const [targetClass, setTargetClass] = useState(rawClass);
  const [students, setStudents] = useState<ParsedStudent[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (rawClass) setTargetClass(rawClass.toUpperCase());
  }, [rawClass]);

  const handleSubmit = async () => {
    if (!senderName.trim()) {
      setErrorMsg('Nama Wali Kelas / Pengunggah wajib diisi');
      return;
    }
    if (students.length === 0) {
      setErrorMsg('Daftar siswa masih kosong. Silakan unggah Excel atau tambah data siswa.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/public/submit-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName: senderName.trim(), classId: targetClass, students }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessCount(data.count || students.length);
        setStudents([]);
      } else {
        setErrorMsg(data.message || 'Gagal menyimpan data siswa ke server.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan saat mengirimkan data siswa.');
    } finally {
      setSubmitting(false);
    }
  };

  const classOptions = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary text-2xl mb-2">
            <i className="ri-team-line" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Pembaruan Data Siswa Baru</h1>
          <p className="text-xs text-slate-500 font-semibold">SD Negeri Bobong • Tahun Ajaran Baru</p>
        </div>

        {successCount !== null ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-bold">
              <i className="ri-check-line" />
            </div>
            <h3 className="text-base font-black text-emerald-900">Data Siswa Berhasil Disimpan!</h3>
            <p className="text-xs text-emerald-700 font-medium">
              Sebanyak <strong>{successCount} siswa</strong> telah resmi tersimpan untuk <strong>Kelas {targetClass}</strong> di database sekolah.
            </p>
            <button
              onClick={() => setSuccessCount(null)}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
            >
              Unggah / Perbarui Lagi
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <i className="ri-error-warning-line text-rose-500" />
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Wali Kelas / Pengunggah *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibu Fatimah, S.Pd."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kelas Target *</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {classOptions.map((c) => (
                    <option key={c} value={c}>Kelas {c}</option>
                  ))}
                </select>
              </div>
            </div>

            <StudentUploadForm
              onAddBatch={(list) => setStudents((prev) => [...prev, ...list])}
              onAddSingle={(s) => setStudents((prev) => [...prev, s])}
              onError={(msg) => setErrorMsg(msg)}
            />

            <StudentListPreview
              students={students}
              targetClass={targetClass}
              submitting={submitting}
              onRemove={(idx) => setStudents((prev) => prev.filter((_, i) => i !== idx))}
              onClear={() => setStudents([])}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnggahSiswaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat halaman...</div>}>
      <UnggahSiswaContent />
    </Suspense>
  );
}
