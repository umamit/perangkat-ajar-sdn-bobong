import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Student } from '@/types';
import { drawOfficialKopSurat } from './pdfHeaderKop';

export interface NilaiPDFData {
  className: string;
  students: Student[];
  teacherName?: string;
  teacherNip?: string;
  teacherRole?: string;
  teacherSubject?: string;
}

export async function downloadNilaiPDF(data: NilaiPDFData): Promise<void> {
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
  page.drawText('REKAPITULASI DAFTAR NILAI ASESMEN SISWA (KURIKULUM MERDEKA)', {
    x: MARGIN, y: curY, size: 13, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  page.drawText(`Kelas: ${data.className === 'ALL' ? 'Semua Kelas' : data.className}   |   Dicetak pada: ${todayStr}   |   Total: ${data.students.length} Siswa`, {
    x: MARGIN, y: curY, size: 9, font: fontRegular, color: rgb(0.35, 0.40, 0.50),
  });
  curY -= 20;

  // Table Header
  const COL = { no: MARGIN, nis: MARGIN + 30, name: MARGIN + 110, classId: MARGIN + 360, formatif: MARGIN + 430, sts: MARGIN + 510, sas: MARGIN + 580, final: MARGIN + 650, status: MARGIN + 720 };
  const ROW_H = 18;

  page.drawRectangle({
    x: MARGIN, y: curY - ROW_H, width: PAGE_W - MARGIN * 2, height: ROW_H,
    color: rgb(0.07, 0.65, 0.72),
  });

  [
    { x: COL.no,       t: 'No.' },
    { x: COL.nis,      t: 'NIS' },
    { x: COL.name,     t: 'Nama Siswa' },
    { x: COL.classId,  t: 'Kelas' },
    { x: COL.formatif, t: 'Formatif (40%)' },
    { x: COL.sts,      t: 'STS (30%)' },
    { x: COL.sas,      t: 'SAS (30%)' },
    { x: COL.final,    t: 'Nilai Akhir' },
    { x: COL.status,   t: 'Ketuntasan' },
  ].forEach(h => {
    page.drawText(h.t, { x: h.x + 4, y: curY - 13, size: 8, font: fontBold, color: rgb(1, 1, 1) });
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

    const formatif = s.scoreFormatif || 0;
    const sts = (s as any).scoreSts || s.scoreSumatif || 0;
    const sas = (s as any).scoreSas || s.scoreSumatif || 0;
    const finalGrade = Math.round((formatif * 0.4) + (sts * 0.3) + (sas * 0.3));
    const isTuntas = finalGrade >= 75;

    page.drawText(String(idx + 1), { x: COL.no + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(s.nis || '-', { x: COL.nis + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(s.name, { x: COL.name + 4, y: curY - 13, size: 8.5, font: fontBold, color: rgb(0.1, 0.14, 0.22) });
    page.drawText(s.classId || '-', { x: COL.classId + 4, y: curY - 13, size: 8, font: fontBold, color: rgb(0.07, 0.65, 0.72) });
    page.drawText(String(formatif), { x: COL.formatif + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(String(sts), { x: COL.sts + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(String(sas), { x: COL.sas + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(String(finalGrade), { x: COL.final + 4, y: curY - 13, size: 8.5, font: fontBold, color: rgb(0.1, 0.14, 0.22) });

    const statusText = isTuntas ? 'Tuntas' : 'Perlu Bimbingan';
    const statusColor = isTuntas ? rgb(0.06, 0.63, 0.35) : rgb(0.85, 0.55, 0.02);
    page.drawText(statusText, { x: COL.status + 4, y: curY - 13, size: 8, font: fontBold, color: statusColor });

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
  page.drawText(data.teacherRole || 'Guru Mata Pelajaran', { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 42;
  page.drawText('Husnita Usman, M.Pd', { x: leftX, y: curY, size: 9, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  page.drawText(data.teacherName || 'Guru Mata Pelajaran', { x: rightX, y: curY, size: 9, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  curY -= 12;
  page.drawText('NIP. 199610272019032006', { x: leftX, y: curY, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
  page.drawText(`NIP. ${data.teacherNip || '-'}`, { x: rightX, y: curY, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Rekap_Nilai_SDN_Bobong_${data.className}_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
