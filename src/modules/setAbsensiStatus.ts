import { statusMap } from './renderAbsensiForm';

export function setAbsensiStatus(studentId: string, status: string): void {
  statusMap[studentId] = status;
  const group = document.querySelector(`.btn-group-status[data-student="${studentId}"]`);
  if (!group) return;

  const buttons = group.querySelectorAll('.btn-status');
  buttons.forEach(btn => {
    btn.classList.remove('active-hadir', 'active-izin', 'active-sakit', 'active-alpa');
    if (btn.textContent?.trim() === status) {
      const clsMap: Record<string, string> = {
        'Hadir': 'active-hadir', 'Izin': 'active-izin',
        'Sakit': 'active-sakit', 'Alpa': 'active-alpa'
      };
      btn.classList.add(clsMap[status]);
    }
  });
}
