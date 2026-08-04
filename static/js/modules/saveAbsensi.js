import { appData, getSupabase } from '../helpers.js';
import { statusMap } from './renderAbsensiForm.js';
import { loadAbsensiHistory } from './loadAbsensiHistory.js';
export async function saveAbsensi() {
    const classId = document.getElementById('absensiClassSelect')?.value;
    const date = document.getElementById('absensiDate')?.value;
    if (!classId || !date) {
        alert('Pilih kelas dan tanggal terlebih dahulu!');
        return;
    }
    const students = (appData.students || []).filter((s) => s.classId === classId);
    if (students.length === 0) {
        alert('Tidak ada siswa di kelas ini.');
        return;
    }
    const rows = students.map((s) => ({
        date,
        class_id: classId,
        student_id: s.id,
        status: statusMap[s.id] || 'Hadir'
    }));
    try {
        await fetch(`/api/attendance?date=${encodeURIComponent(date)}&class_id=${encodeURIComponent(classId)}`, {
            method: 'DELETE'
        });
        const res = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rows)
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error);
        alert(`✅ Presensi ${classId} tanggal ${date} berhasil disimpan (${rows.length} siswa).`);
        loadAbsensiHistory();
    }
    catch (err) {
        console.error('[Absensi Save Error]', err);
        alert('Gagal menyimpan presensi: ' + (err.message || err));
    }
}
