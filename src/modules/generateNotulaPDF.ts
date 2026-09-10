import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawOfficialKopSurat } from './pdfHeaderKop';
import { MeetingNote } from '@/types/meeting';

export async function downloadNotulaPDF(meeting: MeetingNote): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const PAGE_W = 595.28; // A4 portrait
  const PAGE_H = 841.89;
  const MARGIN = 45;

  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let curY = PAGE_H - MARGIN;

  curY = await drawOfficialKopSurat(pdfDoc, page, PAGE_W, curY, MARGIN);

  page.drawText('NOTULA & BERITA ACARA RAPAT DEWAN GURU', {
    x: MARGIN, y: curY, size: 12, font: fontBold, color: rgb(0.06, 0.09, 0.16)
  });
  curY -= 14;

  const dateStr = new Date(meeting.date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  page.drawText(`Nomor: 421.2 / BA-RAPAT / ${new Date(meeting.date).getFullYear()}   |   ${dateStr}`, {
    x: MARGIN, y: curY, size: 9, font: fontItalic, color: rgb(0.3, 0.35, 0.4)
  });
  curY -= 20;

  const drawRow = (label: string, value: string) => {
    page.drawText(label, { x: MARGIN, y: curY, size: 9.5, font: fontBold, color: rgb(0.1, 0.15, 0.2) });
    page.drawText(`:  ${value}`, { x: MARGIN + 120, y: curY, size: 9.5, font: fontRegular, color: rgb(0.1, 0.15, 0.2) });
    curY -= 15;
  };

  drawRow('Hari, Tanggal', dateStr);
  drawRow('Waktu Pelaksanaan', `${meeting.timeStart} ${meeting.timeEnd ? `- ${meeting.timeEnd} WIT` : 'WIT - Selesai'}`);
  drawRow('Tempat / Ruang', meeting.location || 'Ruang Guru SD Negeri Bobong');
  drawRow('Pemimpin Rapat', meeting.leaderName || 'Husnita Usman, M.Pd');
  drawRow('Notulis Rapat', meeting.notaryName || '-');
  drawRow('Status Pertemuan', meeting.status === 'Selesai' ? 'Terlaksana / Selesai' : 'Diagendakan');
  curY -= 10;

  const drawSection = (title: string, content: string) => {
    page.drawRectangle({
      x: MARGIN, y: curY - 2, width: PAGE_W - (MARGIN * 2), height: 16,
      color: rgb(0.94, 0.96, 0.98)
    });
    page.drawText(title, { x: MARGIN + 6, y: curY + 2, size: 9.5, font: fontBold, color: rgb(0.07, 0.4, 0.45) });
    curY -= 18;

    const lines = content ? content.split('\n') : ['-'];
    for (const l of lines.slice(0, 6)) {
      if (curY < 120) break;
      page.drawText(l.trim(), { x: MARGIN + 6, y: curY, size: 9, font: fontRegular, color: rgb(0.15, 0.2, 0.25) });
      curY -= 13;
    }
    curY -= 6;
  };

  drawSection('A. AGENDA / POKOK PEMBAHASAN', meeting.agendaTopics || 'Pembahasan kegiatan sekolah dan pembelajaran.');
  drawSection('B. RINGKASAN JALANNYA RAPAT / NOTULA', meeting.discussionSummary || 'Rapat berlangsung tertib dengan diskusi aktif dari dewan guru.');
  drawSection('C. KEPUTUSAN & KESEPAKATAN RAPAT', meeting.decisions || 'Seluruh dewan guru menyepakati hasil pembahasan rapat.');

  const hadirCount = meeting.attendees.filter(a => a.status === 'Hadir').length;
  drawSection('D. KEHADIRAN DEWAN GURU', `Total Terdaftar: ${meeting.attendees.length} Orang | Hadir: ${hadirCount} | Izin/Sakit: ${meeting.attendees.length - hadirCount}`);

  curY = Math.min(curY, 130);
  const col1X = MARGIN + 20;
  const col2X = PAGE_W - MARGIN - 180;

  page.drawText('Notulis Rapat,', { x: col1X, y: curY, size: 9, font: fontRegular });
  page.drawText('Mengetahui,', { x: col2X, y: curY, size: 9, font: fontRegular });
  page.drawText('Kepala SD Negeri Bobong,', { x: col2X, y: curY - 11, size: 9, font: fontBold });

  curY -= 45;
  page.drawText(meeting.notaryName || 'Guru SD Negeri Bobong', { x: col1X, y: curY, size: 9.5, font: fontBold });
  page.drawText(meeting.leaderName || 'Husnita Usman, M.Pd', { x: col2X, y: curY, size: 9.5, font: fontBold });

  curY -= 11;
  page.drawText(`NIP: ${meeting.notaryNip || '-'}`, { x: col1X, y: curY, size: 8, font: fontRegular });
  page.drawText('NIP: 199610272019032006', { x: col2X, y: curY, size: 8, font: fontRegular });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Notula-Rapat-${meeting.date}-${meeting.title.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
