import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Student } from '@/types';

export interface SiswaPDFData {
  className: string;
  students: Student[];
  teacherName?: string;
  teacherNip?: string;
}

export async function downloadSiswaPDF(data: SiswaPDFData): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_W = 595.28; // A4 Portrait
  const PAGE_H = 841.89;
  const MARGIN = 40;

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let curY  = PAGE_H - MARGIN;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Kop Sekolah
  page.drawText('PEMERINTAH KABUPATEN PULAU TALIABU', {
    x: MARGIN, y: curY, size: 11, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  page.drawText('DINAS PENDIDIKAN – SD NEGERI BOBONG', {
    x: MARGIN, y: curY, size: 10, font: fontBold, color: rgb(0.07, 0.65, 0.72),
  });
  curY -= 12;
  page.drawText('Desa Bobong, Kec. Taliabu Barat, Kab. Pulau Taliabu', {
    x: MARGIN, y: curY, size: 8, font: fontRegular, color: rgb(0.45, 0.50, 0.58),
  });
  curY -= 10;
  page.drawLine({
    start: { x: MARGIN, y: curY }, end: { x: PAGE_W - MARGIN, y: curY },
    thickness: 2, color: rgb(0.07, 0.65, 0.72),
  });
  curY -= 4;
  page.drawLine({
    start: { x: MARGIN, y: curY }, end: { x: PAGE_W - MARGIN, y: curY },
    thickness: 0.5, color: rgb(0.07, 0.65, 0.72),
  });
  curY -= 16;

  // Title
  page.drawText('DAFTAR INDUK INDIVIDUAL SISWA PER KELAS', {
    x: MARGIN, y: curY, size: 12, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  page.drawText(`Kelas: ${data.className === 'ALL' ? 'Semua Kelas' : data.className}   |   Total: ${data.students.length} Siswa`, {
    x: MARGIN, y: curY, size: 9, font: fontRegular, color: rgb(0.35, 0.40, 0.50),
  });
  curY -= 20;

  // Table Header
  const COL = { no: MARGIN, nis: MARGIN + 30, name: MARGIN + 120, gender: MARGIN + 360, classId: MARGIN + 430 };
  const ROW_H = 18;

  page.drawRectangle({
    x: MARGIN, y: curY - ROW_H, width: PAGE_W - MARGIN * 2, height: ROW_H,
    color: rgb(0.07, 0.65, 0.72),
  });

  [
    { x: COL.no,      t: 'No.' },
    { x: COL.nis,     t: 'NIS / NISN' },
    { x: COL.name,    t: 'Nama Lengkap Siswa' },
    { x: COL.gender,  t: 'L/P' },
    { x: COL.classId, t: 'Kelas' },
  ].forEach(h => {
    page.drawText(h.t, { x: h.x + 4, y: curY - 13, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  });
  curY -= ROW_H;

  // Table Rows
  data.students.forEach((s, idx) => {
    if (curY < MARGIN + 80) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      curY = PAGE_H - MARGIN;
    }

    const isEven = idx % 2 === 0;
    page.drawRectangle({
      x: MARGIN, y: curY - ROW_H, width: PAGE_W - MARGIN * 2, height: ROW_H,
      color: isEven ? rgb(0.97, 0.98, 0.99) : rgb(1, 1, 1),
      borderColor: rgb(0.88, 0.91, 0.95), borderWidth: 0.5,
    });

    page.drawText(String(idx + 1), { x: COL.no + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(s.nis || '-', { x: COL.nis + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(s.name, { x: COL.name + 4, y: curY - 13, size: 8.5, font: fontBold, color: rgb(0.1, 0.14, 0.22) });
    page.drawText(s.gender || 'L', { x: COL.gender + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(s.classId || '-', { x: COL.classId + 4, y: curY - 13, size: 8.5, font: fontBold, color: rgb(0.07, 0.65, 0.72) });

    curY -= ROW_H;
  });

  // Signatures
  curY -= 20;
  if (curY < MARGIN + 80) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); curY = PAGE_H - MARGIN; }

  const leftX  = MARGIN + 10;
  const rightX = PAGE_W - MARGIN - 180;

  page.drawText('Mengetahui,', { x: leftX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText(`Bobong, ${todayStr}`, { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 12;
  page.drawText('Kepala SD Negeri Bobong', { x: leftX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText('Guru Kelas / Wali Kelas', { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 42;
  page.drawText('Husnita Usman, M.Pd', { x: leftX, y: curY, size: 9, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  page.drawText(data.teacherName || 'Husnita Usman, M.Pd', { x: rightX, y: curY, size: 9, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  curY -= 12;
  page.drawText('NIP. 199610272019032006', { x: leftX, y: curY, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
  page.drawText(`NIP. ${data.teacherNip || '199610272019032006'}`, { x: rightX, y: curY, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Daftar_Siswa_SDN_Bobong_${data.className}_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
