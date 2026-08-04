import { appData } from '../helpers';
import { updateStudentGrade } from './updateStudentGrade';

export function adjustGrade(studentId: string, field: 'formatif' | 'sts' | 'sas', delta: number): void {
  const s = (appData.students || []).find((st: any) => (st.nis || st.id) === studentId);
  if (!s) return;

  const currentKey = field === 'formatif' ? 'scoreFormatif' : field === 'sts' ? 'scoreSts' : 'scoreSas';
  const currentVal = (s as any)[currentKey] ?? 0;
  const newVal = Math.min(100, Math.max(0, currentVal + delta));

  updateStudentGrade(studentId, field, newVal.toString());
}
