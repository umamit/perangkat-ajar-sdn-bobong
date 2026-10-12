import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawOfficialKopSurat } from './pdfHeaderKop';
import { LkpdItem } from '@/types/lkpd';

export async function downloadLkpdPDF(lkpd: LkpdItem, teacher: any): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_W = 595.28; // A4 Portrait
  const PAGE_H = 841.89;
  const MARGIN = 40;

  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let curY = PAGE_H - MARGIN;

  // Header Kop Surat Resmi
  curY = await drawOfficialKopSurat(pdfDoc, page, PAGE_W, curY, MARGIN);

  // Judul Dokumen
  page.drawText('LEMBAR KERJA PESERTA DIDIK (LKPD)', {
    x: MARGIN, y: curY, size: 12, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  page.drawText(`Mata Pelajaran: ${lkpd.subject || teacher?.subject || 'Bahasa Inggris'} | Kelas: ${lkpd.classId || '1A'} (${lkpd.phase || 'Fase A'})`, {
    x: MARGIN, y: curY, size: 9.5, font: fontBold, color: rgb(0.07, 0.65, 0.72),
  });
  curY -= 16;

  // Kotak Identitas Siswa
  page.drawRectangle({
    x: MARGIN, y: curY - 50, width: PAGE_W - MARGIN * 2, height: 50,
    color: rgb(0.97, 0.98, 0.99), borderColor: rgb(0.85, 0.9, 0.94), borderWidth: 1,
  });
  page.drawText('Nama Siswa  : ..............................................................', {
    x: MARGIN + 12, y: curY - 18, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.35),
  });
  page.drawText('Kelas / No. : ............................ / .........', {
    x: PAGE_W - MARGIN - 210, y: curY - 18, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.35),
  });
  page.drawText('Hari/Tanggal: ..............................................................', {
    x: MARGIN + 12, y: curY - 38, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.35),
  });
  page.drawText('Nilai / Paraf : ............................', {
    x: PAGE_W - MARGIN - 210, y: curY - 38, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.35),
  });
  curY -= 65;

  // Informasi Aktivitas & TP
  page.drawText(`Materi / Topik: ${lkpd.title}`, {
    x: MARGIN, y: curY, size: 10, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  if (lkpd.tp) {
    page.drawText(`Tujuan Pembelajaran: ${lkpd.tp.slice(0, 140)}`, {
      x: MARGIN, y: curY, size: 8.5, font: fontRegular, color: rgb(0.3, 0.35, 0.45),
    });
    curY -= 16;
  }

  // Petunjuk Kerja
  page.drawText('Petunjuk Kerja Peserta Didik:', {
    x: MARGIN, y: curY, size: 9.5, font: fontBold, color: rgb(0.1, 0.15, 0.2),
  });
  curY -= 12;
  const guideLines = (lkpd.instructions || '1. Bacalah petunjuk dengan teliti sebelum mengerjakan.\n2. Tuliskan nama dan identitas pada kolom yang tersedia.\n3. Kerjakan tugas secara mandiri atau berkelompok sesuai arahan guru.').split('\n');
  guideLines.forEach(line => {
    page.drawText(line.trim(), { x: MARGIN + 10, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
    curY -= 12;
  });
  curY -= 8;

  // Lembar Aktivitas / Garis Jawaban Siswa
  page.drawText('Lembar Pengerjaan / Jawaban:', {
    x: MARGIN, y: curY, size: 9.5, font: fontBold, color: rgb(0.1, 0.15, 0.2),
  });
  curY -= 10;
  const lineCount = 14;
  for (let i = 0; i < lineCount; i++) {
    curY -= 20;
    page.drawLine({
      start: { x: MARGIN, y: curY },
      end: { x: PAGE_W - MARGIN, y: curY },
      thickness: 0.5,
      color: rgb(0.8, 0.83, 0.88),
    });
  }

  // Tanda Tangan Guru & Wali Kelas
  curY -= 35;
  const leftX = MARGIN + 10;
  const rightX = PAGE_W - MARGIN - 180;
  const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  page.drawText('Orang Tua / Wali Siswa,', { x: leftX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText(`Bobong, ${todayStr}`, { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 12;
  page.drawText('Guru Mata Pelajaran,', { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 36;
  page.drawText('( ............................................ )', { x: leftX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.3, 0.35, 0.45) });
  page.drawText(lkpd.teacherName || teacher?.name || 'Guru Mata Pelajaran', { x: rightX, y: curY, size: 8.5, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  curY -= 12;
  page.drawText(`NIP. ${lkpd.teacherNip || teacher?.nip || '-'}`, { x: rightX, y: curY, size: 7.5, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `LKPD_${lkpd.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
