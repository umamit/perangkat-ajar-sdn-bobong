import { statusMap } from './statusMap.js';

export function setAbsensiStatus(studentId, status) {
  // Toggle status: jika status yang diklik sudah aktif, batalkan pilihan (jadikan '')
  if (statusMap[studentId] === status) {
    statusMap[studentId] = '';
  } else {
    statusMap[studentId] = status;
  }

  const tr = document.querySelector(`tr[data-student="${studentId}"]`);
  if (!tr) return;

  const currentStatus = statusMap[studentId];
  const buttons = tr.querySelectorAll('.btn-status');
  buttons.forEach(btn => {
    btn.classList.remove('active-hadir', 'active-izin', 'active-sakit', 'active-alpa');
    if (currentStatus && btn.textContent?.trim() === currentStatus) {
      const clsMap = {
        'Hadir': 'active-hadir',
        'Izin': 'active-izin',
        'Sakit': 'active-sakit',
        'Alpa': 'active-alpa'
      };
      btn.classList.add(clsMap[currentStatus]);
    }
  });
}
