import { SupervisionItem } from "@/types/supervision";
import { postSyncMutation } from "./postSyncMutation";

export async function saveSupervisionToSupabase(item: SupervisionItem) {
  const payload = {
    id: item.id,
    teacher_nip: item.teacherNip || "-",
    teacher_name: item.teacherName,
    class_id: item.classId,
    subject: item.subject,
    date: item.date,
    time_slot: item.timeSlot || null,
    topic: item.topic,
    scores: item.scores,
    total_score: item.totalScore,
    percentage: item.percentage,
    predicate: item.predicate,
    notes_good: item.notesGood || null,
    notes_improve: item.notesImprove || null,
    recommendations: item.recommendations || null,
  };
  return postSyncMutation("saveSupervision", payload);
}

export async function deleteSupervisionFromSupabase(id: string) {
  return postSyncMutation("deleteSupervision", { id });
}
