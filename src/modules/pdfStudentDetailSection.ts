import { PDFDocument, PDFPage, rgb, PDFFont } from "pdf-lib";
import { StudentDetail } from "./pdfTableDrawers";

export function drawStudentDetailsPages(
  pdfDoc: PDFDocument,
  studentDetails: StudentDetail[],
  selectedClassName: string | undefined,
  width: number,
  height: number,
  fontBold: PDFFont,
  fontRegular: PDFFont
): { lastPage: PDFPage; nextY: number } {
  let page = pdfDoc.addPage([595.28, 841.89]);
  let stdY = height - 60;
  
  page.drawText(`DAFTAR SISWA & PERFORMA KELAS: ${selectedClassName || ""}`, {
    x: 40,
    y: stdY,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });
  stdY -= 25;

  page.drawRectangle({
    x: 40,
    y: stdY - 5,
    width: width - 80,
    height: 20,
    color: rgb(0.12, 0.16, 0.23),
  });

  page.drawText("No", { x: 50, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Nama Siswa", { x: 80, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("NIS", { x: 280, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Kehadiran", { x: 380, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Rerata Nilai", { x: 480, y: stdY + 2, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });

  stdY -= 20;

  studentDetails.forEach((s, idx) => {
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
    page.drawText(s.nis || "-", { x: 280, y: stdY + 1, size: 8, font: fontRegular });
    page.drawText(`${s.attendanceRate}%`, { x: 380, y: stdY + 1, size: 8, font: fontBold, color: s.attendanceRate >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.2, 0.2) });
    page.drawText(s.gradeAverage.toFixed(1), { x: 480, y: stdY + 1, size: 8, font: fontBold, color: s.gradeAverage >= 75 ? rgb(0.1, 0.6, 0.3) : rgb(0.8, 0.6, 0.1) });

    stdY -= 18;
  });

  return { lastPage: page, nextY: stdY - 20 };
}
