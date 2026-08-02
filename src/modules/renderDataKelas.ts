import { appData } from '../helpers';
import { getTeacherClasses } from './getTeacherClasses';

export function renderDataKelas(): void {
  const grid = document.getElementById('kelasGrid');
  if (!grid) return;
  const targetClasses = getTeacherClasses();
  grid.innerHTML = targetClasses.map(c => {
    delete c.count;
    const realStudents = (appData.students || []).filter(s => s.classId === c.id);
    const studentCount = realStudents.length;
    return `
    <div class="card" style="padding: 20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span class="badge badge-info">${c.phase}</span>
        <i class="ri-building-line" style="font-size:24px; color:var(--primary);"></i>
      </div>
      <h3 style="margin-bottom:6px; font-size:18px;">${c.name}</h3>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:12px;">${c.room}</p>
      <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; border-top:1px solid #e2e8f0; padding-top:10px;">
        <span>Siswa Terdaftar:</span>
        <span style="color:${studentCount > 0 ? 'var(--primary)' : '#94a3b8'}; font-weight:800;">${studentCount} Orang</span>
      </div>
    </div>
    `;
  }).join('');
}
