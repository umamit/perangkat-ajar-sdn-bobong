import { appData } from '../helpers.js';
export function printModule(moduleId) {
    const mod = appData.modules.find(m => m.id === moduleId);
    if (!mod)
        return;
    const printWindow = window.open('', '_blank');
    if (!printWindow)
        return;
    printWindow.document.write(`
    <html>
      <head>
        <title>Modul Ajar - ${mod.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .meta-table td { padding: 6px 10px; border: 1px solid #ccc; font-size: 13px; }
          .section-title { background: #f1f5f9; padding: 6px 10px; font-weight: bold; border-left: 4px solid #0f766e; margin-top: 18px; font-size: 14px; }
          ol, ul { margin-top: 6px; padding-left: 20px; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin:0; font-size:18px;">MODUL AJAR KURIKULUM MERDEKA</h2>
          <h3 style="margin:4px 0 0 0; font-size:15px;">SD NEGERI BOBONG - KABUPATEN PULAU TALIABU</h3>
          <p style="margin:2px 0 0 0; font-size:12px; color:#555;">Tahun Ajaran 2025/2026</p>
        </div>

        <table class="meta-table">
          <tr>
            <td style="width:30%; font-weight:bold;">Mata Pelajaran</td>
            <td>${appData.teacher?.subject || 'Bahasa Inggris'}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Fase / Kelas</td>
            <td>${mod.phase || 'Fase A'} / ${mod.grade}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Judul Modul</td>
            <td>${mod.title}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Alokasi Waktu</td>
            <td>${mod.duration}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Nama Guru Pengampu</td>
            <td>${appData.teacher?.name || 'Guru Bahasa Inggris'} (NIP: ${appData.teacher?.nip || '-'})</td>
          </tr>
        </table>

        <div class="section-title">A. CAPAIAN PEMBELAJARAN (CP)</div>
        <p style="font-size:13px; margin:6px 0;">${mod.cp}</p>

        <div class="section-title">B. TUJUAN PEMBELAJARAN (TP)</div>
        <p style="font-size:13px; margin:6px 0;">${mod.target}</p>

        <div class="section-title">C. LANGKAH-LANGKAH PEMBELAJARAN</div>
        <ol>
          ${(mod.steps || []).map(s => `<li style="margin-bottom:4px;">${s}</li>`).join('')}
        </ol>

        <div class="section-title">D. ASESMEN / PENILAIAN</div>
        <p style="font-size:13px; margin:6px 0;">${mod.assessment || 'Formatif & Sumatif'}</p>

        <div style="margin-top:40px; display:flex; justify-content:space-between; text-align:center; font-size:12px;">
          <div>
            <p>Mengetahui,<br>Kepala SD Negeri Bobong</p>
            <br><br><br>
            <p><strong>Kepala Sekolah SDN Bobong</strong><br>NIP. 197508201999031002</p>
          </div>
          <div>
            <p>Bobong, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>Guru Mata Pelajaran</p>
            <br><br><br>
            <p><strong>${appData.teacher?.name || 'Guru Bahasa Inggris'}</strong><br>NIP. ${appData.teacher?.nip || '-'}</p>
          </div>
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
}
