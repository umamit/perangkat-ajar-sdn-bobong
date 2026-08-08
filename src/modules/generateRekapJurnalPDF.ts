import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawOfficialKopSurat } from './pdfHeaderKop';

export interface RekapJournalItem {
  date: string;
  teacherName: string;
  classId: string;
  topic: string;
  notes?: string;
}

export interface RekapJurnalPDFData {
  journals: RekapJournalItem[];
  periodStr: string; // e.g., "Agustus 2026"
  filterTeacherName?: string; // If filtered by specific teacher
}

export async function downloadRekapJurnalPDF(data: RekapJurnalPDFData): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_W = 841.89; // A4 Landscape
  const PAGE_H = 595.28;
  const MARGIN = 40;

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let curY = PAGE_H - MARGIN;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Official Header Kop Surat
  curY = await drawOfficialKopSurat(pdfDoc, page, PAGE_W, curY, MARGIN);

  // Title
  page.drawText(`REKAPITULASI JURNAL HARIAN GURU`, {
    x: MARGIN, y: curY, size: 12, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  
  const filterDesc = data.filterTeacherName ? `Guru: ${data.filterTeacherName}` : 'Semua Guru';
  page.drawText(`Periode: ${data.periodStr} | ${filterDesc} | Dicetak: ${todayStr}`, {
    x: MARGIN, y: curY, size: 8.5, font: fontRegular, color: rgb(0.35, 0.40, 0.50),
  });
  curY -= 20;

  // Table Header
  const COL = {
    no: MARGIN,
    date: MARGIN + 25,
    teacher: MARGIN + 115,
    classId: MARGIN + 240,
    topic: MARGIN + 290,
    notes: MARGIN + 500
  };
  const ROW_H = 22;

  page.drawRectangle({
    x: MARGIN, y: curY - ROW_H, width: PAGE_W - MARGIN * 2, height: ROW_H,
    color: rgb(0.07, 0.65, 0.72),
  });

  [
    { x: COL.no,      t: 'No.' },
    { x: COL.date,    t: 'Hari / Tanggal' },
    { x: COL.teacher, t: 'Nama Guru' },
    { x: COL.classId, t: 'Kelas' },
    { x: COL.topic,   t: 'Materi / Topik Pelajaran' },
    { x: COL.notes,   t: 'Catatan Kegiatan / Hambatan' },
  ].forEach(h => {
    page.drawText(h.t, { x: h.x + 4, y: curY - 15, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
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

    page.drawText(String(idx + 1), { x: COL.no + 4, y: curY - 15, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(j.date, { x: COL.date + 4, y: curY - 15, size: 8, font: fontBold, color: rgb(0.1, 0.14, 0.22) });
    page.drawText(j.teacherName.slice(0, 24), { x: COL.teacher + 4, y: curY - 15, size: 8, font: fontRegular, color: rgb(0.1, 0.14, 0.22) });
    page.drawText(j.classId, { x: COL.classId + 4, y: curY - 15, size: 8, font: fontBold, color: rgb(0.07, 0.65, 0.72) });
    page.drawText(j.topic.slice(0, 42), { x: COL.topic + 4, y: curY - 15, size: 8, font: fontRegular, color: rgb(0.1, 0.14, 0.22) });
    page.drawText((j.notes || '-').slice(0, 52), { x: COL.notes + 4, y: curY - 15, size: 8, font: fontRegular, color: rgb(0.3, 0.35, 0.45) });

    curY -= ROW_H;
  });

  // Signatures at the bottom
  curY -= 25;
  if (curY < MARGIN + 70) {
    page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    curY = PAGE_H - MARGIN;
  }

  const signX = PAGE_W - MARGIN - 180;
  page.drawText('Mengetahui,', { x: signX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText('Kepala Sekolah SD Negeri Bobong', { x: signX, y: curY - 12, size: 8.5, font: fontBold, color: rgb(0.1, 0.14, 0.22) });

  curY -= 60;
  page.drawText('HUSNITA USMAN, M.Pd', { x: signX, y: curY, size: 9, font: fontBold, color: rgb(0.1, 0.14, 0.22) });
  page.drawText('NIP. 199610272019032006', { x: signX, y: curY - 11, size: 8.5, font: fontRegular, color: rgb(0.35, 0.40, 0.50) });

  // Generate and download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Rekap_Jurnal_Mengajar_${data.periodStr.replace(/\s+/g, '_')}.pdf`;
  link.click();
}
