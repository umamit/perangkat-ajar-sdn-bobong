import { appData, saveStorage, saveGradeToSupabase } from '../helpers.js';
import { renderDaftarNilai } from './renderDaftarNilai.js';

export function updateStudentGrade(studentId, field, value) {
  const numVal = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
  const s = (appData.students || []).find((st) => st.id === studentId || st.nis === studentId);
  if (s) {
    if (field === 'formatif') s.scoreFormatif = numVal;
    if (field === 'sts') s.scoreSts = numVal;
    if (field === 'sas') s.scoreSas = numVal;

    saveStorage();
    if (typeof saveGradeToSupabase === 'function') {
      saveGradeToSupabase(s.id, field.toUpperCase(), numVal, s.classId);
    }
    const selectElem = document.getElementById('nilaiClassSelect');
    renderDaftarNilai(selectElem ? selectElem.value : 'ALL');
  }
}
