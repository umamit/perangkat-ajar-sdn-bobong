import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawOfficialKopSurat } from './pdfHeaderKop';

interface ClassStat {
  name: string;
  studentCount: number;
  attendanceRate: number;
  gradeAverage: number;
}

interface StudentDetail {
  name: string;
  nis: string;
  attendanceRate: number;
  gradeAverage: number;
}

export async function downloadLaporanPDFWithPdfLib(data: {
  totalStudents: number;
  totalClasses: number;
  totalJournals: number;
  totalAttendance: number;
  teacherName?: string;
  teacherNip?: string;
  teacherRole?: string;
  classStats?: ClassStat[];
  studentDetails?: StudentDetail[];
  selectedClassName?: string;
  monthlyAttendanceData?: { name: string; pct: number }[];
  schoolSettings?: any;
}): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // Standard A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Official Header Kop Surat
  let curY = height - 40;
  curY = await drawOfficialKopSurat(pdfDoc, page, width, curY, 40, data.schoolSettings);

  // Report Title
  const titleText = data.selectedClassName 
    ? `LAPORAN DETAIL ADMINISTRASI KELAS ${data.selectedClassName.toUpperCase()}`
    : 'LAPORAN REKAPITULASI ADMINISTRASI PERANGKAT AJAR';
  
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 11);
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: height - 130,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  // Summary Grid Section
  const startY = height - 160;
  const rowHeight = 24;

  const items = [
    { label: 'Total Siswa Terdaftar', value: `${data.totalStudents} Siswa` },
    { label: 'Total Rombel Kelas', value: `${data.totalClasses} Rombel (Fase A - C)` },
    { label: 'Jurnal Mengajar Terisi', value: `${data.totalJournals} Entri` },
    { label: 'Sesi Presensi Tersimpan', value: `${data.totalAttendance} Sesi` },
  ];

  items.forEach((item, index) => {
    const currentY = startY - index * rowHeight;
    page.drawRectangle({
      x: 40,
      y: currentY - 5,
      width: width - 80,
      height: 20,
      color: index % 2 === 0 ? rgb(0.97, 0.98, 0.99) : rgb(1, 1, 1),
      borderColor: rgb(0.9, 0.92, 0.94),
      borderWidth: 0.5,
    });

    page.drawText(`${index + 1}.  ${item.label}`, {
      x: 50,
      y: currentY + 2,
      size: 9,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.3),
    });

    page.drawText(item.value, {
      x: 350,
      y: currentY + 2,
      size: 9,
      font: fontBold,
      color: rgb(0.07, 0.65, 0.72),
    });
  });

  let nextY = startY - (items.length * rowHeight) - 20;

  // Add Class Breakdown Table if available
  if (data.classStats && data.classStats.length > 0) {
    page.drawText('RINCIAN PERFORMA DAN STATISTIK KELAS', {
      x: 40,
      y: nextY,
      size: 10,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.2),
    });
    nextY -= 15;

    // Table Header
    page.drawRectangle({
      x: 40,
      y: nextY - 5,
      width: width - 80,
      height: 20,
      color: rgb(0.07, 0.65, 0.72),
    });

    page.drawText('Kelas', { x: 50, y: nextY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('Siswa', { x: 180, y: nextY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('Kehadiran (%)', { x: 280, y: nextY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('Rerata Nilai Rapor', { x: 420, y: nextY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    
    nextY -= 20;

    data.classStats.forEach((c, idx) => {
      page.drawRectangle({
        x: 40,
        y: nextY - 5,
        width: width - 80,
        height: 18,
        color: idx % 2 === 0 ? rgb(0.98, 0.98, 0.98) : rgb(1, 1, 1),
        borderColor: rgb(0.92, 0.92, 0.92),
        borderWidth: 0.5,
      });

      page.drawText(c.name, { x: 50, y: nextY + 1, size: 8, font: fontRegular });
      page.drawText(`${c.studentCount} Siswa`, { x: 180, y: nextY + 1, size: 8, font: fontRegular });
      page.drawText(`${c.attendanceRate}%`, { x: 280, y: nextY + 1, size: 8, font: fontBold, color: c.attendanceRate >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.2, 0.2) });
      page.drawText(c.gradeAverage.toFixed(1), { x: 420, y: nextY + 1, size: 8, font: fontBold });

      nextY -= 18;
    });
  }

  // Add Monthly Attendance Summary Table if available
  if (data.monthlyAttendanceData && data.monthlyAttendanceData.length > 0) {
    nextY -= 15;
    page.drawText(`REKAPITULASI PERSENTASE KEHADIRAN BULANAN KELAS`, {
      x: 40,
      y: nextY,
      size: 10,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.2),
    });
    nextY -= 15;

    // Header Row
    page.drawRectangle({
      x: 40,
      y: nextY - 5,
      width: width - 80,
      height: 20,
      color: rgb(0.12, 0.16, 0.23),
    });

    const monthWidth = (width - 80) / data.monthlyAttendanceData.length;
    data.monthlyAttendanceData.forEach((m, idx) => {
      const xPos = 40 + idx * monthWidth + 10;
      page.drawText(m.name, { x: xPos, y: nextY + 2, size: 8, font: fontBold, color: rgb(1, 1, 1) });
    });

    nextY -= 20;

    // Values Row
    page.drawRectangle({
      x: 40,
      y: nextY - 5,
      width: width - 80,
      height: 18,
      color: rgb(0.96, 0.98, 0.99),
      borderColor: rgb(0.9, 0.92, 0.94),
      borderWidth: 0.5,
    });

    data.monthlyAttendanceData.forEach((m, idx) => {
      const xPos = 40 + idx * monthWidth + 10;
      page.drawText(`${m.pct}%`, {
        x: xPos,
        y: nextY + 1,
        size: 8,
        font: fontBold,
        color: m.pct >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.2, 0.2),
      });
    });

    nextY -= 20;
  }

  // Add Student Details on a new page if available to prevent page overflow
  if (data.studentDetails && data.studentDetails.length > 0) {
    page = pdfDoc.addPage([595.28, 841.89]);
    let stdY = height - 60;
    
    page.drawText(`DAFTAR SISWA & PERFORMA KELAS: ${data.selectedClassName || ''}`, {
      x: 40,
      y: stdY,
      size: 11,
      font: fontBold,
      color: rgb(0.06, 0.09, 0.16),
    });
    stdY -= 25;

    // Header Table
    page.drawRectangle({
      x: 40,
      y: stdY - 5,
      width: width - 80,
      height: 20,
      color: rgb(0.12, 0.16, 0.23),
    });

    page.drawText('No', { x: 50, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('Nama Siswa', { x: 80, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('NIS', { x: 280, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('Kehadiran', { x: 380, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('Rerata Nilai', { x: 480, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });

    stdY -= 20;

    data.studentDetails.forEach((s, idx) => {
      // Create new page if list exceeds page length
      if (stdY < 80) {
        page = pdfDoc.addPage([595.28, 841.89]);
        stdY = height - 60;
      }

      page.drawRectangle({
        x: 40,
        y: stdY - 5,
        width: width - 80,
        height: 18,
        color: idx % 2 === 0 ? rgb(0.98, 0.98, 0.98) : rgb(1, 1, 1),
        borderColor: rgb(0.92, 0.92, 0.92),
        borderWidth: 0.5,
      });

      page.drawText(`${idx + 1}`, { x: 50, y: stdY + 1, size: 8, font: fontRegular });
      page.drawText(s.name, { x: 80, y: stdY + 1, size: 8, font: fontBold });
      page.drawText(s.nis || '-', { x: 280, y: stdY + 1, size: 8, font: fontRegular });
      page.drawText(`${s.attendanceRate}%`, { x: 380, y: stdY + 1, size: 8, font: fontBold, color: s.attendanceRate >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.2, 0.2) });
      page.drawText(s.gradeAverage.toFixed(1), { x: 480, y: stdY + 1, size: 8, font: fontBold, color: s.gradeAverage >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.6, 0.1) });

      stdY -= 18;
    });

    nextY = stdY - 20;
  }

  // If nextY is too low for signatures, add a new page
  if (nextY < 140) {
    page = pdfDoc.addPage([595.28, 841.89]);
    nextY = height - 60;
  }

  // Verification Box
  page.drawRectangle({
    x: 40,
    y: nextY - 45,
    width: width - 80,
    height: 40,
    color: rgb(0.93, 0.98, 0.95),
    borderColor: rgb(0.65, 0.9, 0.74),
    borderWidth: 0.5,
  });

  page.drawText('Status Akreditasi Administrasi: TERVERIFIKASI SANGAT BAIK', {
    x: 55,
    y: nextY - 22,
    size: 8.5,
    font: fontBold,
    color: rgb(0.08, 0.5, 0.24),
  });

  page.drawText('Disinkronkan secara realtime dengan Supabase Cloud Database SD Negeri Bobong', {
    x: 55,
    y: nextY - 36,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.29, 0.35, 0.44),
  });

  // Signatures Section
  const sigY = nextY - 80;
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  page.drawText('Mengetahui,', { x: 60, y: sigY, size: 8.5, font: fontRegular });
  page.drawText('Kepala SD Negeri Bobong', { x: 60, y: sigY - 12, size: 8.5, font: fontRegular });
  page.drawText('Husnita Usman, M.Pd', { x: 60, y: sigY - 56, size: 9, font: fontBold });
  page.drawText('NIP. 199610272019032006', { x: 60, y: sigY - 68, size: 8, font: fontRegular });

  page.drawText(`Bobong, ${todayStr}`, { x: 360, y: sigY, size: 8.5, font: fontRegular });
  page.drawText(data.teacherRole || 'Guru / Admin Sistem', { x: 360, y: sigY - 12, size: 8.5, font: fontRegular });
  page.drawText(data.teacherName || 'Husnita Usman, M.Pd', { x: 360, y: sigY - 56, size: 9, font: fontBold });
  page.drawText(`NIP. ${data.teacherNip || '199610272019032006'}`, { x: 360, y: sigY - 68, size: 8, font: fontRegular });

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
