import { PDFDocument, PDFPage, rgb, PDFFont } from "pdf-lib";

export function drawPdfFooterAndSignatures(
  pdfDoc: PDFDocument,
  page: PDFPage,
  width: number,
  height: number,
  startY: number,
  fontBold: PDFFont,
  fontRegular: PDFFont,
  teacherRole?: string,
  teacherName?: string,
  teacherNip?: string
): PDFPage {
  let targetPage = page;
  let nextY = startY;

  if (nextY < 140) {
    targetPage = pdfDoc.addPage([595.28, 841.89]);
    nextY = height - 60;
  }

  targetPage.drawRectangle({
    x: 40,
    y: nextY - 45,
    width: width - 80,
    height: 40,
    color: rgb(0.93, 0.98, 0.95),
    borderColor: rgb(0.65, 0.9, 0.74),
    borderWidth: 0.5,
  });

  targetPage.drawText("Status Akreditasi Administrasi: TERVERIFIKASI SANGAT BAIK", {
    x: 55,
    y: nextY - 22,
    size: 8.5,
    font: fontBold,
    color: rgb(0.08, 0.5, 0.24),
  });

  targetPage.drawText("Disinkronkan secara realtime dengan Supabase Cloud Database SD Negeri Bobong", {
    x: 55,
    y: nextY - 36,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.29, 0.35, 0.44),
  });

  const sigY = nextY - 80;
  const todayStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  targetPage.drawText("Mengetahui,", { x: 60, y: sigY, size: 8.5, font: fontRegular });
  targetPage.drawText("Kepala SD Negeri Bobong", { x: 60, y: sigY - 12, size: 8.5, font: fontRegular });
  targetPage.drawText("Husnita Usman, M.Pd", { x: 60, y: sigY - 56, size: 9, font: fontBold });
  targetPage.drawText("NIP. 199610272019032006", { x: 60, y: sigY - 68, size: 8, font: fontRegular });

  targetPage.drawText(`Bobong, ${todayStr}`, { x: 360, y: sigY, size: 8.5, font: fontRegular });
  targetPage.drawText(teacherRole || "Guru / Admin Sistem", { x: 360, y: sigY - 12, size: 8.5, font: fontRegular });
  targetPage.drawText(teacherName || "Husnita Usman, M.Pd", { x: 360, y: sigY - 56, size: 9, font: fontBold });
  targetPage.drawText(`NIP. ${teacherNip || "199610272019032006"}`, { x: 360, y: sigY - 68, size: 8, font: fontRegular });

  return targetPage;
}
