import { appData, getSupabase } from '../helpers';
import { statusMap } from './renderAbsensiForm';
import { loadAbsensiHistory } from './loadAbsensiHistory';

export async function saveAbsensi(): Promise<void> {
  const classId = (document.getElementById('absensiClassSelect') as HTMLSelectElement)?.value;
  const date = (document.getElementById('absensiDate') as HTMLInputElement)?.value;

  if (!classId || !date) {
    alert('Pilih kelas dan tanggal terlebih dahulu!');
    return;
  }

  const students = (appData.students || []).filter((s: any) => s.classId === classId);
  if (students.length === 0) {
    alert('Tidak ada siswa di kelas ini.');
    return;
  }

  const client = getSupabase();
  if (!client) {
    alert('Koneksi Supabase tidak tersedia.');
    return;
  }

  const rows = students.map((s: any) => ({
    date,
    class_id:     classId,
    student_id:   s.nis || s.id,
    student_name: s.name,
    status:       statusMap[s.nis || s.id] || 'Hadir'
  }));

  try {
    await client.from('attendance').delete().eq('date', date).eq('class_id', classId);
    const { error } = await client.from('attendance').insert(rows);
    if (error) throw error;

    alert(`✅ Presensi ${classId} tanggal ${date} berhasil disimpan (${rows.length} siswa).`);
    loadAbsensiHistory();
  } catch (err: any) {
    console.error('[Absensi Save Error]', err);
    alert('Gagal menyimpan presensi: ' + (err.message || err));
  }
}
