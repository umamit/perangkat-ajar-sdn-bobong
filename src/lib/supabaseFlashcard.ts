import { postSyncMutation } from './supabaseMutations';

export async function saveFlashcardToSupabase(flashcard: any) {
  const payload = {
    id: flashcard.id,
    title: flashcard.title || flashcard.category || 'General',
    word: flashcard.word,
    meaning: flashcard.meaning || flashcard.translate,
    phase: flashcard.phase,
    teacher_nip: flashcard.teacherNip || flashcard.teacher_nip || null,
  };
  return postSyncMutation('saveFlashcard', payload, payload.teacher_nip || undefined);
}

export async function deleteFlashcardFromSupabase(id: string) {
  return postSyncMutation('deleteFlashcard', { id });
}

export async function deleteFlashcardDeckFromSupabase(title: string, teacherNip: string) {
  return postSyncMutation('deleteFlashcardDeck', { title, teacher_nip: teacherNip }, teacherNip);
}
