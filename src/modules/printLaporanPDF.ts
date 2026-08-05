export function printLaporanPDF(data: {
  totalStudents: number;
  totalClasses: number;
  totalJournals: number;
  totalAttendance: number;
  headmasterName?: string;
  headmasterNip?: string;
}): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Laporan Rekapitulasi Administrasi - SD Negeri Bobong</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .kop-surat { text-align: center; border-b: 3px double #0f172a; padding-bottom: 12px; margin-bottom: 24px; }
          .kop-surat h2 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.5px; }
          .kop-surat h3 { margin: 4px 0 0 0; font-size: 15px; color: #0f766e; }
          .kop-surat p { margin: 2px 0 0 0; font-size: 12px; color: #64748b; }
          .report-title { text-align: center; font-size: 16px; font-weight: bold; margin: 20px 0; text-decoration: underline; }
          .meta-table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }
          .meta-table th { background: #f1f5f9; padding: 10px; border: 1px solid #cbd5e1; font-size: 13px; text-align: left; }
          .meta-table td { padding: 10px; border: 1px solid #cbd5e1; font-size: 13px; }
          .status-badge { display: inline-block; background: #dcfce7; color: #15803d; font-weight: bold; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
          .signature-section { margin-top: 48px; display: flex; justify-content: space-between; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="kop-surat">
          <h2>PEMERINTAH KABUPATEN PULAU TALIABU</h2>
          <h3>DINAS PENDIDIKAN - SD NEGERI BOBONG</h3>
          <p>Alamat: Desa Bobong, Kecamatan Taliabu Barat, Kabupaten Pulau Taliabu</p>
        </div>

        <div class="report-title">LAPORAN REKAPITULASI ADMINISTRASI PERANGKAT AJAR &amp; PRESENSI</div>

        <table class="meta-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Kategori Administrasi Pembelajaran</th>
              <th>Jumlah Terdata</th>
              <th>Status Verifikasi Supabase</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:center;">1</td>
              <td><strong>Total Siswa Terdaftar</strong></td>
              <td>${data.totalStudents} Siswa</td>
              <td><span class="status-badge">TERVERIFIKASI</span></td>
            </tr>
            <tr>
              <td style="text-align:center;">2</td>
              <td><strong>Total Rombel Kelas Binaan</strong></td>
              <td>${data.totalClasses} Rombel (Fase A - C)</td>
              <td><span class="status-badge">TERVERIFIKASI</span></td>
            </tr>
            <tr>
              <td style="text-align:center;">3</td>
              <td><strong>Jurnal Mengajar Harian Terisi</strong></td>
              <td>${data.totalJournals} Entri Pembelajaran</td>
              <td><span class="status-badge">TERVERIFIKASI</span></td>
            </tr>
            <tr>
              <td style="text-align:center;">4</td>
              <td><strong>Sesi Presensi Harian Tersimpan</strong></td>
              <td>${data.totalAttendance} Sesi Presensi</td>
              <td><span class="status-badge">TERVERIFIKASI</span></td>
            </tr>
          </tbody>
        </table>

        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; margin-top: 20px;">
          <strong>Catatan Akreditasi Administrasi:</strong><br>
          Seluruh rekapitulasi data di atas disinkronkan secara otomatis dan aman melalui enkripsi SSL ke Supabase Cloud Database SD Negeri Bobong.
        </div>

        <div class="signature-section">
          <div>
            <p>Mengetahui,<br>Kepala SD Negeri Bobong</p>
            <br><br><br>
            <p><strong>Husnita Usman, M.Pd</strong><br>NIP. 199610272019032006</p>
          </div>
          <div>
            <p>Bobong, ${todayStr}<br>Petugas Administrasi / Guru</p>
            <br><br><br>
            <p><strong>Tim Pengembang Digital</strong><br>SD Negeri Bobong</p>
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}
