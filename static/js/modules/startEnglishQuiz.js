import { renderQuizQuestion } from './renderQuizQuestion.js';
export let quizState = { currentIndex: 0, score: 0 };
export function startEnglishQuiz() {
    quizState.currentIndex = 0;
    quizState.score = 0;
    const quizBox = document.getElementById('quizContainer');
    if (quizBox) {
        quizBox.style.display = 'block';
        renderQuizQuestion();
    }
}
