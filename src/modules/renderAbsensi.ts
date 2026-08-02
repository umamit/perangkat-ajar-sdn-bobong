import { appData } from '../helpers';
import { getTeacherClasses } from './getTeacherClasses';
import { loadAbsensiHistory } from './loadAbsensiHistory';

export function renderAbsensi(): void {
  const container = document.getElementById('absensiClassSelect') as HTMLSelectElement | null;
  if (container) {
    const teacherClasses = getTeacherClasses();
    container.innerHTML = teacherClasses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  const dateInput = document.getElementById('absensiDate') as HTMLInputElement | null;
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  loadAbsensiHistory();
}
