import { appData, saveStorage } from '../helpers';
import { renderModulAjar } from './modulAjarView';
import { showToast } from './showToast';

export function deleteModul(id: string): void {
  const modul = (appData.modules || []).find((m: any) => m.id === id);
  const title = modul ? modul.title : 'ini';

  if (!confirm(`Apakah Anda yakin ingin menghapus modul ajar: "${title}"?`)) {
    return;
  }

  appData.modules = (appData.modules || []).filter((m: any) => m.id !== id);
  saveStorage();

  renderModulAjar();
  showToast(`Modul ajar "${title}" berhasil dihapus.`, 'info');
}
