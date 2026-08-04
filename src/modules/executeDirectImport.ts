import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { appData, saveStudentToSupabase } from '../helpers';
import { closeModal } from './closeModal';
import { renderDataSiswa } from './renderDataSiswa';
import { filterSiswa } from './filterSiswa';
import { showToast } from './showToast';

export async function executeDirectImport(input: HTMLInputElement): Promise<void> {
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  showToast('Membaca & mengimpor file Excel ke Supabase Cloud...', 'info');

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

      let name = findVal('Nama Lengkap', 'Nama', 'name', 'Nama Siswa', 'siswa', 'Nama_Siswa');
      let nis = findVal('NISN', 'NIS', 'id', 'No Induk', 'Nomor Induk', 'Nis/Nisn');
      let rawClass = findVal('Kelas', 'classId', 'Kelas Siswa', 'Rombel');
      let rawGender = findVal('Jenis Kelamin', 'gender', 'JK', 'L/P', 'Sex');

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
        const generatedId = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
              const r = Math.random() * 16 | 0;
              return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        const newStudent: any = {
          id: generatedId,
          uuid: generatedId,
          nis: nis || generatedId,
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
      alert('⚠️ Gagal Membaca Data: File Excel yang diunggah tidak memiliki kolom "Nama Lengkap" atau baris data siswa yang terbaca.');
      showToast('Gagal mengimpor: Tidak ada nama siswa yang terbaca dari file.', 'error');
      return;
    }

    showToast(`Sukses mengimpor ${importedCount} data siswa ke Kelas ${targetClass}!`, 'success');
    if (selectElem) selectElem.value = targetClass;

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
