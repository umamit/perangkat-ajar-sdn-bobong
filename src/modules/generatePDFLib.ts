import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { drawOfficialKopSurat } from "./pdfHeaderKop";
import { drawClassStatsTable, ClassStat, StudentDetail } from "./pdfTableDrawers";
import { drawStudentDetailsPages } from "./pdfStudentDetailSection";
import { drawPdfFooterAndSignatures } from "./pdfFooterSection";

export async function downloadLaporanPDFWithPdfLib(data: {
  totalStudents: number;
  totalClasses: number;
  totalJournals: number;
  totalAttendance: number;
  teacherName?: string;
  teacherNip?: string;
  teacherRole?: string;
  classStats?: ClassStat[];
  studentDetails?: StudentDetail[];
  selectedClassName?: string;
  monthlyAttendanceData?: { name: string; pct: number }[];
  schoolSettings?: any;
}): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let curY = height - 40;
  curY = await drawOfficialKopSurat(pdfDoc, page, width, curY, 40, data.schoolSettings);

  const titleText = data.selectedClassName 
    ? `LAPORAN DETAIL ADMINISTRASI KELAS ${data.selectedClassName.toUpperCase()}`
    : "LAPORAN REKAPITULASI ADMINISTRASI PERANGKAT AJAR";
  
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 11);
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: height - 130,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  const startY = height - 160;
  const rowHeight = 24;
  const items = [
    { label: "Total Siswa Terdaftar", value: `${data.totalStudents} Siswa` },
    { label: "Total Rombel Kelas", value: `${data.totalClasses} Rombel (Fase A - C)` },
    { label: "Jurnal Mengajar Terisi", value: `${data.totalJournals} Entri` },
    { label: "Sesi Presensi Tersimpan", value: `${data.totalAttendance} Sesi` },
  ];

  items.forEach((item, index) => {
    const currentY = startY - index * rowHeight;
    page.drawRectangle({
      x: 40,
      y: currentY - 5,
      width: width - 80,
      height: 20,
      color: index % 2 === 0 ? rgb(0.97, 0.98, 0.99) : rgb(1, 1, 1),
      borderColor: rgb(0.9, 0.92, 0.94),
      borderWidth: 0.5,
    });
    page.drawText(`${index + 1}.  ${item.label}`, { x: 50, y: currentY + 2, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
    page.drawText(item.value, { x: 350, y: currentY + 2, size: 9, font: fontBold, color: rgb(0.07, 0.65, 0.72) });
  });

  let nextY = startY - (items.length * rowHeight) - 20;

  if (data.classStats && data.classStats.length > 0) {
    nextY = drawClassStatsTable(page, data.classStats, width, nextY, fontBold, fontRegular);
  }

  if (data.studentDetails && data.studentDetails.length > 0) {
    const res = drawStudentDetailsPages(pdfDoc, data.studentDetails, data.selectedClassName, width, height, fontBold, fontRegular);
    page = res.lastPage;
    nextY = res.nextY;
  }

  page = drawPdfFooterAndSignatures(pdfDoc, page, width, height, nextY, fontBold, fontRegular, data.teacherRole, data.teacherName, data.teacherNip);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Laporan_Administrasi_SDN_Bobong_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
