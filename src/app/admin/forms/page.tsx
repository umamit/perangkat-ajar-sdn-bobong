'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { FormModel } from '@/types/form';
import { FormCard } from '@/modules/forms/admin/FormCard';
import { DeleteFormDialog } from '@/modules/forms/admin/DeleteFormDialog';

export default function AdminFormsListPage() {
  const { currentTeacher } = useApp();
  const [forms, setForms] = useState<FormModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FormModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isKepsek = !!(
    currentTeacher?.role?.toLowerCase().includes('kepala sekolah') ||
    currentTeacher?.role?.toLowerCase().includes('admin') ||
    currentTeacher?.nip === '199610272019032006'
  );

  const fetchForms = useCallback(async () => {
    const supabase = getSupabase();
    let query = supabase.from('forms').select('*').order('created_at', { ascending: false });

    // Multi-teacher isolation: guru biasa hanya melihat miliknya sendiri
    if (!isKepsek && currentTeacher?.nip) {
      query = query.eq('created_by', currentTeacher.nip);
    }

    const { data } = await query;
    if (data) setForms(data as FormModel[]);
    setLoading(false);
  }, [isKepsek, currentTeacher?.nip]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleCreateNew = async () => {
    const title = prompt('Masukkan judul formulir baru:');
    if (!title?.trim()) return;

    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('forms')
      .insert({
        title: title.trim(),
        slug,
        type: 'standard',
        is_active: true,
        created_by: currentTeacher?.nip || 'Guru',
      })
      .select()
      .single();

    if (data && !error) {
      setForms([data as FormModel, ...forms]);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const supabase = getSupabase();
      await supabase.from('forms').delete().eq('id', deleteTarget.id);
      setForms(forms.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {} finally {
      setIsDeleting(false);
    }
  };

  const copyPublicLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm" title="Kembali ke Dashboard">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">FormAjar</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">Formulir digital mandiri, kuis penilaian otomatis, & survei online.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="h-11 px-5 rounded-xl bg-[#12A5B8] hover:bg-[#0A7E8D] text-white font-semibold text-sm inline-flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Buat Formulir Baru
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">Memuat formulir...</div>
      ) : forms.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-12 text-center">
          <p className="text-slate-600 font-medium">Belum ada formulir untuk akun Anda.</p>
          <button onClick={handleCreateNew} className="mt-3 text-sm text-[#12A5B8] font-semibold hover:underline">
            Klik di sini untuk membuat formulir pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {forms.map((f) => (
            <FormCard
              key={f.id}
              form={f}
              copiedSlug={copiedSlug}
              onCopyLink={copyPublicLink}
              onRequestDelete={(target) => setDeleteTarget(target)}
            />
          ))}
        </div>
      )}

      <DeleteFormDialog
        form={deleteTarget}
        isOpen={!!deleteTarget}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
