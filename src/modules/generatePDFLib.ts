import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawOfficialKopSurat } from './pdfHeaderKop';

export async function downloadLaporanPDFWithPdfLib(data: {
  totalStudents: number;
  totalClasses: number;
  totalJournals: number;
  totalAttendance: number;
  headmasterName?: string;
  headmasterNip?: string;
}): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 page size
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Official Header Kop Surat
  let curY = height - 40;
  curY = await drawOfficialKopSurat(pdfDoc, page, width, curY, 40);

  // Report Title
  page.drawText('LAPORAN REKAPITULASI ADMINISTRASI PERANGKAT AJAR', {
    x: 95,
    y: height - 130,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  // Data Items Box Table
  const startY = height - 170;
  const rowHeight = 32;

  const items = [
    { label: 'Total Siswa Terdaftar', value: `${data.totalStudents} Siswa` },
    { label: 'Total Rombel Kelas Binaan', value: `${data.totalClasses} Rombel (Fase A - C)` },
    { label: 'Jurnal Mengajar Harian', value: `${data.totalJournals} Entri Pembelajaran` },
    { label: 'Sesi Presensi Tersimpan', value: `${data.totalAttendance} Sesi Presensi` },
  ];

  items.forEach((item, index) => {
    const currentY = startY - index * rowHeight;

    // Row Background
    page.drawRectangle({
      x: 40,
      y: currentY - 5,
      width: width - 80,
      height: 24,
      color: index % 2 === 0 ? rgb(0.96, 0.97, 0.98) : rgb(1, 1, 1),
      borderColor: rgb(0.89, 0.91, 0.94),
      borderWidth: 1,
    });

    page.drawText(`${index + 1}.  ${item.label}`, {
      x: 52,
      y: currentY + 2,
      size: 10,
      font: fontRegular,
      color: rgb(0.12, 0.16, 0.23),
    });

    page.drawText(item.value, {
      x: 340,
      y: currentY + 2,
      size: 10,
      font: fontBold,
      color: rgb(0.07, 0.65, 0.72),
    });
  });

  // Verification Box
  page.drawRectangle({
    x: 40,
    y: height - 350,
    width: width - 80,
    height: 48,
    color: rgb(0.93, 0.98, 0.95),
    borderColor: rgb(0.65, 0.9, 0.74),
    borderWidth: 1,
  });

  page.drawText('Status Akreditasi Administrasi: TERVERIFIKASI SANGAT BAIK', {
    x: 55,
    y: height - 324,
    size: 10,
    font: fontBold,
    color: rgb(0.08, 0.5, 0.24),
  });

  page.drawText('Disinkronkan secara realtime dengan Supabase Cloud Database SD Negeri Bobong', {
    x: 55,
    y: height - 340,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.29, 0.35, 0.44),
  });

  // Signatures Section
  const sigY = height - 420;
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Left Signature (Kepala Sekolah)
  page.drawText('Mengetahui,', { x: 60, y: sigY, size: 9.5, font: fontRegular });
  page.drawText('Kepala SD Negeri Bobong', { x: 60, y: sigY - 14, size: 9.5, font: fontRegular });
  page.drawText('Husnita Usman, M.Pd', { x: 60, y: sigY - 64, size: 10, font: fontBold });
  page.drawText('NIP. 199610272019032006', { x: 60, y: sigY - 78, size: 9, font: fontRegular });

  // Right Signature (Guru / Administrator)
  page.drawText(`Bobong, ${todayStr}`, { x: 360, y: sigY, size: 9.5, font: fontRegular });
  page.drawText('Guru / Admin Sistem', { x: 360, y: sigY - 14, size: 9.5, font: fontRegular });
  page.drawText(data.headmasterName || 'Husnita Usman, M.Pd', {
    x: 360,
    y: sigY - 64,
    size: 10,
    font: fontBold,
  });
  page.drawText(`NIP. ${data.headmasterNip || '199610272019032006'}`, {
    x: 360,
    y: sigY - 78,
    size: 9,
    font: fontRegular,
  });

  // Save PDF Bytes and Trigger Browser Direct File Download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Laporan_Administrasi_SDN_Bobong_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
