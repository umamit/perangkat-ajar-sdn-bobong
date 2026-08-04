import { showToast } from './showToast.js';
import { appData } from '../helpers.js';
import { quizState } from './startEnglishQuiz.js';
import { renderQuizQuestion } from './renderQuizQuestion.js';
export function checkQuizAnswer(selectedOption) {
    const q = appData.quizQuestions[quizState.currentIndex];
    if (selectedOption === q.answer) {
        quizState.score += 25;
        showToast('Benar Sekali! Great Job!', 'success');
    }
    else {
        alert(`Kurang Tepat. Jawaban yang benar: "${q.answer}"`);
    }
    quizState.currentIndex++;
    renderQuizQuestion();
}
