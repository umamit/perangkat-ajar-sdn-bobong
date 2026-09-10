export async function postSyncMutation(action: string, payload: any, nip?: string): Promise<boolean> {
  try {
    const teacherNip = nip || payload?.teacher_nip || payload?.teacherNip || payload?.nip || "";
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-teacher-nip": teacherNip,
      },
      body: JSON.stringify({ action, payload }),
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn(`[Sync Error in ${action}]`, e);
    return false;
  }
}
