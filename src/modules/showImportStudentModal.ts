import * as XLSX from 'xlsx';
import { openModal } from './openModal';

export function showImportStudentModal(): void {
  const form = `
    <div style="font-size: 13.5px; color: var(--text-main);">
      <div style="background: #eef6f8; border: 1px solid rgba(18,165,184,0.3); padding: 12px; border-radius: 10px; margin-bottom: 16px;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: var(--primary-dark);">
          <i class="ri-information-line"></i> Panduan Format Impor Data Siswa Massal:
        </p>
        <ul style="margin: 0; padding-left: 18px; line-height: 1.6; font-size: 12.5px;">
          <li>Mendukung format file: <strong>Excel (.xlsx, .xls)</strong> dan <strong>CSV (.csv)</strong>.</li>
          <li>Kolom wajib: <strong>NISN / NIS</strong>, <strong>Nama Lengkap</strong>, <strong>Kelas</strong> (contoh: 3A, 3B), dan <strong>Jenis Kelamin</strong> (L / P).</li>
        </ul>
        <button type="button" class="btn btn-secondary" onclick="downloadStudentTemplate()" style="margin-top: 10px; font-size: 12px; padding: 4px 10px;">
          <i class="ri-file-download-line"></i> Unduh Template Excel (.xlsx)
        </button>
      </div>

      <form onsubmit="handleImportStudentSubmit(event)">
        <div class="form-group" style="margin-bottom: 16px;">
          <label style="font-weight: 700; font-size: 13px; margin-bottom: 6px; display: block;">Pilih File Excel / CSV Data Siswa</label>
          <input type="file" id="importStudentFile" accept=".xlsx, .xls, .csv" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 13px; background: white;">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; font-size: 13.5px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <i class="ri-upload-cloud-line"></i> Unggah & Impor Siswa Massal
        </button>
      </form>
    </div>
  `;

  openModal('Impor Data Siswa Massal (Excel / CSV)', form);
}

export function downloadStudentTemplate(): void {
  const templateData = [
    { NISN: "3182096101", "Nama Lengkap": "Ahmad Rizky Pratama", Kelas: "3B", "Jenis Kelamin": "L" },
    { NISN: "3182096102", "Nama Lengkap": "Siti Nurhaliza", Kelas: "3B", "Jenis Kelamin": "P" },
    { NISN: "3182096103", "Nama Lengkap": "Muhammad Bahrul", Kelas: "3B", "Jenis Kelamin": "L" }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");
  XLSX.writeFile(workbook, "Template_Impor_Siswa_SDN_Bobong.xlsx");
}
