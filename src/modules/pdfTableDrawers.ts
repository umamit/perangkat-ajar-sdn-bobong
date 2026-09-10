import { PDFPage, rgb, PDFFont } from 'pdf-lib';

export interface ClassStat {
  name: string;
  studentCount: number;
  attendanceRate: number;
  gradeAverage: number;
}

export interface StudentDetail {
  name: string;
  nis: string;
  attendanceRate: number;
  gradeAverage: number;
}

export function drawClassStatsTable(
  page: PDFPage,
  classStats: ClassStat[],
  width: number,
  startY: number,
  fontBold: PDFFont,
  fontRegular: PDFFont
): number {
  let nextY = startY;

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

  classStats.forEach((c, idx) => {
    page.drawRectangle({
      x: 40,
      y: nextY - 5,
      width: width - 80,
      height: 18,
      color: idx % 2 === 0 ? rgb(0.98, 0.98, 0.98) : rgb(1, 1, 1),
      borderColor: rgb(0.92, 0.92, 0.92),
      borderWidth: 0.5,
    });

    page.drawText(`Kelas ${c.name}`, { x: 50, y: nextY + 1, size: 8, font: fontRegular });
    page.drawText(`${c.studentCount} Siswa`, { x: 180, y: nextY + 1, size: 8, font: fontRegular });
    page.drawText(`${c.attendanceRate}%`, {
      x: 280,
      y: nextY + 1,
      size: 8,
      font: fontBold,
      color: c.attendanceRate >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.2, 0.2),
    });
    page.drawText(c.gradeAverage.toFixed(1), {
      x: 420,
      y: nextY + 1,
      size: 8,
      font: fontBold,
      color: c.gradeAverage >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.6, 0.1),
    });

    nextY -= 18;
  });

  return nextY - 20;
}

export function drawStudentDetailsTable(
  page: PDFPage,
  studentDetails: StudentDetail[],
  selectedClassName: string | undefined,
  width: number,
  startY: number,
  fontBold: PDFFont,
  fontRegular: PDFFont
): number {
  let stdY = startY;

  page.drawText(`DAFTAR SISWA KELAS ${selectedClassName || ''}`, {
    x: 40,
    y: stdY,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.2),
  });
  stdY -= 15;

  page.drawRectangle({
    x: 40,
    y: stdY - 5,
    width: width - 80,
    height: 20,
    color: rgb(0.1, 0.15, 0.2),
  });

  page.drawText('No', { x: 50, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Nama Siswa', { x: 80, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('NIS', { x: 280, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Kehadiran', { x: 380, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Rerata Nilai', { x: 480, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });

  stdY -= 20;

  studentDetails.slice(0, 20).forEach((s, idx) => {
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
    page.drawText(`${s.attendanceRate}%`, {
      x: 380,
      y: stdY + 1,
      size: 8,
      font: fontBold,
      color: s.attendanceRate >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.2, 0.2),
    });
    page.drawText(s.gradeAverage.toFixed(1), {
      x: 480,
      y: stdY + 1,
      size: 8,
      font: fontBold,
      color: s.gradeAverage >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.6, 0.1),
    });

    stdY -= 18;
  });

  return stdY - 20;
}
