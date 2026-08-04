import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { openModal } from './openModal';
import { closeModal } from './closeModal';
import { appData, saveStudentToSupabase, saveToLocalPersistentStorage } from '../helpers';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';
import { showToast } from './showToast';

let parsedRows: any[] = [];
let fileHeaders: string[] = [];

export function showImportStudentModal(): void {
  parsedRows = [];
  fileHeaders = [];

  const html = `
    <div id="importWizardContainer" style="font-size: 13.5px; color: var(--text-main);">
      
      <!-- STEP 1: UPLOAD FILE -->
      <div id="importStep1">
        <div style="background: #eef6f8; border: 1px solid rgba(18,165,184,0.3); padding: 12px; border-radius: 10px; margin-bottom: 16px;">
          <p style="margin: 0 0 6px 0; font-weight: 700; color: var(--primary-dark);">
            <i class="ri-information-line"></i> Impor Data Siswa Massal Pintar:
          </p>
          <p style="margin: 0 0 8px 0; font-size: 12.5px; color: var(--text-secondary);">
            Mendukung file Excel (.xlsx, .xls) dan CSV (.csv). Format kolom Anda akan dicocokkan secara interaktif di langkah berikutnya!
          </p>
          <button type="button" class="btn btn-secondary" onclick="downloadStudentTemplate()" style="font-size: 12px; padding: 4px 10px;">
            <i class="ri-file-download-line"></i> Unduh Contoh Template Excel (.xlsx)
          </button>
        </div>

        <div style="border: 2px dashed #cbd5e1; padding: 24px; text-align: center; border-radius: 12px; background: #f8fafc; margin-bottom: 16px;">
          <i class="ri-file-excel-2-line" style="font-size: 40px; color: var(--primary); display: block; margin-bottom: 8px;"></i>
          <p style="margin: 0 0 10px 0; font-weight: 600;">Pilih atau Tarik File Excel / CSV Siswa</p>
          <input type="file" id="importStudentFile" accept=".xlsx, .xls, .csv" onchange="processImportFile(this)" style="display: none;">
          <button type="button" class="btn btn-primary" onclick="document.getElementById('importStudentFile').click()" style="padding: 8px 18px; font-size: 13px;">
            <i class="ri-folder-open-line"></i> Pilih File Dokumen
          </button>
        </div>
      </div>

      <!-- STEP 2: MAPPING KOLOM (VISUAL COLUMN MAPPER) -->
      <div id="importStep2" style="display: none;">
        <div style="background: #f1f5f9; padding: 12px; border-radius: 10px; margin-bottom: 16px;">
          <p style="margin: 0; font-weight: 700; color: #0f172a; font-size: 13px;">
            <i class="ri-layout-grid-line"></i> Langkah 2: Cocokkan Kolom File dengan Data Sistem
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569;">
            Pilih nama kolom dari file Excel Anda yang sesuai dengan data di bawah ini:
          </p>
        </div>

        <div style="display: grid; gap: 12px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; background: white; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <label style="font-weight: 600; font-size: 13px;"><span style="color:red;">*</span> Nama Lengkap Siswa:</label>
            <select id="mapName" class="map-select" style="padding: 6px; border-radius: 6px; border: 1px solid #cbd5e1; width: 55%; font-size: 12.5px;"></select>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; background: white; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <label style="font-weight: 600; font-size: 13px;">NISN / NIS / No Induk:</label>
            <select id="mapNis" class="map-select" style="padding: 6px; border-radius: 6px; border: 1px solid #cbd5e1; width: 55%; font-size: 12.5px;"></select>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; background: white; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <label style="font-weight: 600; font-size: 13px;">Kelas Siswa:</label>
            <select id="mapClass" class="map-select" style="padding: 6px; border-radius: 6px; border: 1px solid #cbd5e1; width: 55%; font-size: 12.5px;"></select>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; background: white; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <label style="font-weight: 600; font-size: 13px;">Jenis Kelamin (L / P):</label>
            <select id="mapGender" class="map-select" style="padding: 6px; border-radius: 6px; border: 1px solid #cbd5e1; width: 55%; font-size: 12.5px;"></select>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="resetImportWizard()" style="padding: 8px 14px; font-size: 12.5px;">
            <i class="ri-arrow-left-line"></i> Kembali
          </button>
          <button type="button" class="btn btn-primary" onclick="confirmImportMapping()" style="padding: 8px 18px; font-size: 13px; font-weight: 600;">
            <i class="ri-check-double-line"></i> Lanjutkan ke Pratinjau
          </button>
        </div>
      </div>

      <!-- STEP 3: PREVIEW & CONFIRM -->
      <div id="importStep3" style="display: none;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px;">
          <p style="margin: 0; color: #166534; font-weight: 600; font-size: 12.5px;">
            <i class="ri-checkbox-circle-line"></i> Pratinjau: Siap mengimpor <strong id="previewCount">0</strong> data siswa.
          </p>
        </div>

        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
            <thead style="background: #f8fafc; position: sticky; top: 0;">
              <tr>
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0;">No</th>
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0;">NISN</th>
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Nama Siswa</th>
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Kelas</th>
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0;">JK</th>
              </tr>
            </thead>
            <tbody id="importPreviewBody"></tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="showStep2()" style="padding: 8px 14px; font-size: 12.5px;">
            <i class="ri-arrow-left-line"></i> Ubah Pemetaan
          </button>
          <button type="button" class="btn btn-primary" onclick="executeFinalImport()" style="padding: 8px 20px; font-size: 13px; font-weight: 600;">
            <i class="ri-upload-cloud-2-line"></i> Impor Sekarang
          </button>
        </div>
      </div>

    </div>
  `;

  openModal('Impor Data Siswa Massal Pintar', html);
}

export function processImportFile(input: HTMLInputElement): void {
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const filename = file.name.toLowerCase();

  if (filename.endsWith('.csv')) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        fileHeaders = results.meta.fields || [];
        parsedRows = results.data;
        showStep2();
      },
      error: (err) => {
        console.error(err);
        showToast('Gagal membaca file CSV!', 'error');
      }
    });
  } else {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        parsedRows = XLSX.utils.sheet_to_json(sheet);
        if (parsedRows.length > 0) {
          fileHeaders = Object.keys(parsedRows[0]);
          showStep2();
        } else {
          showToast('File Excel kosong!', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Gagal membaca file Excel!', 'error');
      }
    };
    reader.readAsBinaryString(file);
  }
}

export function showStep2(): void {
  const step1 = document.getElementById('importStep1');
  const step2 = document.getElementById('importStep2');
  const step3 = document.getElementById('importStep3');
  if (step1) step1.style.display = 'none';
  if (step3) step3.style.display = 'none';
  if (step2) step2.style.display = 'block';

  const selectOptions = `<option value="">-- Abaikan / Kosong --</option>` +
    fileHeaders.map(h => `<option value="${h}">${h}</option>`).join('');

  ['mapName', 'mapNis', 'mapClass', 'mapGender'].forEach(id => {
    const el = document.getElementById(id) as HTMLSelectElement | null;
    if (el) el.innerHTML = selectOptions;
  });

  // Smart Auto Match
  const autoSelect = (selectId: string, possibleNames: string[]) => {
    const el = document.getElementById(selectId) as HTMLSelectElement | null;
    if (!el) return;
    const match = fileHeaders.find(h => possibleNames.some(p => h.toLowerCase().trim() === p.toLowerCase().trim()));
    if (match) el.value = match;
  };

  autoSelect('mapName', ['nama lengkap', 'nama', 'name', 'nama siswa']);
  autoSelect('mapNis', ['nisn', 'nis', 'id', 'no induk', 'nomor induk']);
  autoSelect('mapClass', ['kelas', 'classid', 'kelas siswa', 'rombel']);
  autoSelect('mapGender', ['jenis kelamin', 'gender', 'jk', 'l/p', 'sex']);
}

export function resetImportWizard(): void {
  const step1 = document.getElementById('importStep1');
  const step2 = document.getElementById('importStep2');
  const step3 = document.getElementById('importStep3');
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'none';
}

let finalImportData: any[] = [];

export function confirmImportMapping(): void {
  const mapName = (document.getElementById('mapName') as HTMLSelectElement)?.value;
  const mapNis = (document.getElementById('mapNis') as HTMLSelectElement)?.value;
  const mapClass = (document.getElementById('mapClass') as HTMLSelectElement)?.value;
  const mapGender = (document.getElementById('mapGender') as HTMLSelectElement)?.value;

  if (!mapName) {
    showToast('Harap pilih kolom untuk Nama Lengkap Siswa!', 'error');
    return;
  }

  const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
  const currentSelectedClass = (selectElem && selectElem.value !== 'ALL') ? selectElem.value : '3B';

  finalImportData = parsedRows.map((row, idx) => {
    const rawName = String(row[mapName] || '').trim();
    const rawNis = mapNis ? String(row[mapNis] || '').trim() : '';
    const rawClass = mapClass ? String(row[mapClass] || '').trim() : '';
    const rawGender = mapGender ? String(row[mapGender] || '').trim() : '';

    let classId = rawClass.toUpperCase().trim()
      .replace('KELAS', '')
      .replace('III', '3').replace('II', '2').replace('IV', '4')
      .replace('VI', '6').replace('V', '5').replace('I', '1')
      .replace(/[^0-9A-Z]/g, '');

    if (!classId) classId = currentSelectedClass;

    let gender = (rawGender.toUpperCase().startsWith('P') || rawGender.toUpperCase().startsWith('W')) ? 'P' : 'L';
    const nisn = rawNis || `31820${1000 + idx}`;

    return {
      id: nisn,
      nis: nisn,
      name: rawName || 'Siswa Tanpa Nama',
      classId: classId,
      gender: gender,
      scoreFormatif: 80,
      scoreSumatif: 80
    };
  }).filter(s => s.name && s.name !== 'Siswa Tanpa Nama');

  if (finalImportData.length === 0) {
    showToast('Tidak ada data siswa valid yang ditemukan di file!', 'error');
    return;
  }

  const previewCount = document.getElementById('previewCount');
  if (previewCount) previewCount.innerText = String(finalImportData.length);

  const previewBody = document.getElementById('importPreviewBody');
  if (previewBody) {
    previewBody.innerHTML = finalImportData.map((s, index) => `
      <tr>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f1f5f9;">${index + 1}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f1f5f9;">${s.nis}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f1f5f9;"><strong>${s.name}</strong></td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f1f5f9;"><span class="badge badge-info">${s.classId}</span></td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f1f5f9;">${s.gender}</td>
      </tr>
    `).join('');
  }

  const step2 = document.getElementById('importStep2');
  const step3 = document.getElementById('importStep3');
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'block';
}

export function executeFinalImport(): void {
  let targetClass = '3B';
  finalImportData.forEach(newStudent => {
    targetClass = newStudent.classId;
    const existingIdx = (appData.students || []).findIndex((s: any) => s.nis === newStudent.nis || s.id === newStudent.id);
    if (existingIdx >= 0) {
      appData.students[existingIdx] = newStudent;
    } else {
      appData.students.push(newStudent);
    }
    saveStudentToSupabase(newStudent);
  });

  saveToLocalPersistentStorage();

  closeModal();
  showToast(`🎉 Berhasil mengimpor ${finalImportData.length} data siswa ke Kelas ${targetClass}!`, 'success');

  if (typeof (window as any).filterSiswaByClass === 'function') {
    (window as any).filterSiswaByClass(targetClass);
  } else {
    renderDataSiswa(targetClass);
  }
  filterSiswa();
}

export function downloadStudentTemplate(): void {
  const templateData = [
    { NISN: "3182096101", "Nama Lengkap": "Ahmad Rizky Pratama", Kelas: "3B", "Jenis Kelamin": "L" },
    { NISN: "3182096102", "Nama Lengkap": "Siti Nurhaliza", Kelas: "3B", "Jenis Kelamin": "P" }
  ];
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");
  XLSX.writeFile(workbook, "Template_Impor_Siswa_SDN_Bobong.xlsx");
}
