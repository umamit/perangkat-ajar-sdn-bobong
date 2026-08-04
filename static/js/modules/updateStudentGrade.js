import { appData, saveStorage, saveStudentToSupabase } from '../helpers.js';
import { renderDaftarNilai } from './renderDaftarNilai.js';
export function updateStudentGrade(studentId, field, value) {
    const numVal = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
    const s = (appData.students || []).find((st) => st.id === studentId || st.nis === studentId);
    if (s) {
        if (field === 'formatif')
            s.scoreFormatif = numVal;
        if (field === 'sts')
            s.scoreSts = numVal;
        if (field === 'sas')
            s.scoreSas = numVal;
        saveStorage();
        
        // Save to Flask API
        const gradeType = field === 'formatif' ? 'Formatif' : 'Sumatif';
        fetch('/api/grades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: s.id,
                classId: s.classId,
                type: gradeType,
                score: numVal,
                topic: 'Bahasa Inggris'
            })
        }).catch(err => console.error('[Save Grade Error]', err));

        const selectElem = document.getElementById('nilaiClassSelect');
        renderDaftarNilai(selectElem ? selectElem.value : 'ALL');
    }
}
