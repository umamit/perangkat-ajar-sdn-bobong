import { appData } from '../helpers';
import { quizState } from './startEnglishQuiz';
import { renderQuizQuestion } from './renderQuizQuestion';

export function checkQuizAnswer(selectedOption: string): void {
  const q = appData.quizQuestions[quizState.currentIndex];
  if (selectedOption === q.answer) {
    quizState.score += 25;
    alert('Benar Sekali! Great Job!');
  } else {
    alert(`Kurang Tepat. Jawaban yang benar: "${q.answer}"`);
  }
  quizState.currentIndex++;
  renderQuizQuestion();
}
