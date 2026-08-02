import { appData } from '../helpers';

export function filterFlashcards(query: string): void {
  const container = document.getElementById('flashcardsGrid');
  if (!container) return;

  const q = (query || '').toLowerCase().trim();
  const filtered = (appData.flashcards || []).filter(f =>
    f.word.toLowerCase().includes(q) ||
    f.translate.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:32px; color:var(--text-muted);">
        <i class="ri-search-eye-line" style="font-size:32px; display:block; margin-bottom:8px; opacity:0.4;"></i>
        Kosakata "${query}" tidak ditemukan.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(f => `
    <div class="flashcard" onclick="flipCard(this)">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="flashcard-emoji"><i class="${f.icon || 'ri-book-open-line'}"></i></div>
          <div class="flashcard-word">${f.word}</div>
          <span class="badge badge-info" style="margin-top:8px;">${f.category}</span>
          <button class="audio-btn" onclick="speakText(event, '${f.word}')" title="Dengarkan Pengucapan">
            <i class="ri-volume-up-line"></i>
          </button>
        </div>
        <div class="flashcard-back">
          <h3 style="font-size:18px; margin-bottom:6px;">${f.translate}</h3>
          <p style="font-size:13px; font-style:italic;">"${f.example}"</p>
          <small style="margin-top:10px; opacity:0.8;">Klik untuk kembali</small>
        </div>
      </div>
    </div>
  `).join('');
}
