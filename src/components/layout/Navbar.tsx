'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const {
    activeView,
    activeRoleMode,
    setActiveRoleMode,
    setIsLoggedIn,
    sidebarOpen,
    setSidebarOpen,
    showToast,
    syncData,
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
    materi: 'Materi & Flashcards',
    tugas: 'Tugas & Bank Soal',
    laporan: 'Laporan',
    guru: 'Kelola Data Guru',
    pengaturan: 'Pengaturan'
  };

  const handleLogout = () => {
    document.cookie = 'sdn_bobong_auth=; Max-Age=-99999999; path=/;';
    setIsLoggedIn(false);
    showToast('Berhasil keluar dari akun', 'info');
  };

  return (
    <header className="top-bar flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          className="menu-toggle md:hidden p-2 rounded-apple-sm text-slate-600 hover:bg-slate-100"
          id="menuToggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className={sidebarOpen ? 'ri-close-line text-xl' : 'ri-menu-line text-xl'} />
        </button>
        <div className="top-title">
          <h2 id="currentViewTitle" className="text-xl font-bold text-slate-800">
            {titleMap[activeView] || 'Dashboard'}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            Perangkat Ajar SD Negeri Bobong - Kab. Pulau Taliabu
          </p>
        </div>
      </div>

      <div className="top-actions flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={syncData}
          disabled={isLoading}
          title="Sinkronkan data dengan Supabase"
          className="text-xs"
        >
          <i className={`ri-refresh-line ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sinkron</span>
        </Button>

        <div className="role-switcher-container flex items-center gap-1.5 bg-cyan-50/80 px-3 py-1.5 rounded-apple-md border border-cyan-200">
          <i className="ri-user-settings-line text-primary-dark text-xs" />
          <select
            id="roleModeSelect"
            value={activeRoleMode}
            onChange={(e) => setActiveRoleMode(e.target.value)}
            className="bg-transparent text-xs font-bold text-primary-dark outline-none cursor-pointer"
            title="Beralih Mode Tampilan Peran"
          >
            <option value="guru_inggris">Mode: Guru Bahasa Inggris</option>
            <option value="plt_kepsek">Mode: Plt. Kepala Sekolah (Admin)</option>
          </select>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          title="Keluar / Logout"
        >
          <i className="ri-logout-box-r-line" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
