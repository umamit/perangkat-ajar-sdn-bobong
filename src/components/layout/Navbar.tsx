'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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

  const handleSubscribePush = async () => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Browser Anda tidak mendukung push notification.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Izin notifikasi ditolak oleh pengguna.');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        alert('Public VAPID key tidak terkonfigurasi di env.');
        return;
      }
      
      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }

      const res = await fetch('/api/webpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          nip: currentTeacher?.nip
        })
      });

      const responseData = await res.json();
      if (responseData.success) {
        alert('Notifikasi sistem berhasil diaktifkan untuk perangkat ini!');
        await fetch(`/api/webpush?title=SDN Bobong&message=Selamat! Perangkat Anda berhasil berlangganan notifikasi.`);
      } else {
        alert('Gagal mengaktifkan notifikasi: ' + responseData.error);
      }
    } catch (err: any) {
      console.error('[Web Push Registration Error]', err);
      alert('Kesalahan saat mendaftar notifikasi: ' + err.message);
    }
  };

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

  const isKepsek = currentTeacher?.role?.toLowerCase().includes('kepala') || currentTeacher?.role?.toLowerCase().includes('admin') || currentTeacher?.nip === '199610272019032006';

  const getTeacherAssignedClass = (role: string, subject: string) => {
    const match = role?.match(/Wali Kelas\s+([1-6][A-B]?)/i);
    return match ? match[1] : null;
  };

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role || '', currentTeacher?.subject || '');

  // Calculate dynamic reminders
  const notificationItems = useMemo(() => {
    const alerts: { id: string; text: string; type: 'warning' | 'info' | 'error'; icon: string }[] = [];

    // 1. Attendance warning for today
    if (lockedClass) {
      const classStudents = students.filter(s => s.classId === lockedClass);
      const todayAttendance = attendance.filter(a => a.date === todayStr);
      const filled = classStudents.length > 0 && classStudents.every(s => 
        todayAttendance.some(a => (a.student_id === s.id || a.studentId === s.id))
      );
      if (!filled) {
        alerts.push({
          id: 'attendance-today',
          text: `Presensi siswa Kelas ${lockedClass} hari ini belum diisi.`,
          type: 'warning',
          icon: 'ri-checkbox-blank-circle-line'
        });
      }
    }

    // 2. Journal warning for today (exclude Headmaster/Executive Admin)
    const filledJournal = journals.some(j => j.date === todayStr && j.teacherNip === currentTeacher?.nip);
    if (!filledJournal && currentTeacher?.nip !== '199610272019032006') {
      alerts.push({
        id: 'journal-today',
        text: 'Jurnal mengajar Anda hari ini belum diisi.',
        type: 'warning',
        icon: 'ri-book-read-line'
      });
    }

    // 3. Assignment deadlines warning (due within next 3 days)
    const activeTasks = assignments || [];
    activeTasks.forEach(a => {
      if (a.status === 'Aktif' && a.dueDate) {
        const due = new Date(a.dueDate).getTime();
        const todayTime = new Date(todayStr).getTime();
        const diffDays = (due - todayTime) / (1000 * 60 * 60 * 24);
        if (diffDays >= 0 && diffDays <= 3) {
          alerts.push({
            id: `task-due-${a.id}`,
            text: `Tenggat tugas "${a.title}" (${a.dueDate}) segera berakhir dalam ${Math.ceil(diffDays)} hari.`,
            type: 'info',
            icon: 'ri-time-line'
          });
        }
      }
    });

    return alerts;
  }, [students, attendance, journals, assignments, lockedClass, todayStr, currentTeacher]);

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

        {/* Dynamic Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors flex items-center justify-center"
            title="Pusat Peringatan & Notifikasi"
          >
            <i className="ri-notification-3-line text-xl" />
            {notificationItems.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 p-4 text-left text-xs space-y-3 animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-black text-slate-800 flex items-center gap-1">
                    <i className="ri-notification-badge-line text-primary" /> Notifikasi Harian
                  </span>
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {notificationItems.length} Peringatan
                  </span>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {notificationItems.length === 0 ? (
                    <p className="text-center py-6 text-slate-400 font-semibold">Semua tugas administrasi hari ini tuntas! ✨</p>
                  ) : (
                    notificationItems.map((item, idx) => (
                      <div key={item.id || idx} className="flex gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 transition-colors">
                        <div className="text-amber-500 mt-0.5 shrink-0">
                          <i className={`${item.icon} text-sm`} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 leading-normal">{item.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-slate-100 pt-2">
                  <Button
                    onClick={handleSubscribePush}
                    variant="outline"
                    className="w-full text-[10px] font-black h-8 rounded-xl bg-teal-50/50 hover:bg-teal-50 border-teal-200 text-teal-700 gap-1"
                  >
                    <i className="ri-notification-badge-line" /> Aktifkan Notifikasi Browser
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

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
