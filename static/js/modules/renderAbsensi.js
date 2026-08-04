import { getTeacherClasses } from './getTeacherClasses.js';
import { loadAbsensiHistory } from './loadAbsensiHistory.js';
export function renderAbsensi() {
    const container = document.getElementById('absensiClassSelect');
    if (container) {
        const teacherClasses = getTeacherClasses();
        container.innerHTML = teacherClasses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    const dateInput = document.getElementById('absensiDate');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    loadAbsensiHistory();
}
