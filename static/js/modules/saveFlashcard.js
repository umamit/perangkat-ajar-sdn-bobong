import { showToast } from './showToast.js';
import { appData, saveStorage } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderMateriFlashcards } from './renderMateriFlashcards.js';
export function saveFlashcard(e) {
    e.preventDefault();
    const word = document.getElementById('flashcardWord').value.trim();
    const translate = document.getElementById('flashcardTranslate').value.trim();
    const category = document.getElementById('flashcardCategory').value;
    const example = document.getElementById('flashcardExample').value.trim();
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
