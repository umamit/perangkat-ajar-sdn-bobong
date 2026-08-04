import * as XLSX from 'xlsx';
import { appData, saveStudentToSupabase } from '../helpers';
import { closeModal } from './closeModal';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';
import { showToast } from './showToast';

export function handleImportStudentSubmit(e: Event): void {
  e.preventDefault();
  const fileInput = document.getElementById('importStudentFile') as HTMLInputElement | null;
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    showToast('Harap pilih file Excel atau CSV terlebih dahulu!', 'error');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async (evt: ProgressEvent<FileReader>) => {
    try {
      const buffer = evt.target?.result;
      const workbook = XLSX.read(buffer, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawData: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!rawData || rawData.length === 0) {
        showToast('File Excel / CSV kosong atau tidak terbaca!', 'error');
        return;
      }

      let importedCount = 0;
      let targetClass = 'ALL';

      for (const row of rawData) {
        const nis = String(row.NISN || row.nis || row.NIS || row.id || '').trim();
        const name = String(row['Nama Lengkap'] || row.nama || row.name || row.Nama || '').trim();
        let classIdRaw = String(row.Kelas || row.kelas || row.classId || '3A').trim().toUpperCase();
        let classId = classIdRaw.replace(/[^0-9A-Z]/g, ''); // contoh "KELAS 3-B" -> "3B", "3 - B" -> "3B"
        let genderRaw = String(row['Jenis Kelamin'] || row.gender || row.JK || 'L').trim().toUpperCase();
        let gender = (genderRaw.startsWith('P') || genderRaw.startsWith('W')) ? 'P' : 'L';

        if (nis && name) {
          targetClass = classId;
          const newStudent: any = {
            id: nis,
            nis: nis,
            name: name,
            classId: classId,
            gender: gender,
            scoreFormatif: 80,
            scoreSumatif: 80
          };

          const existingIdx = (appData.students || []).findIndex((s: any) => s.nis === nis || s.id === nis);
          if (existingIdx >= 0) {
            appData.students[existingIdx] = newStudent;
          } else {
            appData.students.push(newStudent);
          }

          importedCount++;
          // Fire and forget / background save to Supabase
          saveStudentToSupabase(newStudent);
        }
      }

      closeModal();
      showToast(`🎉 Sukses mengimpor ${importedCount} siswa massal ke database!`, 'success');

      const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
      if (selectElem && targetClass !== 'ALL') {
        selectElem.value = targetClass;
      }
      renderDataSiswa(targetClass !== 'ALL' ? targetClass : 'ALL');
      filterSiswa();

    } catch (err) {
      console.error('[Import Student Error]', err);
      showToast('Gagal memproses file Excel/CSV. Pastikan format file sesuai!', 'error');
    }
  };

  reader.readAsBinaryString(file);
}
