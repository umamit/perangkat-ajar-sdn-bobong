function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function requestBrowserPush(currentTeacherNip: string | undefined, showToast: any, setPermission: any, triggerTestNotification: any) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return showToast("Peramban Anda tidak mendukung fitur notifikasi desktop.", "error");
  }
  try {
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return showToast("Izin notifikasi belum diizinkan oleh peramban.", "error");
    triggerTestNotification();
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return showToast("Notifikasi desktop aktif (Push offline tidak didukung browser ini).", "info");
    }
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("SW_TIMEOUT")), 3500));
    const registration = await Promise.race([navigator.serviceWorker.ready, timeout]).catch(() => null) as ServiceWorkerRegistration | null;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (registration && vapidKey) {
      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
      let sub = await registration.pushManager.getSubscription();
      if (!sub) sub = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: convertedVapidKey });
      await fetch("/api/webpush", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub, nip: currentTeacherNip })
      }).catch(err => console.warn("[WebPush Sync Warning]", err));
    }
    showToast("Notifikasi peramban berhasil diaktifkan!", "success");
  } catch (err) {
    showToast("Izin peramban aktif untuk notifikasi sistem.", "info");
  }
}
