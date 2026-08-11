import { showToast } from './showToast';
import { appData, saveStorage } from '../helpers';
import { saveModuleToSupabase } from '@/lib/supabase';
import { closeModal } from './closeModal';
import { renderModulAjar } from './modulAjarView';

export async function saveModul(e: Event): Promise<void> {
  e.preventDefault();
  const title = (document.getElementById('modulTitle') as HTMLInputElement).value.trim();
  const grade = (document.getElementById('modulGrade') as HTMLSelectElement).value;
  const duration = (document.getElementById('modulDuration') as HTMLInputElement).value.trim();
  const target = (document.getElementById('modulTarget') as HTMLTextAreaElement).value.trim();
  const cp = (document.getElementById('modulCP') as HTMLTextAreaElement).value.trim();

  const newModul: any = {
    id: crypto.randomUUID(),
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
  await saveModuleToSupabase(newModul);
  renderModulAjar();
  closeModal();
  showToast(`Modul Ajar "${title}" berhasil ditambahkan & tersimpan ke Supabase!`, 'success');
}
