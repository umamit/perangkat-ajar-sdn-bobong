// Barrel re-export for views
import { exportSiswaToCSV } from './modules/exportSiswaToCSV';
import { exportNilaiToCSV } from './modules/exportNilaiToCSV';
import { startEnglishQuiz, renderQuizQuestion, checkQuizAnswer } from './modules/englishQuiz';
import { renderModulAjar, printWorksheet } from './modules/modulAjarView';

export {
  exportSiswaToCSV,
  exportNilaiToCSV,
  startEnglishQuiz,
  renderQuizQuestion,
  checkQuizAnswer,
  renderModulAjar,
  printWorksheet
};

// Global Browser Window State Attachment
if (typeof window !== 'undefined') {
  (window as any).exportSiswaToCSV = exportSiswaToCSV;
  (window as any).exportNilaiToCSV = exportNilaiToCSV;
  (window as any).startEnglishQuiz = startEnglishQuiz;
  (window as any).renderQuizQuestion = renderQuizQuestion;
  (window as any).checkQuizAnswer = checkQuizAnswer;
  (window as any).renderModulAjar = renderModulAjar;
  (window as any).printWorksheet = printWorksheet;
}
