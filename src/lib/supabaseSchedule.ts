import { postSyncMutation } from './supabaseMutations';

export async function saveScheduleToSupabase(payload: {
  id?: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  classId: string;
  subject: string;
  teacherNip: string;
}) {
  return postSyncMutation('saveSchedule', payload, payload.teacherNip);
}

export async function deleteScheduleFromSupabase(id: string) {
  return postSyncMutation('deleteSchedule', { id });
}
