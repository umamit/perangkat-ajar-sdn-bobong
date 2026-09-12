'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { FormModel } from '@/types/form';
import { FormCard } from '@/modules/forms/admin/FormCard';
import { DeleteFormDialog } from '@/modules/forms/admin/DeleteFormDialog';
import { FormsListHeader } from '@/modules/forms/admin/FormsListHeader';

export default function AdminFormsListPage() {
  const { currentTeacher } = useApp();
  const [forms, setForms] = useState<FormModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FormModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isKepsek = !!(
    currentTeacher?.role?.toLowerCase().includes('kepala sekolah') ||
    currentTeacher?.role?.toLowerCase().includes('admin') ||
    currentTeacher?.nip === '199610272019032006'
  );

  const fetchForms = useCallback(async () => {
    try {
      const q = new URLSearchParams();
      if (currentTeacher?.nip) q.set('nip', currentTeacher.nip);
      if (isKepsek) q.set('isKepsek', 'true');

      const res = await fetch(`/api/admin/forms?${q.toString()}`);
      const json = await res.json();
      if (json.success && json.data) setForms(json.data as FormModel[]);
    } catch {} finally {
      setLoading(false);
    }
  }, [isKepsek, currentTeacher?.nip]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleCreateNew = async () => {
    const title = prompt('Masukkan judul formulir baru:');
    if (!title?.trim()) return;

    setCreating(true);
    try {
      const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
      const res = await fetch('/api/admin/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug,
          type: 'standard',
          created_by: currentTeacher?.nip || 'Guru',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setForms([json.data as FormModel, ...forms]);
      } else {
        alert(json.error || 'Gagal membuat formulir');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/forms?id=${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setForms(forms.filter((f) => f.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert(json.error || 'Gagal menghapus formulir');
      }
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
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
      <FormsListHeader creating={creating} onCreateNew={handleCreateNew} />

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
