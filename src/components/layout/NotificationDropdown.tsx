"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { requestBrowserPush } from "./notificationPushUtil";

export interface NotificationItem {
  id: string;
  text: string;
  type: "warning" | "info" | "error" | "success";
  icon: string;
  targetView?: string;
}

export function NotificationDropdown({ items, isOpen, onClose, dismissedIds = [], onDismiss, onClearAll }: any) {
  const { currentTeacher, setActiveView, showToast } = useApp();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) setPermission(Notification.permission);
  }, [isOpen]);

  const triggerTestNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("SD Negeri Bobong", { body: "Notifikasi browser Anda berhasil aktif dan siap menerima peringatan.", icon: "/assets/logo-sdn-bobong.png" });
      } catch {}
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    await requestBrowserPush(currentTeacher?.nip, showToast, setPermission, triggerTestNotification);
    setIsSubscribing(false);
  };

  const handleItemClick = (itemId: string, targetView?: string) => {
    if (onDismiss) onDismiss(itemId);
    if (targetView) { setActiveView(targetView); onClose(); }
  };

  if (!isOpen) return null;
  const visibleItems = items.filter((item: any) => !dismissedIds.includes(item.id));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/10 sm:bg-transparent" onClick={onClose} />
      <div className="fixed sm:absolute inset-x-3 sm:inset-auto top-16 sm:top-full sm:right-0 sm:mt-2 w-auto sm:w-84 max-w-sm sm:max-w-none mx-auto sm:mx-0 bg-white border border-slate-200/80 rounded-2xl shadow-2xl sm:shadow-xl z-50 p-4 text-left text-xs space-y-3 animate-fade-in">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="font-black text-slate-800 flex items-center gap-1.5">
            <i className="ri-notification-badge-line text-primary text-sm" /> Notifikasi Harian
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">{visibleItems.length} Peringatan</span>
            {visibleItems.length > 0 && onClearAll && (
              <button type="button" onClick={onClearAll} className="text-[10px] font-extrabold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer">Bersihkan</button>
            )}
          </div>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {visibleItems.length === 0 ? (
            <p className="text-center py-6 text-slate-400 font-semibold">Semua tugas administrasi hari ini tuntas!</p>
          ) : (
            visibleItems.map((item: any) => (
              <div key={item.id} className="group relative flex gap-2.5 p-2.5 rounded-xl border bg-slate-50 border-slate-100 hover:bg-slate-100/70 hover:border-slate-200 transition-all">
                <div onClick={() => handleItemClick(item.id, item.targetView)} className={"flex gap-2.5 flex-1 min-w-0 " + (item.targetView ? "cursor-pointer" : "")}>
                  <div className="text-amber-500 mt-0.5 shrink-0"><i className={item.icon + " text-base"} /></div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[11px] font-bold text-slate-700 leading-snug">{item.text}</p>
                    {item.targetView && <span className="text-[9px] font-extrabold text-primary flex items-center gap-1 mt-1">Buka Menu <i className="ri-arrow-right-line" /></span>}
                  </div>
                </div>
                {onDismiss && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); onDismiss(item.id); }} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer">
                    <i className="ri-close-line text-sm" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 pt-2.5">
          {permission === "granted" ? (
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-800">
              <span className="text-[10px] font-bold flex items-center gap-1.5"><i className="ri-checkbox-circle-fill text-emerald-600" /> Notifikasi Browser Aktif</span>
              <button type="button" onClick={triggerTestNotification} className="text-[9px] font-extrabold text-emerald-700 hover:underline cursor-pointer">Uji Notifikasi</button>
            </div>
          ) : (
            <Button onClick={handleSubscribe} disabled={isSubscribing} variant="outline" className="w-full text-[10px] font-black h-8 rounded-xl bg-teal-50/60 hover:bg-teal-100/60 border-teal-200 text-teal-700 gap-1.5 transition-all">
              {isSubscribing ? (<><i className="ri-loader-4-line animate-spin text-sm" /> Memproses Izin...</>) : (<><i className="ri-notification-badge-line" /> {permission === "denied" ? "Izin Diblokir di Browser" : "Aktifkan Notifikasi Browser"}</>)}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
