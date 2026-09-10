'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationDropdown, NotificationItem } from './NotificationDropdown';

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    activeView,
    currentTeacher,
    logout,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    isLoading,
    students,
    attendance,
    journals,
    assignments
  } = useApp();

  const titleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    siswa: 'Data Siswa',
    virtual_card: 'Kartu Siswa Virtual',
    kelas: 'Data Kelas',
    absensi: 'Absensi',
    counseling: 'Bimbingan Konseling',
    jadwal: 'Jadwal Pelajaran',
    nilai: 'Daftar Nilai',
    jurnal: 'Jurnal Mengajar',
    modul: 'Modul Ajar',
    materi: 'Media Flashcard',
    tugas: 'Tugas & Bank Soal',
    laporan: 'Laporan',
    guru: 'Kelola Data Guru',
    pengaturan: 'Pengaturan'
  };

  const isKepsek =
    currentTeacher?.role?.toLowerCase().includes('kepala') ||
    currentTeacher?.role?.toLowerCase().includes('admin') ||
    currentTeacher?.nip === '199610272019032006';

  const getTeacherAssignedClass = (role: string) => {
    const match = role?.match(/Wali Kelas\s+([1-6][A-B]?)/i);
    return match ? match[1] : null;
  };

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role || '');

  // Calculate dynamic reminders with Click-to-Action
  const notificationItems = useMemo(() => {
    const alerts: NotificationItem[] = [];

    // 1. Attendance warning for today (Wali Kelas)
    if (lockedClass) {
      const classStudents = students.filter((s) => s.classId === lockedClass);
      const todayAttendance = attendance.filter((a) => a.date === todayStr);
      const filled =
        classStudents.length > 0 &&
        classStudents.every((s) =>
          todayAttendance.some((a) => a.student_id === s.id || a.studentId === s.id)
        );
      if (!filled) {
        alerts.push({
          id: 'attendance-today',
          text: `Presensi siswa Kelas ${lockedClass} hari ini belum diisi.`,
          type: 'warning',
          icon: 'ri-checkbox-blank-circle-line',
          targetView: 'absensi'
        });
      }
    }

    // 2. Journal warning for today (exclude Headmaster/Executive Admin)
    const filledJournal = journals.some(
      (j) => j.date === todayStr && j.teacherNip === currentTeacher?.nip
    );
    if (!filledJournal && currentTeacher?.nip !== '199610272019032006') {
      alerts.push({
        id: 'journal-today',
        text: 'Jurnal mengajar Anda hari ini belum diisi.',
        type: 'warning',
        icon: 'ri-book-read-line',
        targetView: 'jurnal'
      });
    }

    // 3. Assignment deadlines warning (due within next 3 days)
    const activeTasks = assignments || [];
    activeTasks.forEach((a) => {
      if (a.status === 'Aktif' && a.dueDate) {
        const due = new Date(a.dueDate).getTime();
        const todayTime = new Date(todayStr).getTime();
        const diffDays = Math.ceil((due - todayTime) / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 3) {
          let timeText = `Berakhir dalam ${diffDays} hari`;
          if (diffDays <= 0) {
            timeText = 'Jatuh tempo HARI INI!';
          } else if (diffDays === 1) {
            timeText = 'Berakhir BESOK (1 hari lagi)';
          }

          alerts.push({
            id: `task-due-${a.id}`,
            text: `Tenggat tugas "${a.title}" (${a.dueDate}) ${timeText}.`,
            type: 'info',
            icon: 'ri-time-line',
            targetView: 'tugas'
          });
        }
      }
    });

    // 4. Pending verification for Headmaster
    if (isKepsek) {
      const pendingVerifications = activeTasks.filter(
        (a) => a.status === 'Menunggu Verifikasi'
      );
      if (pendingVerifications.length > 0) {
        alerts.push({
          id: 'pending-verification-soal',
          text: `Ada ${pendingVerifications.length} naskah tugas/soal baru publik yang membutuhkan verifikasi Kepala Sekolah.`,
          type: 'warning',
          icon: 'ri-shield-check-line',
          targetView: 'tugas'
        });
      }
    }

    return alerts;
  }, [students, attendance, journals, assignments, lockedClass, todayStr, currentTeacher, isKepsek]);

  return (
    <header className="top-bar flex justify-between items-center px-6 py-3.5 bg-white/70 backdrop-blur-xl border-b border-white/80 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          className="menu-toggle md:hidden p-2 rounded-apple-md text-slate-600 hover:bg-white/60 hover:text-primary backdrop-blur-sm border border-transparent hover:border-white/80 transition-all active:scale-[0.96]"
          id="menuToggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className={sidebarOpen ? 'ri-close-line text-xl' : 'ri-menu-line text-xl'} />
        </button>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex items-center justify-center p-2 rounded-apple-md text-slate-500 hover:bg-white/60 hover:text-primary backdrop-blur-sm border border-transparent hover:border-white/80 transition-all duration-200 active:scale-[0.96]"
          title={sidebarCollapsed ? 'Perbesar Menu' : 'Kecilkan Menu'}
        >
          <i className={sidebarCollapsed ? 'ri-menu-unfold-line text-xl' : 'ri-menu-fold-line text-xl'} />
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
        {isLoading && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50/50 border border-cyan-100/80 text-cyan-700 rounded-xl animate-pulse">
            <i className="ri-refresh-line animate-spin text-sm" />
            <span className="text-[10px] font-black uppercase tracking-wider hidden md:inline">
              Sinkronisasi Cloud...
            </span>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-apple-md text-slate-500 hover:bg-white/60 hover:text-primary backdrop-blur-sm border border-transparent hover:border-white/80 transition-all flex items-center justify-center active:scale-[0.96]"
            title="Pusat Peringatan & Notifikasi"
          >
            <i className="ri-notification-3-line text-xl" />
            {notificationItems.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          <NotificationDropdown
            items={notificationItems}
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

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
