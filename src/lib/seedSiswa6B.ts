import { saveStudentToSupabase, getSupabase } from '@/lib/supabase';

export const SISWA_6B_LIST = [
  { id: '6B-01', nis: '20266B01', name: 'ARBAIN ASLUN', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-02', nis: '20266B02', name: 'APRILIA PURNAMA WISRAN', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6B-03', nis: '20266B03', name: 'ALYA NAFISA', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6B-04', nis: '20266B04', name: 'FEBRIANTI', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6B-05', nis: '20266B05', name: 'SAHRIL', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-06', nis: '20266B06', name: 'SUMAYAH KHAIRUNNISA', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6B-07', nis: '20266B07', name: 'FIKRI HAMID', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-08', nis: '20266B08', name: 'FIRZAH SILARATUBUN', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6B-09', nis: '20266B09', name: 'MIVTAHUL FITRA RAMADANI', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-10', nis: '20266B10', name: 'MOH. KAMRIN', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-11', nis: '20266B11', name: 'NUR ANNISA AZZAHRA TUANGKE', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6B-12', nis: '20266B12', name: 'MARDANA ALI', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-13', nis: '20266B13', name: 'RAFKAH HAMAZI', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-14', nis: '20266B14', name: 'HARNIATI', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6B-15', nis: '20266B15', name: 'LIANA RAMADANI M. KASIM', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6B-16', nis: '20266B16', name: 'RAHMAT ALI RISKY', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-17', nis: '20266B17', name: 'ZAKLI ILYAS', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-18', nis: '20266B18', name: 'ARIL ARDIANSYAH', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-19', nis: '20266B19', name: 'AKBAR LA UJA', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-20', nis: '20266B20', name: 'BILAL HIDAYAH GERMAN', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-21', nis: '20266B21', name: 'ZULFITRAH HARDI', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6B-22', nis: '20266B22', name: 'JUMRI', class_id: '6B', classId: '6B', gender: 'L' },
];

export const REAL_6B_NAMES = new Set(SISWA_6B_LIST.map(s => s.name.toUpperCase()));

export async function seedSiswa6BToSupabase() {
  try {
    const supabase = getSupabase();
    // Delete dummy 6B students that are not in official list
    const { data: current6B } = await supabase.from('students').select('*').eq('class_id', '6B');
    if (current6B) {
      for (const s of current6B) {
        if (!REAL_6B_NAMES.has((s.name || '').toUpperCase())) {
          await supabase.from('students').delete().eq('id', s.id);
        }
      }
    }
  } catch (e) {}

  for (const s of SISWA_6B_LIST) {
    await saveStudentToSupabase({
      id: s.id,
      nis: s.nis,
      name: s.name,
      class_id: s.class_id,
      gender: s.gender,
    });
  }
}
