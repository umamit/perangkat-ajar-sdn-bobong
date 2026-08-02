// Helper Functions & Storage utilities for Perangkat Ajar SD Negeri Bobong

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwpXkZ1t6rKBb1hvZdEpmPKc-SRNV-41pRxw7Sr9TPz6WC65RdlFoI4ZI9p-FgEJxd30w/exec";

let appData = { ...INITIAL_DATA };

// Send Data Real-Time to Google Sheets
function sendToGoogleSheets(targetSheet, payload) {
  if (!GOOGLE_SCRIPT_URL) return;
  fetch(`${GOOGLE_SCRIPT_URL}?targetSheet=${targetSheet}`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(() => {
    console.log(`[Google Sheets] Data saved to sheet: ${targetSheet}`);
  }).catch(err => {
    console.error(`[Google Sheets Error]`, err);
  });
}

// LocalStorage Handlers
function loadStorage() {
  const saved = localStorage.getItem('sdn_bobong_app_data');
  if (saved) {
    try {
      appData = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse localStorage appData:', e);
    }
  }
}

function saveStorage() {
  localStorage.setItem('sdn_bobong_app_data', JSON.stringify(appData));
}

// Password Visibility Toggle
function togglePasswordVisibility() {
  const pwdInput = document.getElementById('loginPassword');
  const icon = document.getElementById('togglePasswordIcon');
  if (!pwdInput || !icon) return;
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    icon.className = 'ri-eye-off-line';
  } else {
    pwdInput.type = 'password';
    icon.className = 'ri-eye-line';
  }
}

// Text to Speech (TTS) for English Pronunciation
function speakText(event, text) {
  if (event) event.stopPropagation();
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

// Flashcard Flip Interaction
function flipCard(cardEl) {
  cardEl.classList.toggle('flipped');
}

// Register PWA Service Worker
function registerPwaServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch(err => console.error('[PWA] Service Worker registration failed:', err));
    });
  }
}
registerPwaServiceWorker();

