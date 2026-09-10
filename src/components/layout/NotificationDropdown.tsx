'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

export interface NotificationItem {
  id: string;
  text: string;
  type: 'warning' | 'info' | 'error' | 'success';
  icon: string;
  targetView?: string;
}

interface NotificationDropdownProps {
  items: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationDropdown({ items, isOpen, onClose }: NotificationDropdownProps) {
  const { currentTeacher, setActiveView, showToast } = useApp();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, [isOpen]);

  const triggerTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('SD Negeri Bobong', {
          body: 'Notifikasi browser Anda berhasil aktif dan siap menerima peringatan.',
          icon: '/assets/logo-sdn-bobong.png'
        });
      } catch (e) {
        console.warn('[Notification] Direct notification fallback triggered', e);
      }
    }
  };

  const handleSubscribePush = async () => {
    if (typeof window === 'undefined') return;

    if (!('Notification' in window)) {
      showToast('Peramban Anda tidak mendukung fitur notifikasi desktop.', 'error');
      return;
    }

    setIsSubscribing(true);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        showToast('Izin notifikasi belum diizinkan oleh peramban.', 'error');
        setIsSubscribing(false);
        return;
      }

      triggerTestNotification();

      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        showToast('Notifikasi desktop aktif (Push offline tidak didukung browser ini).', 'info');
        setIsSubscribing(false);
        return;
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SW_TIMEOUT')), 3500)
      );

      const swReadyPromise = navigator.serviceWorker.ready;
      const registration = await Promise.race([swReadyPromise, timeoutPromise]).catch(() => null) as ServiceWorkerRegistration | null;

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (registration && vapidKey) {
        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        }

        await fetch('/api/webpush', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            nip: currentTeacher?.nip
          })
        }).catch(err => console.warn('[WebPush Sync Warning]', err));
      }

      showToast('Notifikasi peramban berhasil diaktifkan!', 'success');
    } catch (err: any) {
      console.error('[Web Push Registration Error]', err);
      showToast('Izin peramban aktif untuk notifikasi sistem.', 'info');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleItemClick = (targetView?: string) => {
    if (targetView) {
      setActiveView(targetView);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 p-4 text-left text-xs space-y-3 animate-fade-in">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="font-black text-slate-800 flex items-center gap-1.5">
            <i className="ri-notification-badge-line text-primary text-sm" /> Notifikasi Harian
          </span>
          <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {items.length} Peringatan
          </span>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="text-center py-6 text-slate-400 font-semibold">Semua tugas administrasi hari ini tuntas!</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.targetView)}
                className={`flex gap-2.5 p-2.5 rounded-xl border transition-all ${
                  item.targetView ? 'cursor-pointer hover:bg-slate-100/70 hover:border-slate-300' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="text-amber-500 mt-0.5 shrink-0">
                  <i className={`${item.icon} text-base`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-700 leading-snug">{item.text}</p>
                  {item.targetView && (
                    <span className="text-[9px] font-extrabold text-primary flex items-center gap-1 mt-1">
                      Buka Menu <i className="ri-arrow-right-line" />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 pt-2.5">
          {permission === 'granted' ? (
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-800">
              <span className="text-[10px] font-bold flex items-center gap-1.5">
                <i className="ri-checkbox-circle-fill text-emerald-600" /> Notifikasi Browser Aktif
              </span>
              <button
                type="button"
                onClick={triggerTestNotification}
                className="text-[9px] font-extrabold text-emerald-700 hover:underline cursor-pointer"
              >
                Uji Notifikasi
              </button>
            </div>
          ) : (
            <Button
              onClick={handleSubscribePush}
              disabled={isSubscribing}
              variant="outline"
              className="w-full text-[10px] font-black h-8 rounded-xl bg-teal-50/60 hover:bg-teal-100/60 border-teal-200 text-teal-700 gap-1.5 transition-all"
            >
              {isSubscribing ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm" /> Memproses Izin...
                </>
              ) : (
                <>
                  <i className="ri-notification-badge-line" />
                  {permission === 'denied' ? 'Izin Diblokir di Browser' : 'Aktifkan Notifikasi Browser'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
