import { showToast } from './showToast';
import { appData, getSupabase } from '../helpers';
import { statusMap } from './statusMap';
import { loadAbsensiHistory } from './loadAbsensiHistory';

export async function saveAbsensi(): Promise<void> {
  const classId = (document.getElementById('absensiClassSelect') as HTMLSelectElement)?.value;
  const date = (document.getElementById('absensiDate') as HTMLInputElement)?.value;

  if (!classId || !date) {
    showToast('Pilih kelas dan tanggal terlebih dahulu!', 'info');
    return;
  }

  const students = (appData.students || []).filter((s: any) => s.classId === classId);
  if (students.length === 0) {
    showToast('Tidak ada siswa di kelas ini.', 'error');
    return;
  }

  const client = getSupabase();
  if (!client) {
    showToast('Koneksi Supabase tidak tersedia.', 'info');
    return;
  }

  const rows = students.map((s: any) => ({
    date,
    class_id:     classId,
    student_id:   s.id,
    student_name: s.name,
    status:       statusMap[s.id] || 'Hadir'
  }));

  try {
    await client.from('attendance').delete().eq('date', date).eq('class_id', classId);
    const { error } = await client.from('attendance').insert(rows);
    if (error) throw error;

    showToast(`Presensi ${classId} tanggal ${date} berhasil disimpan (${rows.length} siswa).`, 'success');
    loadAbsensiHistory();
  } catch (err: any) {
    console.error('[Absensi Save Error]', err);
    alert('Gagal menyimpan presensi: ' + (err.message || err));
  }
}
