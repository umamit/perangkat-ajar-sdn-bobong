// Schedule-specific Supabase helpers (separated for modularity)

export async function saveScheduleToSupabase(payload: {
  id?: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  classId: string;
  subject: string;
  teacherNip: string;
}) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveSchedule', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Schedule Error]', e);
    return false;
  }
}

export async function deleteScheduleFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteSchedule', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Schedule Error]', e);
    return false;
  }
}
