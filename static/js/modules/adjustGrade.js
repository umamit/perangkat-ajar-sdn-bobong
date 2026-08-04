import { appData } from '../helpers.js';
import { updateStudentGrade } from './updateStudentGrade.js';
export function adjustGrade(studentId, field, delta) {
    const s = (appData.students || []).find((st) => (st.nis || st.id) === studentId);
    if (!s)
        return;
    const currentKey = field === 'formatif' ? 'scoreFormatif' : field === 'sts' ? 'scoreSts' : 'scoreSas';
    const currentVal = s[currentKey] ?? 80;
    const newVal = Math.min(100, Math.max(0, currentVal + delta));
    updateStudentGrade(studentId, field, newVal.toString());
}
