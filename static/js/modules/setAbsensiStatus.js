import { statusMap } from './statusMap.js';

export function setAbsensiStatus(studentId, status) {
  statusMap[studentId] = status;
  const tr = document.querySelector(`tr[data-student="${studentId}"]`);
  if (!tr) return;

  const buttons = tr.querySelectorAll('.btn-status');
  buttons.forEach(btn => {
    btn.classList.remove('active-hadir', 'active-izin', 'active-sakit', 'active-alpa');
    if (btn.textContent?.trim() === status) {
      const clsMap = {
        'Hadir': 'active-hadir',
        'Izin': 'active-izin',
        'Sakit': 'active-sakit',
        'Alpa': 'active-alpa'
      };
      btn.classList.add(clsMap[status]);
    }
  });
}
