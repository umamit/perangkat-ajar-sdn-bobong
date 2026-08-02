import { appData } from '../helpers';
import { getTeacherClasses } from './getTeacherClasses';

export function renderTugas(): void {
  const container = document.getElementById('tugasGrid');
  if (!container) return;

  const availClassIds = getTeacherClasses().map(c => c.id);
  const tasksList = (appData.tasks || []).filter(t => availClassIds.includes(t.classId));

  if (tasksList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:32px; background:#fff; border-radius:12px; border:1px dashed #cbd5e1; color:var(--text-muted);">
        <i class="ri-task-line" style="font-size:32px; display:block; margin-bottom:8px; opacity:0.4;"></i>
        Belum ada penugasan aktif untuk kelas terampu.
      </div>
    `;
    return;
  }

  container.innerHTML = tasksList.map(t => `
    <div class="card" style="padding:20px; border-left:4px solid var(--primary);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="badge badge-info">${t.type || 'Formatif'}</span>
        <span class="badge badge-success">${t.status || 'Aktif'}</span>
      </div>
      <h3 style="font-size:16px; margin-bottom:6px; color:#1e293b;">${t.title}</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">
        <i class="ri-community-line"></i> Kelas: ${t.classId} | <i class="ri-calendar-event-line"></i> Tenggat: ${t.dueDate}
      </p>
      <p style="font-size:13.5px; color:#334155; background:#f8fafc; padding:10px; border-radius:6px; line-height:1.5;">${t.description}</p>
    </div>
  `).join('');
}
