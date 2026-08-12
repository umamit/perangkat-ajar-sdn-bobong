import { PDFDocument, PDFPage, rgb, StandardFonts, PDFImage } from 'pdf-lib';

export async function drawOfficialKopSurat(
  pdfDoc: PDFDocument,
  page: PDFPage,
  pageWidth: number,
  startY: number,
  margin: number = 40,
  schoolSettings?: any
): Promise<number> {
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  let logoKab: PDFImage | null = null;
  let logoSekolah: PDFImage | null = null;

  try {
    const resKab = await fetch('/assets/logo-kab-taliabu.png');
    if (resKab.ok) {
      const kabBytes = await resKab.arrayBuffer();
      logoKab = await pdfDoc.embedPng(kabBytes);
    }
  } catch (e) {
    console.warn('[Kop Logo Kab Load Error]', e);
  }

  try {
    const resSekolah = await fetch('/assets/logo-sdn-bobong.png');
    if (resSekolah.ok) {
      const sekolahBytes = await resSekolah.arrayBuffer();
      logoSekolah = await pdfDoc.embedPng(sekolahBytes);
    }
  } catch (e) {
    console.warn('[Kop Logo Sekolah Load Error]', e);
  }

  const logoWidth = 55;
  const logoHeight = 55;
  let curY = startY;

  // Draw Left Logo (Kabupaten Taliabu)
  if (logoKab) {
    page.drawImage(logoKab, {
      x: margin + 5,
      y: curY - logoHeight + 5,
      width: logoWidth,
      height: logoHeight,
    });
  }

  // Draw Right Logo (SD Negeri Bobong)
  if (logoSekolah) {
    page.drawImage(logoSekolah, {
      x: pageWidth - margin - logoWidth - 5,
      y: curY - logoHeight + 5,
      width: logoWidth,
      height: logoHeight,
    });
  }

  // Draw Centered Text Header
  const centerX = pageWidth / 2;

  // Line 1: PEMERINTAH KABUPATEN PULAU TALIABU
  const line1 = 'PEMERINTAH KABUPATEN PULAU TALIABU';
  const line1Width = fontBold.widthOfTextAtSize(line1, 13);
  page.drawText(line1, {
    x: centerX - line1Width / 2,
    y: curY,
    size: 13,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Line 2: DINAS PENDIDIKAN
  curY -= 15;
  const line2 = 'DINAS PENDIDIKAN';
  const line2Width = fontBold.widthOfTextAtSize(line2, 13);
  page.drawText(line2, {
    x: centerX - line2Width / 2,
    y: curY,
    size: 13,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Line 3: Dynamic School Name
  curY -= 16;
  const line3 = (schoolSettings?.school_name || 'SD NEGERI BOBONG').toUpperCase();
  const line3Width = fontBold.widthOfTextAtSize(line3, 15);
  page.drawText(line3, {
    x: centerX - line3Width / 2,
    y: curY,
    size: 15,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Line 4: Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Prov. Maluku Utara, 97791
  curY -= 14;
  const line4 = 'Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara, 97791';
  const line4Width = fontItalic.widthOfTextAtSize(line4, 9.5);
  page.drawText(line4, {
    x: centerX - line4Width / 2,
    y: curY,
    size: 9.5,
    font: fontItalic,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Double Line Separator
  curY -= 10;
  // Thick Top Line
  page.drawLine({
    start: { x: margin, y: curY },
    end: { x: pageWidth - margin, y: curY },
    thickness: 2.5,
    color: rgb(0, 0, 0),
  });

  // Thin Bottom Line
  curY -= 3.5;
  page.drawLine({
    start: { x: margin, y: curY },
    end: { x: pageWidth - margin, y: curY },
    thickness: 0.75,
    color: rgb(0, 0, 0),
  });

  return curY - 15;
}
