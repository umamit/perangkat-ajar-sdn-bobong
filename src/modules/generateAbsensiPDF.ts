import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawOfficialKopSurat } from './pdfHeaderKop';

export interface StudentAttendance {
  name: string;
  nis?: string;
  status?: string;
}

export interface AbsensiPDFData {
  className: string;
  date: string;
  students: StudentAttendance[];
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  teacherName?: string;
  teacherNip?: string;
  teacherRole?: string;
}

const STATUS_COLOR: Record<string, [number, number, number]> = {
  Hadir:  [0.06, 0.63, 0.35],
  Izin:   [0.85, 0.65, 0.02],
  Sakit:  [0.90, 0.45, 0.05],
  Alpa:   [0.82, 0.14, 0.19],
};

export async function downloadAbsensiPDF(data: AbsensiPDFData): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ── A4 landscape for wider table ──────────────────────────────────────────
  const PAGE_W = 841.89;
  const PAGE_H = 595.28;
  const MARGIN = 40;

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let curY  = PAGE_H - MARGIN;

  const todayStr = new Date(data.date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // ── Official Header Kop Surat ─────────────────────────────────────────────
  curY = await drawOfficialKopSurat(pdfDoc, page, PAGE_W, curY, MARGIN);

  // ── Title ─────────────────────────────────────────────────────────────────
  page.drawText('DAFTAR HADIR SISWA', {
    x: MARGIN, y: curY, size: 13, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  page.drawText(`Kelas ${data.className}   |   ${todayStr}`, {
    x: MARGIN, y: curY, size: 9, font: fontRegular, color: rgb(0.35, 0.40, 0.50),
  });
  curY -= 20;

  // ── Summary bar ───────────────────────────────────────────────────────────
  const summaryLabels = [
    { label: 'Hadir', val: data.hadir,  bg: [0.93, 1.00, 0.96] as [number,number,number], fg: STATUS_COLOR.Hadir },
    { label: 'Izin',  val: data.izin,   bg: [1.00, 0.97, 0.88] as [number,number,number], fg: STATUS_COLOR.Izin  },
    { label: 'Sakit', val: data.sakit,  bg: [1.00, 0.95, 0.90] as [number,number,number], fg: STATUS_COLOR.Sakit },
    { label: 'Alpa',  val: data.alpa,   bg: [1.00, 0.93, 0.94] as [number,number,number], fg: STATUS_COLOR.Alpa  },
  ];
  const boxW = 90, boxH = 32, boxGap = 10;
  summaryLabels.forEach((s, i) => {
    const bx = MARGIN + i * (boxW + boxGap);
    page.drawRectangle({ x: bx, y: curY - boxH, width: boxW, height: boxH,
      color: rgb(...s.bg), borderColor: rgb(...s.fg), borderWidth: 1 });
    page.drawText(s.label, { x: bx + 8, y: curY - 13, size: 8, font: fontBold, color: rgb(...s.fg) });
    page.drawText(String(s.val), { x: bx + 8, y: curY - 26, size: 14, font: fontBold, color: rgb(...s.fg) });
  });
  curY -= boxH + 16;

  // ── Table Header ──────────────────────────────────────────────────────────
  const COL = { no: MARGIN, nis: MARGIN + 30, name: MARGIN + 100, status: MARGIN + 380, note: MARGIN + 470 };
  const ROW_H = 18;

  page.drawRectangle({
    x: MARGIN, y: curY - ROW_H, width: PAGE_W - MARGIN * 2, height: ROW_H,
    color: rgb(0.07, 0.65, 0.72),
  });
  [
    { x: COL.no,     t: 'No.' },
    { x: COL.nis,    t: 'NIS' },
    { x: COL.name,   t: 'Nama Siswa' },
    { x: COL.status, t: 'Status' },
    { x: COL.note,   t: 'Keterangan' },
  ].forEach(h => {
    page.drawText(h.t, { x: h.x + 4, y: curY - 13, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  });
  curY -= ROW_H;

  // ── Table Rows ────────────────────────────────────────────────────────────
  data.students.forEach((s, idx) => {
    if (curY < MARGIN + 60) {
      // New page
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      curY = PAGE_H - MARGIN;
    }

    const isEven = idx % 2 === 0;
    page.drawRectangle({
      x: MARGIN, y: curY - ROW_H, width: PAGE_W - MARGIN * 2, height: ROW_H,
      color: isEven ? rgb(0.97, 0.98, 0.99) : rgb(1, 1, 1),
      borderColor: rgb(0.88, 0.91, 0.95), borderWidth: 0.5,
    });

    page.drawText(String(idx + 1), { x: COL.no + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(s.nis || '-', { x: COL.nis + 4, y: curY - 13, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(s.name, { x: COL.name + 4, y: curY - 13, size: 8.5, font: fontBold, color: rgb(0.1, 0.14, 0.22) });

    const statusColor = s.status ? STATUS_COLOR[s.status] : [0.6, 0.6, 0.6] as [number,number,number];
    page.drawText(s.status || '-', { x: COL.status + 4, y: curY - 13, size: 8.5, font: fontBold, color: rgb(...statusColor) });

    curY -= ROW_H;
  });

  // ── Signature ─────────────────────────────────────────────────────────────
  curY -= 20;
  if (curY < MARGIN + 80) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); curY = PAGE_H - MARGIN; }

  const sigDateStr = new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const leftX  = MARGIN + 20;
  const rightX = PAGE_W - MARGIN - 200;

  page.drawText('Mengetahui,', { x: leftX,  y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText(`Bobong, ${sigDateStr}`, { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 12;
  page.drawText('Kepala SD Negeri Bobong', { x: leftX,  y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText(data.teacherRole || 'Guru Kelas / Wali Kelas', { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 42;
  page.drawText('Husnita Usman, M.Pd', { x: leftX, y: curY, size: 9, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  page.drawText(data.teacherName || 'Guru Kelas', { x: rightX, y: curY, size: 9, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  curY -= 12;
  page.drawText('NIP. 199610272019032006', { x: leftX, y: curY, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
  page.drawText(`NIP. ${data.teacherNip || '-'}`, { x: rightX, y: curY, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });

  // ── Download ──────────────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Absensi_Kelas${data.className}_${data.date}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
