'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ToastContainer } from '@/components/layout/ToastContainer';

import { LoginView } from '@/components/views/LoginView';
import { DashboardView } from '@/components/views/DashboardView';
import { SiswaView } from '@/components/views/SiswaView';
import { KelasView } from '@/components/views/KelasView';
import { AbsensiView } from '@/components/views/AbsensiView';
import { NilaiView } from '@/components/views/NilaiView';
import { JurnalView } from '@/components/views/JurnalView';
import { ModulView } from '@/components/views/ModulView';
import { AiAssistantView } from '@/components/views/AiAssistantView';
import { MateriFlashcardView } from '@/components/views/MateriFlashcardView';
import { TugasView } from '@/components/views/TugasView';
import { LaporanView } from '@/components/views/LaporanView';
import { GuruView } from '@/components/views/GuruView';
import { PengaturanView } from '@/components/views/PengaturanView';
import { JadwalView } from '@/components/views/JadwalView';
import { CounselingView } from '@/components/views/CounselingView';

function AppContent() {
  const { isLoggedIn, isInitializing, activeView, currentTeacher } = useApp();

  const isKepsek = !!(
    currentTeacher?.role?.toLowerCase().includes('kepala sekolah') ||
    currentTeacher?.role?.toLowerCase().includes('admin') ||
    currentTeacher?.nip === '199610272019032006'
  );

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-teal-50/40 to-slate-200">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Memuat Perangkat Ajar SD Negeri Bobong...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginView />;
  }

  return (
    <div className="app-container flex min-h-screen bg-bgMain">
      <Sidebar />
      <div className="main-wrapper flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="content-area p-6 space-y-6 flex-1 overflow-y-auto">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'siswa' && <SiswaView />}
          {activeView === 'kelas' && <KelasView />}
          {activeView === 'absensi' && <AbsensiView />}
          {activeView === 'counseling' && <CounselingView />}
          {activeView === 'jadwal' && <JadwalView />}
          {activeView === 'nilai' && <NilaiView />}
          {activeView === 'jurnal' && <JurnalView />}
          {activeView === 'modul' && <ModulView />}
          {activeView === 'ai_assistant' && <AiAssistantView />}
          {activeView === 'materi' && <MateriFlashcardView />}
          {activeView === 'tugas' && <TugasView />}
          {activeView === 'laporan' && <LaporanView />}
          {activeView === 'guru' && isKepsek && <GuruView />}
          {activeView === 'pengaturan' && <PengaturanView />}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
