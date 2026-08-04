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
        // Cari nilai berdasarkan kunci header secara fleksibel (case-insensitive & trimmed)
        const keys = Object.keys(row);
        const findVal = (...possibleNames: string[]) => {
          const matchedKey = keys.find(k => possibleNames.some(p => k.toLowerCase().trim() === p.toLowerCase().trim()));
          return matchedKey ? String(row[matchedKey]).trim() : '';
        };

        const nis = findVal('NISN', 'NIS', 'id', 'No Induk', 'Nomor Induk');
        const name = findVal('Nama Lengkap', 'Nama', 'name', 'Nama Siswa');
        let classIdRaw = findVal('Kelas', 'classId', 'Kelas Siswa', 'Rombel');
        let genderRaw = findVal('Jenis Kelamin', 'gender', 'JK', 'L/P', 'Sex');

        // Normalisasi Kode Kelas Pintar (misal: "Kelas 3B", "3-B", "III B", "3 B")
        let classId = classIdRaw.toUpperCase().trim()
          .replace('KELAS', '')
          .replace('III', '3')
          .replace('II', '2')
          .replace('IV', '4')
          .replace('VI', '6')
          .replace('V', '5')
          .replace('I', '1')
          .replace(/[^0-9A-Z]/g, '');

        if (!classId) {
          // Ambil dari dropdown filter yang sedang terpilih di UI jika di excel kosong
          const selectElem = document.getElementById('siswaClassSelect') as HTMLSelectElement | null;
          classId = (selectElem && selectElem.value !== 'ALL') ? selectElem.value : '3B';
        }
        let gender = (genderRaw.toUpperCase().startsWith('P') || genderRaw.toUpperCase().startsWith('W')) ? 'P' : 'L';

        if (nis || name) {
          const finalNis = nis || `SISWA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          targetClass = classId;
          const newStudent: any = {
            id: finalNis,
            nis: finalNis,
            name: name || 'Siswa Tanpa Nama',
            classId: classId,
            gender: gender,
            scoreFormatif: 80,
            scoreSumatif: 80
          };

          const existingIdx = (appData.students || []).findIndex((s: any) => s.nis === finalNis || s.id === finalNis);
          if (existingIdx >= 0) {
            appData.students[existingIdx] = newStudent;
          } else {
            appData.students.push(newStudent);
          }

          importedCount++;
          saveStudentToSupabase(newStudent);
        }
      }

      closeModal();
      showToast(`🎉 Sukses mengimpor ${importedCount} data siswa ke kelas ${targetClass}!`, 'success');

      if (typeof (window as any).filterSiswaByClass === 'function') {
        (window as any).filterSiswaByClass(targetClass !== 'ALL' ? targetClass : 'ALL');
      } else {
        renderDataSiswa(targetClass !== 'ALL' ? targetClass : 'ALL');
      }
      filterSiswa();

    } catch (err) {
      console.error('[Import Student Error]', err);
      showToast('Gagal memproses file Excel/CSV. Pastikan format file sesuai!', 'error');
    }
  };

  reader.readAsBinaryString(file);
}
