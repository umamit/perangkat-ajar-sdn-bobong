import { appData, saveStorage, saveJournalToSupabase } from '../helpers';
import { closeModal } from './closeModal';
import { renderModulAjar } from './modulAjarView';

export function saveModul(e: Event): void {
  e.preventDefault();
  const title = (document.getElementById('modulTitle') as HTMLInputElement).value.trim();
  const grade = (document.getElementById('modulGrade') as HTMLSelectElement).value;
  const duration = (document.getElementById('modulDuration') as HTMLInputElement).value.trim();
  const target = (document.getElementById('modulTarget') as HTMLTextAreaElement).value.trim();
  const cp = (document.getElementById('modulCP') as HTMLTextAreaElement).value.trim();

  const newModul: any = {
    id: `MOD-0${(appData.modules || []).length + 1}`,
    title,
    grade,
    phase: 'Fase A',
    duration,
    target,
    tp: target,
    atp: target,
    cp,
    materials: ['Buku Teks', 'PPT'],
    steps: ['Kegiatan Pembuka (10 menit)', 'Kegiatan Inti (50 menit)', 'Penutup (10 menit)'],
    assessment: 'Formatif & Sumatif'
  };

  appData.modules.unshift(newModul);
  saveStorage();
  renderModulAjar();
  closeModal();
  alert(`✅ Modul Ajar "${title}" berhasil ditambahkan!`);
}
