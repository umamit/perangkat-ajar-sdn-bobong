import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { StudentRaporData } from "@/types/erapor";
import { drawOfficialKopSurat } from "./pdfHeaderKop";
import { wrapPdfText, drawEraporBottomSections } from "./erapor/pdfEraporBottomDrawer";

export async function downloadEraporPDF(rapor: StudentRaporData): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_W = 595.28; // A4 Portrait
  const PAGE_H = 841.89;
  const MARGIN = 36;
  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let curY = PAGE_H - MARGIN;

  // Kop Surat Resmi
  curY = await drawOfficialKopSurat(pdfDoc, page, PAGE_W, curY, MARGIN);

  // Judul Rapor
  const titleText = "LAPORAN HASIL BELAJAR (RAPOR) KURIKULUM MERDEKA";
  const titleW = fontBold.widthOfTextAtSize(titleText, 11);
  page.drawText(titleText, { x: (PAGE_W - titleW) / 2, y: curY, size: 11, font: fontBold, color: rgb(0.05, 0.1, 0.16) });
  curY -= 16;

  // Identitas 2 Kolom
  const leftMeta = [
    ["Nama Peserta Didik", `: ${rapor.name}`],
    ["NIS / NISN", `: ${rapor.nis} / ${rapor.nisn}`],
    ["Nama Sekolah", `: ${rapor.schoolName}`],
    ["Alamat Sekolah", `: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat`]
  ];
  const rightMeta = [
    ["Kelas", `: ${rapor.className}`],
    ["Fase", `: ${rapor.phase}`],
    ["Semester", `: ${rapor.semester}`],
    ["Tahun Pelajaran", `: ${rapor.academicYear}`]
  ];

  leftMeta.forEach((row, i) => {
    const y = curY - i * 12;
    page.drawText(row[0], { x: MARGIN, y, size: 8, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
    page.drawText(row[1], { x: MARGIN + 85, y, size: 8, font: fontBold, color: rgb(0.05, 0.1, 0.16) });
  });
  rightMeta.forEach((row, i) => {
    const y = curY - i * 12;
    page.drawText(row[0], { x: PAGE_W - MARGIN - 165, y, size: 8, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
    page.drawText(row[1], { x: PAGE_W - MARGIN - 95, y, size: 8, font: fontBold, color: rgb(0.05, 0.1, 0.16) });
  });
  curY -= 54;

  // Header Tabel Nilai
  const COL_W = { no: 24, mapel: 135, nilai: 48, desc: PAGE_W - MARGIN * 2 - 207 };
  page.drawRectangle({ x: MARGIN, y: curY - 18, width: PAGE_W - MARGIN * 2, height: 18, color: rgb(0.07, 0.65, 0.72) });
  page.drawText("No", { x: MARGIN + 6, y: curY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Mata Pelajaran", { x: MARGIN + COL_W.no + 6, y: curY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Nilai Akhir", { x: MARGIN + COL_W.no + COL_W.mapel + 3, y: curY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Capaian Kompetensi", { x: MARGIN + COL_W.no + COL_W.mapel + COL_W.nilai + 8, y: curY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  curY -= 18;

  // Baris Mata Pelajaran
  for (const subj of rapor.subjects) {
    const descLines = wrapPdfText(subj.fullDescription, fontRegular, 7.5, COL_W.desc - 12);
    const rowH = Math.max(22, descLines.length * 9.5 + 7);
    if (curY - rowH < 60) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      curY = PAGE_H - MARGIN;
    }
    page.drawRectangle({
      x: MARGIN, y: curY - rowH, width: PAGE_W - MARGIN * 2, height: rowH,
      color: subj.no % 2 === 0 ? rgb(0.98, 0.99, 1) : rgb(1, 1, 1),
      borderColor: rgb(0.86, 0.89, 0.92), borderWidth: 0.6
    });
    page.drawText(String(subj.no), { x: MARGIN + 8, y: curY - 13, size: 8, font: fontRegular });
    page.drawText(subj.subject, { x: MARGIN + COL_W.no + 6, y: curY - 13, size: 8, font: fontBold });
    page.drawText(subj.finalScore > 0 ? String(subj.finalScore) : "-", {
      x: MARGIN + COL_W.no + COL_W.mapel + 16, y: curY - 13, size: 8.5, font: fontBold
    });
    descLines.forEach((line, idx) => {
      page.drawText(line, {
        x: MARGIN + COL_W.no + COL_W.mapel + COL_W.nilai + 8,
        y: curY - 10.5 - idx * 9, size: 7.5, font: fontRegular, color: rgb(0.18, 0.22, 0.28)
      });
    });
    curY -= rowH;
  }

  // Bagian Bawah (Ekstrakurikuler, Ketidakhadiran, Catatan, Tanda Tangan)
  drawEraporBottomSections(pdfDoc, page, rapor, curY, PAGE_W, PAGE_H, MARGIN, fontBold, fontRegular);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `eRapor_${rapor.classId}_${rapor.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
