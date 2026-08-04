import { syncFromSupabase } from '../helpers';
import { showToast } from './showToast';

export async function handleManualSync(btnEl?: HTMLElement): Promise<void> {
  const icon = btnEl ? btnEl.querySelector('i') : document.getElementById('syncBtnIcon');
  if (icon) icon.classList.add('ri-spin');
  try {
    await syncFromSupabase();
    showToast('Data berhasil disinkronkan dari Supabase Cloud!', 'success');
  } catch (e) {
    showToast('Gagal menyinkronkan data dari Supabase Cloud', 'error');
  } finally {
    if (icon) icon.classList.remove('ri-spin');
  }
}
