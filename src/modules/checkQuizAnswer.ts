import { showToast } from './showToast';
import { appData } from '../helpers';
import { quizState } from './startEnglishQuiz';
import { renderQuizQuestion } from './renderQuizQuestion';

export function checkQuizAnswer(selectedOption: string): void {
  const q = appData.quizQuestions[quizState.currentIndex];
  if (selectedOption === q.answer) {
    quizState.score += 25;
    showToast('Benar Sekali! Great Job!', 'success');
  } else {
    alert(`Kurang Tepat. Jawaban yang benar: "${q.answer}"`);
  }
  quizState.currentIndex++;
  renderQuizQuestion();
}
