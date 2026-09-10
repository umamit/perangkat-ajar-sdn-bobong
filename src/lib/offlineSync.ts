import { PendingMutation, AppCacheData } from "./offlineTypes";
import { executePendingMutation } from "./offlineSyncExecutor";

export * from "./offlineTypes";

export function getOfflineQueue(): PendingMutation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("sdn_bobong_pending_mutations");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveOfflineQueue(queue: PendingMutation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("sdn_bobong_pending_mutations", JSON.stringify(queue));
  } catch (e) {}
}

export function addToOfflineQueue(action: string, payload: unknown) {
  const queue = getOfflineQueue();
  const newMutation: PendingMutation = {
    id: Math.random().toString(36).substring(2, 9),
    action,
    payload,
    timestamp: Date.now()
  };
  queue.push(newMutation);
  saveOfflineQueue(queue);
  console.log(`[Offline Sync] Action "${action}" queued offline.`);
}

export async function flushOfflineQueue(showToast?: (msg: string, type: "success" | "error" | "info") => void): Promise<boolean> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return true;

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    console.log("[Offline Sync] Device still offline, skipping sync.");
    return false;
  }

  if (showToast) {
    showToast(`Menyinkronkan ${queue.length} perubahan data tertunda ke Supabase Cloud...`, "info");
  }

  let successCount = 0;
  const failedMutations: PendingMutation[] = [];

  for (const item of queue) {
    let success = false;
    try {
      success = await executePendingMutation(item);
    } catch (e) {
      console.warn(`[Offline Sync] Mutation failed: ${item.action}`, e);
    }

    if (success) {
      successCount++;
    } else {
      failedMutations.push(item);
    }
  }

  saveOfflineQueue(failedMutations);

  if (showToast) {
    if (failedMutations.length === 0) {
      showToast(`Sinkronisasi sukses! ${successCount} data berhasil tersimpan ke cloud.`, "success");
    } else {
      showToast(`Sebagian sinkronisasi tertunda: ${successCount} berhasil, ${failedMutations.length} gagal.`, "error");
    }
  }

  return failedMutations.length === 0;
}

export function saveAppCache(data: AppCacheData) {}
export function loadAppCache(): AppCacheData | null { return null; }
