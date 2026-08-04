import { syncFromSupabase } from '../helpers.js';
import { showToast } from './showToast.js';

export async function handleManualSync(btnEl) {
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
