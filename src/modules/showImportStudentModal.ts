import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { openModal } from './openModal';
import { closeModal } from './closeModal';
import { appData, saveStudentToSupabase } from '../helpers';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';
import { showToast } from './showToast';

export function showImportStudentModal(): void {
  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  const currentClass = (selectElem && selectElem.value !== 'ALL') ? selectElem.value : '3B';

  const html = `
    <div style="font-size: 13.5px; color: var(--text-main);">
      <div style="background: #eef6f8; border: 1px solid rgba(18,165,184,0.3); padding: 12px; border-radius: 10px; margin-bottom: 16px;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: var(--primary-dark);">
          <i class="ri-information-line"></i> Impor Langsung Data Siswa Massal:
        </p>
        <p style="margin: 0 0 8px 0; font-size: 12.5px; color: var(--text-secondary);">
          Pilih file Excel (.xlsx, .xls) atau CSV (.csv). Seluruh data siswa akan <strong>otomatis langsung dimasukkan ke Kelas ${currentClass}</strong> dan disinkronkan ke Supabase Cloud!
        </p>
        <button type="button" class="btn btn-secondary" onclick="downloadStudentTemplate()" style="font-size: 12px; padding: 4px 10px;">
          <i class="ri-file-download-line"></i> Unduh Contoh Template Excel (.xlsx)
        </button>
      </div>

      <div style="border: 2px dashed #cbd5e1; padding: 28px 20px; text-align: center; border-radius: 12px; background: #f8fafc; margin-bottom: 16px;">
        <i class="ri-file-excel-2-line" style="font-size: 44px; color: var(--primary); display: block; margin-bottom: 10px;"></i>
        <p style="margin: 0 0 12px 0; font-weight: 700; font-size: 14px;">Klik Tombol di Bawah Ini Untuk Memilih File Excel</p>
        <input type="file" id="directImportFile" accept=".xlsx, .xls, .csv" onchange="executeDirectImport(this)" style="display: none;">
        <button type="button" class="btn btn-primary" onclick="document.getElementById('directImportFile').click()" style="padding: 10px 24px; font-size: 14px; font-weight: 600;">
          <i class="ri-upload-cloud-2-line"></i> Pilih & Langsung Impor File Excel
        </button>
      </div>
    </div>
  `;

  openModal('Impor Langsung Data Siswa', html);
}

export async function executeDirectImport(input: HTMLInputElement): Promise<void> {
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  showToast('⏳ Membaca & mengimpor file Excel ke Supabase Cloud...', 'info');

  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  const defaultTargetClass = (selectElem && selectElem.value !== 'ALL') ? selectElem.value : '3B';

  const parseAndSaveRows = async (rawData: any[]) => {
    if (!rawData || rawData.length === 0) {
      showToast('File Excel / CSV kosong!', 'error');
      return;
    }

    let importedCount = 0;
    let targetClass = defaultTargetClass;

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const keys = Object.keys(row);

      const findVal = (...possibleNames: string[]) => {
        const matchedKey = keys.find(k => possibleNames.some(p => k.toLowerCase().trim() === p.toLowerCase().trim()));
        return matchedKey ? String(row[matchedKey]).trim() : '';
      };

      // Ambil nilai nama dari kolom manapun jika pencocokan nama gagal
      let name = findVal('Nama Lengkap', 'Nama', 'name', 'Nama Siswa', 'siswa', 'Nama_Siswa');
      let nis = findVal('NISN', 'NIS', 'id', 'No Induk', 'Nomor Induk', 'Nis/Nisn');
      let rawClass = findVal('Kelas', 'classId', 'Kelas Siswa', 'Rombel');
      let rawGender = findVal('Jenis Kelamin', 'gender', 'JK', 'L/P', 'Sex');

      // Fallback jika header tidak cocok: ambil kolom ke-2 sebagai nama, kolom ke-1 sebagai NIS
      if (!name && keys.length >= 2) {
        const val1 = String(row[keys[0]] || '').trim();
        const val2 = String(row[keys[1]] || '').trim();
        if (isNaN(Number(val2)) && val2.length > 2) {
          name = val2;
          nis = val1;
        } else if (isNaN(Number(val1)) && val1.length > 2) {
          name = val1;
        }
      }

      if (name && name.toLowerCase() !== 'nama lengkap' && name.toLowerCase() !== 'nama' && name.toLowerCase() !== 'name') {
        let classId = rawClass.toUpperCase().trim()
          .replace('KELAS', '').replace('III', '3').replace('II', '2').replace('IV', '4')
          .replace('VI', '6').replace('V', '5').replace('I', '1')
          .replace(/[^0-9A-Z]/g, '');

        if (!classId || classId === '3') classId = defaultTargetClass;
        targetClass = classId;

        let gender = (rawGender.toUpperCase().startsWith('P') || rawGender.toUpperCase().startsWith('W')) ? 'P' : 'L';
        const generatedId = crypto.randomUUID ? crypto.randomUUID() : `st-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`;
        const newStudent: any = {
          id: generatedId,
          nis: generatedId,
          name: name,
          classId: classId,
          gender: gender,
          scoreFormatif: 80,
          scoreSumatif: 80
        };

        appData.students.push(newStudent);

        importedCount++;
        await saveStudentToSupabase(newStudent);
      }
    }

    closeModal();
    if (importedCount === 0) {
      alert('⚠️ Gagal Membaca Data: File Excel yang diunggah tidak memiliki kolom "Nama Lengkap" atau baris data siswa yang terbaca. Silakan unduh "Contoh Template Excel" di tombol atas modal impor untuk format resmi!');
      showToast('Gagal mengimpor: Tidak ada nama siswa yang terbaca dari file.', 'error');
      return;
    }

    showToast(`🎉 Sukses mengimpor ${importedCount} data siswa ke Kelas ${targetClass}!`, 'success');

    if (selectElem) {
      selectElem.value = targetClass;
    }

    if (typeof (window as any).filterSiswaByClass === 'function') {
      (window as any).filterSiswaByClass(targetClass);
    } else {
      renderDataSiswa(targetClass);
    }
    filterSiswa();
  };

  const filename = file.name.toLowerCase();
  if (filename.endsWith('.csv')) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await parseAndSaveRows(results.data);
      },
      error: (err) => {
        console.error(err);
        showToast('Gagal membaca file CSV!', 'error');
      }
    });
  } else {
    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet);
        await parseAndSaveRows(rawData);
      } catch (err) {
        console.error(err);
        showToast('Gagal membaca file Excel!', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

export function downloadStudentTemplate(): void {
  const templateData = [
    { "Nama Lengkap": "Ahmad Rizky Pratama", Kelas: "3B", "Jenis Kelamin": "L" },
    { "Nama Lengkap": "Siti Nurhaliza", Kelas: "3B", "Jenis Kelamin": "P" }
  ];
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");
  XLSX.writeFile(workbook, "Template_Impor_Siswa_SDN_Bobong.xlsx");
}
