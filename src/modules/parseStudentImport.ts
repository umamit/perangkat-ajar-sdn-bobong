import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { saveStudentToSupabase } from '@/lib/supabase';
import { Student } from '@/types';

export async function parseStudentImport(
  file: File,
  targetClass: string,
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void,
  onImportSuccess: (imported: Student[]) => void
): Promise<void> {
  const parseAndSaveRows = async (rawData: any[]) => {
    if (!rawData || rawData.length === 0) {
      showToast('File Excel / CSV kosong!', 'error');
      return;
    }

    let importedCount = 0;
    const parsedStudents: Student[] = [];

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

        if (!classId) classId = targetClass;

        let gender = (rawGender.toUpperCase().startsWith('P') || rawGender.toUpperCase().startsWith('W')) ? 'P' : 'L';
        const generatedId = crypto.randomUUID();
        const newStudent: Student = {
          id: generatedId,
          nis: nis || generatedId,
          name: name,
          classId: classId,
          gender: gender as 'L' | 'P',
          scoreFormatif: 0,
          scoreSumatif: 0,
          scoreSts: 0,
          scoreSas: 0
        };

        const success = await saveStudentToSupabase(newStudent);
        if (success) {
          parsedStudents.push(newStudent);
          importedCount++;
        }
      }
    }

    if (importedCount === 0) {
      showToast('Gagal mengimpor: Tidak ada nama siswa yang valid terbaca', 'error');
      return;
    }

    onImportSuccess(parsedStudents);
    showToast(`Sukses mengimpor ${importedCount} data siswa ke Kelas ${targetClass}!`, 'success');
  };

  const filename = file.name.toLowerCase();
  if (filename.endsWith('.csv')) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await parseAndSaveRows(results.data);
      },
      error: () => {
        showToast('Gagal membaca file CSV!', 'error');
      }
    });
  } else {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet);
        await parseAndSaveRows(rawData);
      } catch (err) {
        showToast('Gagal membaca file Excel!', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }
}
