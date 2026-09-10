"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotificationGenerator } from "./useNotificationGenerator";

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const {
    activeView, currentTeacher, logout, sidebarOpen, setSidebarOpen,
    sidebarCollapsed, setSidebarCollapsed, isLoading, students,
    attendance, journals, assignments
  } = useApp();

  useEffect(() => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const saved = localStorage.getItem("dismissed_notifications_" + today);
      if (saved) setDismissedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const handleDismissNotification = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem("dismissed_notifications_" + new Date().toISOString().split("T")[0], JSON.stringify(updated));
    } catch {}
  };

  const handleClearAllNotifications = () => {
    const allIds = notificationItems.map(n => n.id);
    setDismissedIds(allIds);
    try {
      localStorage.setItem("dismissed_notifications_" + new Date().toISOString().split("T")[0], JSON.stringify(allIds));
    } catch {}
  };

  const titleMap: Record<string, string> = {
    dashboard: "Dashboard", siswa: "Data Siswa", virtual_card: "Kartu Siswa Virtual", kelas: "Data Kelas",
    absensi: "Absensi", counseling: "Bimbingan Konseling", jadwal: "Jadwal Pelajaran", nilai: "Daftar Nilai",
    jurnal: "Jurnal Mengajar", modul: "Modul Ajar", materi: "Media Flashcard", tugas: "Tugas & Bank Soal",
    laporan: "Laporan", rapat: "Agenda & Notula Rapat", guru: "Kelola Data Guru", pengaturan: "Pengaturan"
  };

  const isKepsek = currentTeacher?.role?.toLowerCase().includes("kepala") || currentTeacher?.role?.toLowerCase().includes("admin") || currentTeacher?.nip === "199610272019032006";
  const lockedClass = currentTeacher?.role?.match(/Wali Kelas\s+([1-6][A-B]?)/i)?.[1] || null;
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const notificationItems = useNotificationGenerator({
    students, attendance, journals, assignments, lockedClass, todayStr, currentTeacher, isKepsek
  });

  return (
    <header className="top-bar flex justify-between items-center px-6 py-3.5 bg-white/70 backdrop-blur-xl border-b border-white/80 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button className="menu-toggle md:hidden p-2 rounded-apple-md text-slate-600 hover:bg-white/60 hover:text-primary transition-all active:scale-[0.96]" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className={sidebarOpen ? "ri-close-line text-xl" : "ri-menu-line text-xl"} />
        </button>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden md:flex items-center justify-center p-2 rounded-apple-md text-slate-500 hover:bg-white/60 hover:text-primary transition-all active:scale-[0.96]" title={sidebarCollapsed ? "Perbesar Menu" : "Kecilkan Menu"}>
          <i className={sidebarCollapsed ? "ri-menu-unfold-line text-xl" : "ri-menu-fold-line text-xl"} />
        </button>
        <div className="top-title">
          <h2 id="currentViewTitle" className="text-lg font-extrabold text-slate-800 tracking-tight">{titleMap[activeView] || "Dashboard"}</h2>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Perangkat Ajar SD Negeri Bobong - Kab. Pulau Taliabu</p>
        </div>
      </div>

      <div className="top-actions flex items-center gap-3">
        {isLoading && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50/50 border border-cyan-100/80 text-cyan-700 rounded-xl animate-pulse">
            <i className="ri-refresh-line animate-spin text-sm" />
            <span className="text-[10px] font-black uppercase tracking-wider hidden md:inline">Sinkronisasi Cloud...</span>
          </div>
        )}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-apple-md text-slate-500 hover:bg-white/60 hover:text-primary transition-all flex items-center justify-center active:scale-[0.96]" title="Pusat Peringatan & Notifikasi">
            <i className="ri-notification-3-line text-xl" />
            {notificationItems.filter(n => !dismissedIds.includes(n.id)).length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />}
          </button>
          <NotificationDropdown items={notificationItems} isOpen={showNotifications} onClose={() => setShowNotifications(false)} dismissedIds={dismissedIds} onDismiss={handleDismissNotification} onClearAll={handleClearAllNotifications} />
        </div>
        <div className="role-indicator flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 hidden md:inline">{currentTeacher?.name || "Guru SD Bobong"}</span>
          </div>
          <Badge variant={isKepsek ? "secondary" : "default"} className="text-[10px] font-extrabold px-2.5 py-0.5">
            <i className={isKepsek ? "ri-shield-user-line mr-1" : "ri-user-star-line mr-1"} />
            {currentTeacher?.role || "Guru Mata Pelajaran"}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} title="Keluar dari Akun" className="text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-bold transition-all">
          <i className="ri-logout-box-r-line" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
