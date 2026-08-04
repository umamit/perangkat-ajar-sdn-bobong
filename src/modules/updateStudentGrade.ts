import { appData, saveStorage, saveGradeToSupabase } from '../helpers';
import { renderDaftarNilai } from './renderDaftarNilai';

export function updateStudentGrade(studentId: string, field: 'formatif' | 'sts' | 'sas', value: string): void {
  const numVal = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
  const s: any = (appData.students || []).find((st: any) => st.id === studentId || st.nis === studentId);
  if (s) {
    if (field === 'formatif') s.scoreFormatif = numVal;
    if (field === 'sts') s.scoreSts = numVal;
    if (field === 'sas') s.scoreSas = numVal;

    saveStorage();
    saveGradeToSupabase(s.id, field.toUpperCase(), numVal, s.classId);
    const selectElem = document.getElementById('nilaiClassSelect') as HTMLSelectElement | null;
    renderDaftarNilai(selectElem ? selectElem.value : 'ALL');
  }
}
