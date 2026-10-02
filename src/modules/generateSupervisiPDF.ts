import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { drawOfficialKopSurat } from "./pdfHeaderKop";
import { SupervisionItem } from "@/types/supervision";
import { SUPERVISION_ASPECTS } from "@/components/views/supervisi/supervisionCalculations";

export async function downloadSupervisiPDF(
  item: SupervisionItem,
  headmasterName: string,
  headmasterNip: string,
  schoolSettings?: any
): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let curY = height - 40;
  curY = await drawOfficialKopSurat(pdfDoc, page, width, curY, 40, schoolSettings);

  const titleText = "LEMBAR INSTRUMEN SUPERVISI OBSERVASI PEMBELAJARAN";
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 11);
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: curY - 15,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  curY -= 40;
  const meta = [
    { k: "Nama Guru", v: item.teacherName },
    { k: "NIP", v: item.teacherNip || "-" },
    { k: "Mata Pelajaran", v: item.subject },
    { k: "Kelas / Fase", v: `Kelas ${item.classId}` },
    { k: "Hari / Tanggal", v: item.date },
    { k: "Materi Pokok", v: item.topic },
  ];

  meta.forEach((m, idx) => {
    const isRight = idx % 2 === 1;
    const xPos = isRight ? width / 2 + 10 : 45;
    const yPos = curY - Math.floor(idx / 2) * 16;
    page.drawText(`${m.k}:`, { x: xPos, y: yPos, size: 9, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
    page.drawText(m.v, { x: xPos + 80, y: yPos, size: 9, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
  });

  curY -= 60;
  page.drawRectangle({ x: 45, y: curY, width: width - 90, height: 20, color: rgb(0.07, 0.65, 0.72) });
  page.drawText("No", { x: 55, y: curY + 6, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Indikator Pengamatan Pembelajaran", { x: 80, y: curY + 6, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Skor (1-4)", { x: width - 100, y: curY + 6, size: 8, font: fontBold, color: rgb(1, 1, 1) });

  curY -= 18;
  SUPERVISION_ASPECTS.forEach((asp, i) => {
    const scoreVal = item.scores[asp.key] || 0;
    page.drawRectangle({
      x: 45, y: curY, width: width - 90, height: 18,
      color: i % 2 === 0 ? rgb(0.97, 0.98, 0.99) : rgb(1, 1, 1),
    });
    page.drawText(`${i + 1}`, { x: 55, y: curY + 5, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(asp.title, { x: 80, y: curY + 5, size: 8, font: fontBold, color: rgb(0.15, 0.15, 0.15) });
    page.drawText(`${scoreVal}`, { x: width - 85, y: curY + 5, size: 8, font: fontBold, color: rgb(0.07, 0.65, 0.72) });
    curY -= 18;
  });

  curY -= 10;
  const resultSummary = `Total Skor: ${item.totalScore} / 28 (${item.percentage}%)   |   Predikat: ${item.predicate}`;
  page.drawRectangle({ x: 45, y: curY, width: width - 90, height: 22, color: rgb(0.94, 0.97, 0.99) });
  page.drawText(resultSummary, { x: 55, y: curY + 7, size: 9, font: fontBold, color: rgb(0.04, 0.49, 0.55) });

  curY -= 35;
  if (item.notesGood) {
    page.drawText("Kelebihan / Kekuatan Guru:", { x: 45, y: curY, size: 8, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
    page.drawText(item.notesGood, { x: 45, y: curY - 12, size: 8, font: fontRegular, color: rgb(0.15, 0.15, 0.15) });
    curY -= 28;
  }
  if (item.recommendations) {
    page.drawText("Rekomendasi & Tindak Lanjut Kepala Sekolah:", { x: 45, y: curY, size: 8, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
    page.drawText(item.recommendations, { x: 45, y: curY - 12, size: 8, font: fontRegular, color: rgb(0.15, 0.15, 0.15) });
    curY -= 35;
  }

  // Tanda Tangan
  const sigY = 110;
  page.drawText(`Bobong, ${item.date}`, { x: width - 190, y: sigY + 45, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  page.drawText("Guru yang Disupervisi,", { x: 55, y: sigY + 30, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(item.teacherName, { x: 55, y: sigY - 20, size: 8, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(`NIP. ${item.teacherNip || "-"}`, { x: 55, y: sigY - 30, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  page.drawText("Kepala Sekolah,", { x: width - 190, y: sigY + 30, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(headmasterName, { x: width - 190, y: sigY - 20, size: 8, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(`NIP. ${headmasterNip}`, { x: width - 190, y: sigY - 30, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Supervisi_${item.teacherName.replace(/\s+/g, "_")}_${item.date}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
