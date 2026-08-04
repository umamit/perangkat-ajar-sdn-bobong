import { showToast } from './showToast';
import { appData, saveStorage } from '../helpers';
import { closeModal } from './closeModal';
import { renderMateriFlashcards } from './renderMateriFlashcards';

export function saveFlashcard(e: Event): void {
  e.preventDefault();
  const word = (document.getElementById('flashcardWord') as HTMLInputElement).value.trim();
  const translate = (document.getElementById('flashcardTranslate') as HTMLInputElement).value.trim();
  const category = (document.getElementById('flashcardCategory') as HTMLSelectElement).value;
  const example = (document.getElementById('flashcardExample') as HTMLInputElement).value.trim();

  const newCard = {
    id: (appData.flashcards || []).length + 1,
    word,
    translate,
    category,
    example,
    icon: 'ri-book-open-line'
  };

  appData.flashcards.unshift(newCard);
  saveStorage();
  renderMateriFlashcards();
  closeModal();
  alert(`✅ Kartu kosakata "${word}" berhasil ditambahkan!`);
}
