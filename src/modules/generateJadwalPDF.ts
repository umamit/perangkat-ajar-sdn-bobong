import { Schedule } from '@/types';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export async function generateJadwalPDF(schedules: Schedule[], className: string, teacherName: string) {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

  const doc = await PDFDocument.create();
  const page = doc.addPage([841.89, 595.28]); // A4 Landscape
  const { width, height } = page.getSize();

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const font = await doc.embedFont(StandardFonts.Helvetica);

  const primary = rgb(0.071, 0.647, 0.722);
  const darkGray = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.95, 0.95, 0.95);
  const midGray = rgb(0.5, 0.5, 0.5);

  // --- Header background ---
  page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: primary });

  // Header text
  page.drawText('SD NEGERI BOBONG', { x: 30, y: height - 25, size: 13, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Kabupaten Pulau Taliabu', { x: 30, y: height - 42, size: 9, font, color: rgb(0.9, 0.95, 1) });
  page.drawText(`JADWAL PELAJARAN — ${className.toUpperCase()}`, { x: 30, y: height - 60, size: 8, font: fontBold, color: rgb(0.85, 0.93, 0.97) });
  page.drawText(`Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, {
    x: width - 220, y: height - 42, size: 8, font, color: rgb(0.9, 0.95, 1)
  });

  // --- Build per-day time slots ---
  const allTimes = Array.from(new Set(schedules.map(s => s.timeStart || s.time_start || ''))).sort();

  if (allTimes.length === 0) {
    page.drawText('Tidak ada data jadwal untuk kelas ini.', { x: 30, y: height - 120, size: 12, font, color: midGray });
    const pdfBytes = await doc.save();
    downloadPDF(pdfBytes, `jadwal_${className.replace(/\s/g, '_')}.pdf`);
    return;
  }

  const marginTop = height - 90;
  const marginLeft = 30;
  const colWidth = (width - marginLeft * 2) / (DAYS.length + 1);
  const rowHeight = Math.min(50, (marginTop - 60) / (allTimes.length + 1));

  // Column headers
  page.drawRectangle({ x: marginLeft, y: marginTop - rowHeight, width: colWidth, height: rowHeight, color: lightGray });
  page.drawText('Jam', { x: marginLeft + 5, y: marginTop - rowHeight + rowHeight / 2 - 4, size: 8, font: fontBold, color: darkGray });

  DAYS.forEach((day, di) => {
    const x = marginLeft + colWidth * (di + 1);
    page.drawRectangle({ x, y: marginTop - rowHeight, width: colWidth, height: rowHeight, color: lightGray });
    page.drawText(day, { x: x + colWidth / 2 - day.length * 2.5, y: marginTop - rowHeight + rowHeight / 2 - 4, size: 8, font: fontBold, color: primary });
  });

  // Rows
  allTimes.forEach((time, ri) => {
    const y = marginTop - rowHeight * (ri + 2);

    // Time cell
    page.drawRectangle({ x: marginLeft, y, width: colWidth, height: rowHeight, color: ri % 2 === 0 ? rgb(1, 1, 1) : lightGray });
    page.drawText(time, { x: marginLeft + 5, y: y + rowHeight / 2 - 4, size: 7, font: fontBold, color: darkGray });

    DAYS.forEach((day, di) => {
      const x = marginLeft + colWidth * (di + 1);
      const slot = schedules.find(s => s.day === day && (s.timeStart || s.time_start) === time);
      const bg = ri % 2 === 0 ? rgb(1, 1, 1) : lightGray;
      page.drawRectangle({ x, y, width: colWidth, height: rowHeight, color: bg });

      if (slot) {
        const subj = slot.subject.length > 20 ? slot.subject.substring(0, 19) + '…' : slot.subject;
        page.drawText(subj, { x: x + 5, y: y + rowHeight / 2, size: 7, font: fontBold, color: darkGray });
        page.drawText(`${slot.timeEnd || slot.time_end}`, { x: x + 5, y: y + rowHeight / 2 - 10, size: 6, font, color: midGray });
      }
    });
  });

  // Grid lines
  const totalRows = allTimes.length + 1;
  for (let r = 0; r <= totalRows; r++) {
    const y = marginTop - rowHeight * (r + 1);
    page.drawLine({ start: { x: marginLeft, y }, end: { x: marginLeft + colWidth * (DAYS.length + 1), y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  }
  for (let c = 0; c <= DAYS.length + 1; c++) {
    const x = marginLeft + colWidth * c;
    page.drawLine({ start: { x, y: marginTop - rowHeight }, end: { x, y: marginTop - rowHeight * (totalRows + 1) }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  }

  // Footer
  page.drawText(`© SD Negeri Bobong — Sistem Perangkat Ajar Online | Guru: ${teacherName}`, {
    x: 30, y: 15, size: 7, font, color: midGray
  });

  const pdfBytes = await doc.save();
  downloadPDF(pdfBytes, `jadwal_${className.replace(/\s/g, '_')}.pdf`);
}

function downloadPDF(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
