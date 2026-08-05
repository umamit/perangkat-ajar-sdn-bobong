import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawOfficialKopSurat } from './pdfHeaderKop';

export interface JournalItem {
  id?: string;
  date: string;
  time?: string;
  classId: string;
  topic: string;
  attendance?: string;
  notes?: string;
}

export interface JurnalPDFData {
  journals: JournalItem[];
  teacherName?: string;
  teacherNip?: string;
}

export async function downloadJurnalPDF(data: JurnalPDFData): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_W = 841.89; // A4 Landscape
  const PAGE_H = 595.28;
  const MARGIN = 40;

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let curY  = PAGE_H - MARGIN;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Official Header Kop Surat
  curY = await drawOfficialKopSurat(pdfDoc, page, PAGE_W, curY, MARGIN);

  // Title
  page.drawText('JURNAL MENGAJAR HARIAN GURU BAHASA INGGRIS', {
    x: MARGIN, y: curY, size: 13, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  page.drawText(`Dicetak pada: ${todayStr} | Total Entri: ${data.journals.length}`, {
    x: MARGIN, y: curY, size: 9, font: fontRegular, color: rgb(0.35, 0.40, 0.50),
  });
  curY -= 20;

  // Table Header
  const COL = { no: MARGIN, date: MARGIN + 30, classId: MARGIN + 120, topic: MARGIN + 180, attendance: MARGIN + 450, notes: MARGIN + 550 };
  const ROW_H = 20;

  page.drawRectangle({
    x: MARGIN, y: curY - ROW_H, width: PAGE_W - MARGIN * 2, height: ROW_H,
    color: rgb(0.07, 0.65, 0.72),
  });

  [
    { x: COL.no,         t: 'No.' },
    { x: COL.date,       t: 'Tanggal & Jam' },
    { x: COL.classId,    t: 'Kelas' },
    { x: COL.topic,      t: 'Materi / Topik Pembelajaran' },
    { x: COL.attendance, t: 'Kehadiran Siswa' },
    { x: COL.notes,      t: 'Catatan / Evaluasi' },
  ].forEach(h => {
    page.drawText(h.t, { x: h.x + 4, y: curY - 14, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  });
  curY -= ROW_H;

  // Table Rows
  data.journals.forEach((j, idx) => {
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

    const dateTimeStr = j.time ? `${j.date} (${j.time})` : j.date;

    page.drawText(String(idx + 1), { x: COL.no + 4, y: curY - 14, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(dateTimeStr, { x: COL.date + 4, y: curY - 14, size: 8, font: fontBold, color: rgb(0.1, 0.14, 0.22) });
    page.drawText(j.classId, { x: COL.classId + 4, y: curY - 14, size: 8.5, font: fontBold, color: rgb(0.07, 0.65, 0.72) });
    page.drawText(j.topic.slice(0, 45), { x: COL.topic + 4, y: curY - 14, size: 8, font: fontRegular, color: rgb(0.1, 0.14, 0.22) });
    page.drawText(j.attendance || '-', { x: COL.attendance + 4, y: curY - 14, size: 8, font: fontRegular, color: rgb(0.3, 0.35, 0.45) });
    page.drawText((j.notes || '-').slice(0, 35), { x: COL.notes + 4, y: curY - 14, size: 8, font: fontRegular, color: rgb(0.3, 0.35, 0.45) });

    curY -= ROW_H;
  });

  // Signatures
  curY -= 20;
  if (curY < MARGIN + 80) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); curY = PAGE_H - MARGIN; }

  const leftX  = MARGIN + 20;
  const rightX = PAGE_W - MARGIN - 200;

  page.drawText('Mengetahui,', { x: leftX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText(`Bobong, ${todayStr}`, { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 12;
  page.drawText('Kepala SD Negeri Bobong', { x: leftX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText('Guru Mata Pelajaran Bahasa Inggris', { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
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
  link.download = `Jurnal_Mengajar_SDN_Bobong_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
