import { renderQuizQuestion } from './renderQuizQuestion';

export let quizState = { currentIndex: 0, score: 0 };

export function startEnglishQuiz(): void {
  quizState.currentIndex = 0;
  quizState.score = 0;
  const quizBox = document.getElementById('quizContainer');
  if (quizBox) {
    quizBox.style.display = 'block';
    renderQuizQuestion();
  }
}
