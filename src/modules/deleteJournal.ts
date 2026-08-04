import { appData, saveStorage, getSupabase } from '../helpers';
import { renderJurnal } from './renderJurnal';

export async function deleteJournal(id: string): Promise<void> {
  const journal = (appData.journals || []).find((j: any) => j.id === id);
  const topic = journal ? journal.topic : 'ini';

  if (!confirm(`Apakah Anda yakin ingin menghapus jurnal mengajar: "${topic}"?`)) {
    return;
  }

  appData.journals = (appData.journals || []).filter((j: any) => j.id !== id);
  saveStorage();

  const client = getSupabase();
  if (client) {
    try {
      await client.from('journals').delete().eq('id', id);
    } catch (err) {
      console.warn('[Supabase Journal Delete Exception]', err);
    }
  }

  renderJurnal();
  alert(`✅ Jurnal mengajar "${topic}" berhasil dihapus.`);
}
