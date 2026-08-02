import { appData } from '../helpers';

export function printWorksheet(moduleId: string): void {
  const mod = appData.modules.find(m => m.id === moduleId);
  if (!mod) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>LKPD Siswa - ${mod.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #111; line-height:1.5; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom:20px; }
          .student-box { border: 1px solid #000; padding: 10px; margin-bottom: 20px; font-size:14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin:0;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
          <h3 style="margin:5px 0 0 0;">SD NEGERI BOBONG - KABUPATEN PULAU TALIABU</h3>
          <p style="margin:2px 0 0 0; font-size:13px;">Mata Pelajaran: ${appData.teacher?.subject || 'Bahasa Inggris'} | ${mod.grade} (${mod.phase})</p>
        </div>
        <div class="student-box">
          <p style="margin:0;">Nama Siswa: ___________________________</p>
          <p style="margin:5px 0 0 0;">Kelas / Nomor Absen: ___________________</p>
        </div>
        <h4>Topik: ${mod.title}</h4>
        <p><strong>Tujuan Pembelajaran:</strong> ${mod.target}</p>
        <div style="border: 1px dashed #666; padding: 15px; margin-top: 15px;">
          <p style="margin:0; font-weight:bold;">Instruksi Tugas:</p>
          <p style="margin-top:5px;">${mod.cp}</p>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
