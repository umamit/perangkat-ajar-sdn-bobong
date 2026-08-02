import { appData } from '../helpers';
import { quizState } from './startEnglishQuiz';

export function renderQuizQuestion(): void {
  const quizBox = document.getElementById('quizContainer');
  if (!quizBox) return;
  const q = appData.quizQuestions[quizState.currentIndex];

  if (!q) {
    quizBox.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <h2 style="color:var(--primary-dark); font-size:22px; margin-bottom:8px;">Selamat! Kuis Selesai!</h2>
        <p style="font-size:16px; margin-bottom:16px;">Skor Akhir: <strong>${quizState.score} / ${appData.quizQuestions.length * 25} Point</strong></p>
        <button class="btn btn-primary" onclick="startEnglishQuiz()">Mainkan Lagi</button>
      </div>
    `;
    return;
  }

  quizBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <strong style="font-size:13px; color:var(--primary-dark);">Soal Nomor ${quizState.currentIndex + 1} dari ${appData.quizQuestions.length}</strong>
      <span class="badge badge-success">Skor: ${quizState.score}</span>
    </div>
    <h3 style="font-size:16px; margin-bottom:16px; color:#1e293b;">${q.question}</h3>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
      ${q.options.map(opt => `
        <button class="btn btn-secondary" onclick="checkQuizAnswer('${opt}')" style="justify-content:flex-start; text-align:left; padding:12px;">
          ${opt}
        </button>
      `).join('')}
    </div>
  `;
}
