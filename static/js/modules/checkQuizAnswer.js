import { appData } from '../helpers.js';
import { quizState } from './startEnglishQuiz.js';
import { renderQuizQuestion } from './renderQuizQuestion.js';
export function checkQuizAnswer(selectedOption) {
    const q = appData.quizQuestions[quizState.currentIndex];
    if (selectedOption === q.answer) {
        quizState.score += 25;
        alert('Benar Sekali! Great Job!');
    }
    else {
        alert(`Kurang Tepat. Jawaban yang benar: "${q.answer}"`);
    }
    quizState.currentIndex++;
    renderQuizQuestion();
}
