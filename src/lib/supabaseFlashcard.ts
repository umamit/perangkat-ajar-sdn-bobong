export async function saveFlashcardToSupabase(flashcard: any) {
  try {
    const payload = {
      id: flashcard.id,
      title: flashcard.title || flashcard.category || 'General',
      word: flashcard.word,
      meaning: flashcard.meaning || flashcard.translate,
      phase: flashcard.phase,
      teacher_nip: flashcard.teacherNip || flashcard.teacher_nip || null
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveFlashcard', payload })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Save Flashcard Error]', e);
    return false;
  }
}

export async function deleteFlashcardFromSupabase(id: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteFlashcard', payload: { id } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Flashcard Error]', e);
    return false;
  }
}

export async function deleteFlashcardDeckFromSupabase(title: string, teacherNip: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteFlashcardDeck', payload: { title, teacher_nip: teacherNip } })
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.warn('[Delete Flashcard Deck Error]', e);
    return false;
  }
}
