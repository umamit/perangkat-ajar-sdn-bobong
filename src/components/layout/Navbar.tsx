'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const {
    activeView,
    currentTeacher,
    logout,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    isLoading
  } = useApp();

  const titleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    siswa: 'Data Siswa',
    kelas: 'Data Kelas',
    absensi: 'Absensi',
    nilai: 'Daftar Nilai',
    jurnal: 'Jurnal Mengajar',
    modul: 'Modul Ajar',
    materi: 'Media Flashcard',
    tugas: 'Tugas & Bank Soal',
    laporan: 'Laporan',
    guru: 'Kelola Data Guru',
    pengaturan: 'Pengaturan'
  };

  const isKepsek = currentTeacher?.role?.toLowerCase().includes('kepala') || currentTeacher?.role?.toLowerCase().includes('admin') || currentTeacher?.nip === '199610272019032006';

  return (
    <header className="top-bar flex justify-between items-center px-6 py-3.5 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          className="menu-toggle md:hidden p-2 rounded-apple-sm text-slate-600 hover:bg-slate-100 transition-colors"
          id="menuToggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className={sidebarOpen ? 'ri-close-line text-xl' : 'ri-menu-line text-xl'} />
        </button>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors duration-200"
          title={sidebarCollapsed ? "Perbesar Menu" : "Kecilkan Menu"}
        >
          <i className={sidebarCollapsed ? "ri-menu-unfold-line text-xl" : "ri-menu-fold-line text-xl"} />
        </button>
        <div className="top-title">
          <h2 id="currentViewTitle" className="text-lg font-extrabold text-slate-800 tracking-tight">
            {titleMap[activeView] || 'Dashboard'}
          </h2>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Perangkat Ajar SD Negeri Bobong - Kab. Pulau Taliabu
          </p>
        </div>
      </div>

      <div className="top-actions flex items-center gap-3">
        {/* Real-time Cloud Sync Indicator */}
        {isLoading && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50/50 border border-cyan-100/80 text-cyan-700 rounded-xl animate-pulse">
            <i className="ri-refresh-line animate-spin text-sm" />
            <span className="text-[10px] font-black uppercase tracking-wider hidden md:inline">Sinkronisasi Cloud...</span>
          </div>
        )}

        {/* User Account & Role Indicator Badge */}
        <div className="role-indicator flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 hidden md:inline">
              {currentTeacher?.name || 'Guru SD Bobong'}
            </span>
          </div>
          <Badge
            variant={isKepsek ? 'secondary' : 'default'}
            className="text-[10px] font-extrabold px-2.5 py-0.5"
          >
            <i className={isKepsek ? 'ri-shield-user-line mr-1' : 'ri-user-star-line mr-1'} />
            {currentTeacher?.role || 'Guru Mata Pelajaran'}
          </Badge>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          title="Keluar dari Akun"
          className="text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-bold transition-all"
        >
          <i className="ri-logout-box-r-line" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
