import { saveStudentToSupabase, getSupabase } from '@/lib/supabase';

export const SISWA_6B_LIST = [
  { id: '6b000000-0000-0000-0000-000000000001', nis: '20266B01', name: 'ARBAIN ASLUN', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000002', nis: '20266B02', name: 'APRILIA PURNAMA WISRAN', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6b000000-0000-0000-0000-000000000003', nis: '20266B03', name: 'ALYA NAFISA', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6b000000-0000-0000-0000-000000000004', nis: '20266B04', name: 'FEBRIANTI', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6b000000-0000-0000-0000-000000000005', nis: '20266B05', name: 'SAHRIL', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000006', nis: '20266B06', name: 'SUMAYAH KHAIRUNNISA', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6b000000-0000-0000-0000-000000000007', nis: '20266B07', name: 'FIKRI HAMID', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000008', nis: '20266B08', name: 'FIRZAH SILARATUBUN', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6b000000-0000-0000-0000-000000000009', nis: '20266B09', name: 'MIVTAHUL FITRA RAMADANI', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000010', nis: '20266B10', name: 'MOH. KAMRIN', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000011', nis: '20266B11', name: 'NUR ANNISA AZZAHRA TUANGKE', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6b000000-0000-0000-0000-000000000012', nis: '20266B12', name: 'MARDANA ALI', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000013', nis: '20266B13', name: 'RAFKAH HAMAZI', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000014', nis: '20266B14', name: 'HARNIATI', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6b000000-0000-0000-0000-000000000015', nis: '20266B15', name: 'LIANA RAMADANI M. KASIM', class_id: '6B', classId: '6B', gender: 'P' },
  { id: '6b000000-0000-0000-0000-000000000016', nis: '20266B16', name: 'RAHMAT ALI RISKY', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000017', nis: '20266B17', name: 'ZAKLI ILYAS', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000018', nis: '20266B18', name: 'ARIL ARDIANSYAH', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000019', nis: '20266B19', name: 'AKBAR LA UJA', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000020', nis: '20266B20', name: 'BILAL HIDAYAH GERMAN', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000021', nis: '20266B21', name: 'ZULFITRAH HARDI', class_id: '6B', classId: '6B', gender: 'L' },
  { id: '6b000000-0000-0000-0000-000000000022', nis: '20266B22', name: 'JUMRI', class_id: '6B', classId: '6B', gender: 'L' },
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
      classId: s.classId,
      gender: s.gender,
    });
  }
}
