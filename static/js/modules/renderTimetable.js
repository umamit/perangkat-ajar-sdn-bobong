import { appData } from '../helpers.js';
export function renderTimetable() {
    const tbody = document.getElementById('timetableBody');
    if (!tbody)
        return;
    tbody.innerHTML = appData.timetable.map(t => `
    <tr>
      <td><strong>${t.day}</strong></td>
      <td>${t.time}</td>
      <td><span class="badge badge-info">${t.classId}</span></td>
      <td>${t.topic}</td>
    </tr>
  `).join('');
}
