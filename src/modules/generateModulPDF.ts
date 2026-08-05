import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface ModulItem {
  id?: string;
  title: string;
  fase?: string;
  classId?: string;
  semester?: string;
  description?: string;
  fileUrl?: string;
}

export interface ModulPDFData {
  modul: ModulItem;
  teacherName?: string;
  teacherNip?: string;
}

export async function downloadModulPDF(data: ModulPDFData): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_W = 595.28; // A4 Portrait
  const PAGE_H = 841.89;
  const MARGIN = 40;

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let curY  = PAGE_H - MARGIN;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Kop Sekolah
  page.drawText('PEMERINTAH KABUPATEN PULAU TALIABU', {
    x: MARGIN, y: curY, size: 11, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  page.drawText('DINAS PENDIDIKAN – SD NEGERI BOBONG', {
    x: MARGIN, y: curY, size: 10, font: fontBold, color: rgb(0.07, 0.65, 0.72),
  });
  curY -= 12;
  page.drawText('Desa Bobong, Kec. Taliabu Barat, Kab. Pulau Taliabu', {
    x: MARGIN, y: curY, size: 8, font: fontRegular, color: rgb(0.45, 0.50, 0.58),
  });
  curY -= 10;
  page.drawLine({
    start: { x: MARGIN, y: curY }, end: { x: PAGE_W - MARGIN, y: curY },
    thickness: 2, color: rgb(0.07, 0.65, 0.72),
  });
  curY -= 4;
  page.drawLine({
    start: { x: MARGIN, y: curY }, end: { x: PAGE_W - MARGIN, y: curY },
    thickness: 0.5, color: rgb(0.07, 0.65, 0.72),
  });
  curY -= 18;

  // Title
  page.drawText('MODUL AJAR KURIKULUM MERDEKA', {
    x: MARGIN, y: curY, size: 13, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 14;
  page.drawText('Mata Pelajaran: Bahasa Inggris', {
    x: MARGIN, y: curY, size: 10, font: fontBold, color: rgb(0.07, 0.65, 0.72),
  });
  curY -= 20;

  // Details Box
  page.drawRectangle({
    x: MARGIN, y: curY - 100, width: PAGE_W - MARGIN * 2, height: 100,
    color: rgb(0.96, 0.98, 0.99), borderColor: rgb(0.85, 0.9, 0.94), borderWidth: 1,
  });

  const details = [
    { label: 'Judul Modul Ajar', val: data.modul.title },
    { label: 'Fase / Kelas',     val: `${data.modul.fase || 'Fase A'} (Kelas ${data.modul.classId || '1A'})` },
    { label: 'Semester',         val: data.modul.semester || 'Semester 1 (Ganjil)' },
    { label: 'Penyusun / Guru',  val: `${data.teacherName || 'Husnita Usman, M.Pd'} (NIP. ${data.teacherNip || '199610272019032006'})` },
  ];

  details.forEach((d, i) => {
    const yPos = curY - 20 - i * 22;
    page.drawText(`${d.label}:`, { x: MARGIN + 12, y: yPos, size: 9, font: fontBold, color: rgb(0.2, 0.25, 0.35) });
    page.drawText(d.val, { x: MARGIN + 140, y: yPos, size: 9, font: fontRegular, color: rgb(0.06, 0.09, 0.16) });
  });

  curY -= 120;

  // Description / Content
  page.drawText('Deskripsi & Capaian Pembelajaran:', {
    x: MARGIN, y: curY, size: 10, font: fontBold, color: rgb(0.06, 0.09, 0.16),
  });
  curY -= 16;

  const descText = data.modul.description || 'Modul ajar bahasa Inggris dirancang untuk mengembangkan keterampilan menyimak, berbicara, membaca, dan menulis peserta didik secara komunikatif sesuai dengan Capaian Pembelajaran Kurikulum Merdeka di SD Negeri Bobong.';

  page.drawRectangle({
    x: MARGIN, y: curY - 80, width: PAGE_W - MARGIN * 2, height: 80,
    color: rgb(1, 1, 1), borderColor: rgb(0.88, 0.91, 0.95), borderWidth: 1,
  });

  page.drawText(descText.slice(0, 200), {
    x: MARGIN + 12, y: curY - 24, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.35),
  });

  curY -= 110;

  // Signatures
  curY -= 20;
  const leftX  = MARGIN + 10;
  const rightX = PAGE_W - MARGIN - 180;

  page.drawText('Mengetahui,', { x: leftX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText(`Bobong, ${todayStr}`, { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 12;
  page.drawText('Kepala SD Negeri Bobong', { x: leftX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText('Guru Mata Pelajaran', { x: rightX, y: curY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  curY -= 42;
  page.drawText('Husnita Usman, M.Pd', { x: leftX, y: curY, size: 9, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  page.drawText(data.teacherName || 'Husnita Usman, M.Pd', { x: rightX, y: curY, size: 9, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  curY -= 12;
  page.drawText('NIP. 199610272019032006', { x: leftX, y: curY, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
  page.drawText(`NIP. ${data.teacherNip || '199610272019032006'}`, { x: rightX, y: curY, size: 8, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Modul_Ajar_${data.modul.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
