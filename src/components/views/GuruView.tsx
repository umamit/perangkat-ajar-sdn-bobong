'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteTeacherFromSupabase } from '@/lib/supabase';
import { GuruTable } from './guru/GuruTable';
import { AddGuruModal } from './guru/AddGuruModal';

export function GuruView() {
  const { teachers, setTeachers, showToast, syncData, classes } = useApp();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (nip: string, name: string) => {
    if (confirm(`Hapus data guru ${name}?`)) {
      setTeachers(prev => prev.filter(t => t.nip !== nip));
      await deleteTeacherFromSupabase(nip);
      await syncData();
      showToast(`Data guru ${name} berhasil dihapus permanen dari Supabase Cloud`, 'info');
    }
  };

  const handleSuccessAdd = async (newTeacher: any) => {
    setTeachers(prev => [
      ...prev,
      {
        nip: newTeacher.nip,
        name: newTeacher.name,
        role: newTeacher.role,
        subject: newTeacher.subject,
        password: newTeacher.password,
        avatar: newTeacher.avatar_url,
      },
    ]);
    await syncData();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Kelola Data Guru &amp; Tenaga Pendidik
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Daftar tenaga pendidik terdaftar di Supabase Cloud SD Negeri Bobong
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowModal(true)}
          className="gap-1.5 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 h-9 sm:h-auto"
        >
          <i className="ri-user-add-line text-sm" /> Tambah Data Guru
        </Button>
      </div>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <GuruTable teachers={teachers} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <AddGuruModal
        open={showModal}
        onOpenChange={setShowModal}
        classes={classes}
        onSuccess={handleSuccessAdd}
        showToast={showToast}
      />
    </div>
  );
}
