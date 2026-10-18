import { PDFDocument, PDFPage, rgb, PDFFont } from "pdf-lib";
import { StudentRaporData } from "@/types/erapor";

export function wrapPdfText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(testLine, fontSize) <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function drawEraporBottomSections(
  pdfDoc: PDFDocument,
  page: PDFPage,
  rapor: StudentRaporData,
  curY: number,
  PAGE_W: number,
  PAGE_H: number,
  MARGIN: number,
  fontBold: PDFFont,
  fontRegular: PDFFont
): PDFPage {
  let activePage = page;
  let y = curY - 12;

  if (y < 210) {
    activePage = pdfDoc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  }

  // Tabel Kegiatan Ekstrakurikuler
  const COL_EKS = { no: 24, name: 145, pred: 65, desc: PAGE_W - MARGIN * 2 - 234 };
  activePage.drawRectangle({ x: MARGIN, y: y - 16, width: PAGE_W - MARGIN * 2, height: 16, color: rgb(0.92, 0.94, 0.96) });
  activePage.drawText("No", { x: MARGIN + 6, y: y - 11, size: 7.5, font: fontBold });
  activePage.drawText("Kegiatan Ekstrakurikuler", { x: MARGIN + COL_EKS.no + 6, y: y - 11, size: 7.5, font: fontBold });
  activePage.drawText("Predikat", { x: MARGIN + COL_EKS.no + COL_EKS.name + 8, y: y - 11, size: 7.5, font: fontBold });
  activePage.drawText("Keterangan", { x: MARGIN + COL_EKS.no + COL_EKS.name + COL_EKS.pred + 8, y: y - 11, size: 7.5, font: fontBold });
  y -= 16;

  for (const eks of rapor.extracurriculars) {
    const lines = wrapPdfText(eks.description || "-", fontRegular, 7, COL_EKS.desc - 12);
    const rowH = Math.max(18, lines.length * 9 + 6);
    activePage.drawRectangle({
      x: MARGIN, y: y - rowH, width: PAGE_W - MARGIN * 2, height: rowH,
      color: rgb(1, 1, 1), borderColor: rgb(0.84, 0.87, 0.91), borderWidth: 0.6
    });
    activePage.drawText(String(eks.no), { x: MARGIN + 8, y: y - 12, size: 7.5, font: fontRegular });
    activePage.drawText(eks.name, { x: MARGIN + COL_EKS.no + 6, y: y - 12, size: 7.5, font: fontBold });
    activePage.drawText(eks.predicate, { x: MARGIN + COL_EKS.no + COL_EKS.name + 8, y: y - 12, size: 7.5, font: fontBold });
    lines.forEach((l, idx) => {
      activePage.drawText(l, { x: MARGIN + COL_EKS.no + COL_EKS.name + COL_EKS.pred + 8, y: y - 10 - idx * 8.5, size: 7, font: fontRegular });
    });
    y -= rowH;
  }

  y -= 10;
  // Ketidakhadiran & Catatan Wali Kelas
  const boxH = 50;
  activePage.drawRectangle({ x: MARGIN, y: y - boxH, width: 175, height: boxH, borderColor: rgb(0.82, 0.86, 0.9), borderWidth: 0.8 });
  activePage.drawText("Ketidakhadiran", { x: MARGIN + 8, y: y - 11, size: 8, font: fontBold });
  activePage.drawText(`Sakit                : ${rapor.attendance.sakit} hari`, { x: MARGIN + 8, y: y - 22, size: 7.5, font: fontRegular });
  activePage.drawText(`Izin                  : ${rapor.attendance.izin} hari`, { x: MARGIN + 8, y: y - 33, size: 7.5, font: fontRegular });
  activePage.drawText(`Tanpa Keterangan : ${rapor.attendance.alpa} hari`, { x: MARGIN + 8, y: y - 44, size: 7.5, font: fontRegular });

  const notesX = MARGIN + 185;
  const notesW = PAGE_W - MARGIN * 2 - 185;
  activePage.drawRectangle({ x: notesX, y: y - boxH, width: notesW, height: boxH, borderColor: rgb(0.82, 0.86, 0.9), borderWidth: 0.8 });
  activePage.drawText("Catatan Wali Kelas", { x: notesX + 8, y: y - 11, size: 8, font: fontBold });
  const noteLines = wrapPdfText(rapor.homeroomNotes, fontRegular, 7.5, notesW - 16).slice(0, 3);
  noteLines.forEach((l, idx) => {
    activePage.drawText(l, { x: notesX + 8, y: y - 23 - idx * 9.5, size: 7.5, font: fontRegular });
  });
  y -= boxH + 16;

  // Tanda Tangan
  const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  activePage.drawText("Mengetahui,", { x: MARGIN + 10, y, size: 8, font: fontRegular });
  activePage.drawText(`Bobong, ${todayStr}`, { x: PAGE_W - MARGIN - 165, y, size: 8, font: fontRegular });
  y -= 11;
  activePage.drawText("Orang Tua / Wali,", { x: MARGIN + 10, y, size: 8, font: fontRegular });
  activePage.drawText("Kepala SD Negeri Bobong,", { x: PAGE_W / 2 - 55, y, size: 8, font: fontRegular });
  activePage.drawText("Wali Kelas,", { x: PAGE_W - MARGIN - 165, y, size: 8, font: fontRegular });
  y -= 36;
  activePage.drawText("( ........................................ )", { x: MARGIN + 10, y, size: 8, font: fontRegular });
  activePage.drawText(rapor.headmasterName, { x: PAGE_W / 2 - 55, y, size: 8, font: fontBold });
  activePage.drawText(rapor.homeroomTeacherName, { x: PAGE_W - MARGIN - 165, y, size: 8, font: fontBold });
  y -= 10;
  activePage.drawText(`NIP. ${rapor.headmasterNip}`, { x: PAGE_W / 2 - 55, y, size: 7.5, font: fontRegular });
  activePage.drawText(`NIP. ${rapor.homeroomTeacherNip}`, { x: PAGE_W - MARGIN - 165, y, size: 7.5, font: fontRegular });

  return activePage;
}
