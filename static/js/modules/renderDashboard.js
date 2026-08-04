import { appData } from '../helpers.js';
export function renderDashboard() {
    const totalStudents = appData.students.length;
    const totalClasses = appData.classes.length;
    const totalModules = appData.modules.length;
    const totalJournals = appData.journals.length;
    if (document.getElementById('statTotalStudents'))
        document.getElementById('statTotalStudents').innerText = String(totalStudents);
    if (document.getElementById('statTotalClasses'))
        document.getElementById('statTotalClasses').innerText = String(totalClasses);
    if (document.getElementById('statTotalModules'))
        document.getElementById('statTotalModules').innerText = String(totalModules);
    if (document.getElementById('statTotalJournals'))
        document.getElementById('statTotalJournals').innerText = String(totalJournals);
    const tbody = document.getElementById('recentJournalsBody');
    if (tbody) {
        tbody.innerHTML = appData.journals.slice(0, 3).map(j => `
      <tr>
        <td>${j.date}</td>
        <td><span class="badge badge-info">${j.classId}</span></td>
        <td><strong>${j.topic}</strong></td>
        <td>${j.notes}</td>
        <td><span class="badge badge-success">Selesai</span></td>
      </tr>
    `).join('');
    }
}
