import { openModal } from './openModal';

export function showAddFlashcardModal(): void {
  const form = `
    <form onsubmit="saveFlashcard(event)">
      <div class="form-group">
        <label>Kata Bahasa Inggris (English Word)</label>
        <input type="text" id="flashcardWord" placeholder="Contoh: Classroom" required>
      </div>
      <div class="form-group">
        <label>Terjemahan Bahasa Indonesia</label>
        <input type="text" id="flashcardTranslate" placeholder="Contoh: Ruang Kelas" required>
      </div>
      <div class="form-group">
        <label>Kategori Kosakata</label>
        <select id="flashcardCategory" required>
          <option value="School & Classroom">School & Classroom</option>
          <option value="Action Verbs">Action Verbs</option>
          <option value="Feelings">Feelings</option>
          <option value="Animals">Animals</option>
          <option value="Foods & Drinks">Foods & Drinks</option>
          <option value="Professions">Professions</option>
          <option value="Family Members">Family Members</option>
        </select>
      </div>
      <div class="form-group">
        <label>Contoh Kalimat</label>
        <input type="text" id="flashcardExample" placeholder="Contoh: We study in the classroom." required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
        <i class="ri-save-line"></i> Simpan Kartu Kosakata
      </button>
    </form>
  `;
  openModal('Tambah Kartu Kosakata (Flashcard)', form);
}
