import { appData, getSupabase } from '../helpers';

// Isi dropdown kelas & set tanggal hari ini saat init
export function renderAbsensi(): void {
  const select = document.getElementById('absensiClassSelect') as HTMLSelectElement | null;
  const dateInput = document.getElementById('absensiDateInput') as HTMLInputElement | null;

  if (select && select.options.length <= 1) {
    const classes = appData.classes || [];
    classes.forEach((c: any) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
  }

  // Set tanggal default = hari ini
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Load riwayat dari Supabase
  loadAbsensiHistory();
}

// Render tabel input siswa sesuai kelas & tanggal yang dipilih
export function renderAbsensiForm(): void {
  const classId = (document.getElementById('absensiClassSelect') as HTMLSelectElement)?.value;
  const date = (document.getElementById('absensiDateInput') as HTMLInputElement)?.value;
  const container = document.getElementById('absensiFormContainer');
  const placeholder = document.getElementById('absensiFormPlaceholder');
  const tbody = document.getElementById('absensiInputBody');

  if (!classId || !date || !tbody || !container || !placeholder) return;

  const students = (appData.students || []).filter((s: any) => s.classId === classId);

  if (students.length === 0) {
    placeholder.style.display = 'block';
    container.style.display = 'none';
    placeholder.innerHTML = `
      <i class="ri-user-unfollow-line" style="font-size:32px; display:block; margin-bottom:8px; opacity:0.4;"></i>
      <p style="font-size:13px;">Tidak ada siswa di kelas <strong>${classId}</strong></p>`;
    return;
  }

  placeholder.style.display = 'none';
  container.style.display = 'block';

  tbody.innerHTML = students.map((s: any, i: number) => `
    <tr id="absensi-row-${s.nis || s.id}">
      <td style="text-align:center; font-weight:600; color:var(--text-muted);">${i + 1}</td>
      <td><strong>${s.name}</strong></td>
      ${['Hadir','Izin','Sakit','Alpa'].map(status => `
        <td style="text-align:center;">
          <button
            id="btn-${status}-${s.nis || s.id}"
            onclick="setAbsensiStatus('${s.nis || s.id}', '${status}')"
            style="width:62px; padding:5px 0; border-radius:20px; font-size:11.5px; font-weight:600; border:2px solid ${
              status==='Hadir' ? 'var(--accent)' :
              status==='Izin'  ? 'var(--secondary)' :
              status==='Sakit' ? '#f97316' : '#dc2626'
            }; background:${status === 'Hadir' ? 'rgba(42,157,92,0.12)' : 'transparent'}; color:${
              status==='Hadir' ? 'var(--accent)' :
              status==='Izin'  ? '#b45309' :
              status==='Sakit' ? '#ea580c' : '#dc2626'
            }; cursor:pointer; transition:all 0.15s;">
            ${status}
          </button>
        </td>`).join('')}
    </tr>
  `).join('');

  // Simpan state status per siswa (default semua Hadir)
  (window as any)._absensiStatus = {};
  students.forEach((s: any) => {
    (window as any)._absensiStatus[s.nis || s.id] = 'Hadir';
  });
}

// Set status individual siswa & update tampilan tombol
export function setAbsensiStatus(studentId: string, status: string): void {
  if (!(window as any)._absensiStatus) (window as any)._absensiStatus = {};
  (window as any)._absensiStatus[studentId] = status;

  ['Hadir','Izin','Sakit','Alpa'].forEach(s => {
    const btn = document.getElementById(`btn-${s}-${studentId}`) as HTMLButtonElement | null;
    if (!btn) return;
    const isActive = s === status;
    const colors: Record<string,string> = {
      Hadir: 'rgba(42,157,92,0.15)',
      Izin:  'rgba(229,169,0,0.15)',
      Sakit: 'rgba(249,115,22,0.15)',
      Alpa:  'rgba(220,38,38,0.15)'
    };
    btn.style.background = isActive ? colors[s] : 'transparent';
    btn.style.transform  = isActive ? 'scale(1.08)' : 'scale(1)';
  });
}

// Simpan absensi ke Supabase
export async function saveAbsensi(): Promise<void> {
  const classId   = (document.getElementById('absensiClassSelect') as HTMLSelectElement)?.value;
  const date      = (document.getElementById('absensiDateInput') as HTMLInputElement)?.value;
  const statusMap = (window as any)._absensiStatus || {};

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
    // Hapus data lama untuk kelas & tanggal yang sama, lalu insert baru
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

// Load & tampilkan riwayat rekap dari Supabase
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

    // Agregasi per tanggal + kelas
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

    // Update appData.attendance untuk komponen lain
    appData.attendance = rows.map((r: any) => ({
      date: r.date, classId: r.classId,
      hadir: r.Hadir, izin: r.Izin, sakit: r.Sakit, alpa: r.Alpa
    }));
  } catch (err) {
    console.warn('[Absensi History Error]', err);
  }
}
