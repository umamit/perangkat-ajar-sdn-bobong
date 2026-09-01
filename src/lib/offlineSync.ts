import {
  saveStudentToSupabase,
  deleteStudentFromSupabase,
  saveJournalToSupabase,
  deleteJournalFromSupabase,
  saveAssignmentToSupabase,
  deleteAssignmentFromSupabase,
  saveModuleToSupabase,
  saveGradeToSupabase,
  saveAttendanceToSupabase,
  saveCounselingLogToSupabase,
  deleteCounselingLogFromSupabase,
  saveSchoolSettingsToSupabase
} from './supabase';

import { Student, Teacher, JournalEntry, ClassInfo, AttendanceRecord, ModuleAjar, FlashcardItem, TaskItem, GradeRecord, CounselingLog, Schedule, SchoolSettings } from '@/types';

export interface AppCacheData {
  teachers: Teacher[];
  students: Student[];
  classes: ClassInfo[];
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  modules: ModuleAjar[];
  flashcards: FlashcardItem[];
  assignments: TaskItem[];
  grades: GradeRecord[];
  counselingLogs?: CounselingLog[];
  schedules?: Schedule[];
  schoolSettings?: SchoolSettings;
}

export interface PendingMutation {
  id: string;
  action: string;
  payload: unknown;
  timestamp: number;
}

export function getOfflineQueue(): PendingMutation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('sdn_bobong_pending_mutations');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveOfflineQueue(queue: PendingMutation[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sdn_bobong_pending_mutations', JSON.stringify(queue));
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

export async function flushOfflineQueue(showToast?: (msg: string, type: 'success' | 'error' | 'info') => void): Promise<boolean> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return true;

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.log('[Offline Sync] Device still offline, skipping sync.');
    return false;
  }

  if (showToast) {
    showToast(`Menyinkronkan ${queue.length} perubahan data tertunda ke Supabase Cloud...`, 'info');
  }

  let successCount = 0;
  const failedMutations: PendingMutation[] = [];

  for (const item of queue) {
    let success = false;
    try {
      switch (item.action) {
        case 'saveStudent':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success = await saveStudentToSupabase(item.payload as any);
          break;
        case 'deleteStudent':
          success = await deleteStudentFromSupabase(item.payload as string);
          break;
        case 'saveJournal':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success = await saveJournalToSupabase(item.payload as any);
          break;
        case 'deleteJournal':
          success = await deleteJournalFromSupabase(item.payload as string);
          break;
        case 'saveAssignment':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success = await saveAssignmentToSupabase(item.payload as any);
          break;
        case 'deleteAssignment':
          success = await deleteAssignmentFromSupabase(item.payload as string);
          break;
        case 'saveModule':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success = await saveModuleToSupabase(item.payload as any);
          break;
        case 'saveGrade':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success = await saveGradeToSupabase(item.payload as any);
          break;
        case 'saveAttendance':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success = await saveAttendanceToSupabase(item.payload as any);
          break;
        case 'saveCounselingLog':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success = await saveCounselingLogToSupabase(item.payload as any);
          break;
        case 'deleteCounselingLog':
          success = await deleteCounselingLogFromSupabase(item.payload as string);
          break;
        case 'saveSchoolSettings':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success = await saveSchoolSettingsToSupabase(item.payload as any);
          break;
        default:
          success = true;
      }
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
      showToast(`Sinkronisasi sukses! ${successCount} data berhasil tersimpan ke cloud.`, 'success');
    } else {
      showToast(`Sebagian sinkronisasi tertunda: ${successCount} berhasil, ${failedMutations.length} gagal.`, 'error');
    }
  }

  return failedMutations.length === 0;
}

export function saveAppCache(data: AppCacheData) {
  // Disabled: Data is always fetched fresh directly from Supabase Cloud
}

export function loadAppCache(): AppCacheData | null {
  // Disabled: Data is always fetched fresh directly from Supabase Cloud
  return null;
}
