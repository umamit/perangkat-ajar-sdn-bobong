import { appData, getSupabase } from '../helpers';

export async function loadAbsensiHistory(): Promise<void> {
  const tbody = document.getElementById('absensiTableBody');
  if (!tbody) return;

  const client = getSupabase();
  if (!client) return;

  try {
    const { data, error } = await client
      .from('attendance')
      .select('date, class_id, status')
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:24px; font-size:13px;">
          <i class="ri-inbox-line" style="font-size:24px; display:block; margin-bottom:6px; opacity:0.4;"></i>
          Belum ada riwayat presensi tersimpan
        </td></tr>`;
      return;
    }

    const grouped: Record<string, any> = {};
    data.forEach((r: any) => {
      const key = `${r.date}_${r.class_id}`;
      if (!grouped[key]) {
        grouped[key] = { date: r.date, classId: r.class_id, Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0 };
      }
      grouped[key][r.status] = (grouped[key][r.status] || 0) + 1;
    });

    const rows = Object.values(grouped);
    tbody.innerHTML = rows.map((r: any) => {
      const total = r.Hadir + r.Izin + r.Sakit + r.Alpa;
      return `
        <tr>
          <td><strong>${r.date}</strong></td>
          <td><span class="badge badge-info">${r.classId}</span></td>
          <td style="text-align:center;"><span class="badge badge-success">${r.Hadir}</span></td>
          <td style="text-align:center;"><span class="badge badge-warning">${r.Izin}</span></td>
          <td style="text-align:center;"><span class="badge" style="background:#fff7ed;color:#ea580c;">${r.Sakit}</span></td>
          <td style="text-align:center;"><span class="badge badge-danger">${r.Alpa}</span></td>
          <td style="text-align:center; font-weight:700;">${total}</td>
        </tr>`;
    }).join('');

    appData.attendance = rows.map((r: any) => ({
      date: r.date, classId: r.classId,
      hadir: r.Hadir, izin: r.Izin, sakit: r.Sakit, alpa: r.Alpa
    }));
  } catch (err) {
    console.warn('[Absensi History Error]', err);
  }
}
