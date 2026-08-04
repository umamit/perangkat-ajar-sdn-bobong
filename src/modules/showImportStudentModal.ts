import { openModal } from './openModal';

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
