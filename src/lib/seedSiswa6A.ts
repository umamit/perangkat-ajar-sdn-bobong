import { saveStudentToSupabase, getSupabase } from '@/lib/supabase';

export const SISWA_6A_LIST = [
  { id: '6A-01', nis: '20266A01', name: 'ALFA GEL TANGA', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-02', nis: '20266A02', name: 'AHMAD ALIABDO NURDIN', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-03', nis: '20266A03', name: 'ARGA UMAMIT', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-04', nis: '20266A04', name: 'AINUN ABAL', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-05', nis: '20266A05', name: 'DINDA KIRANA', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-06', nis: '20266A06', name: 'ECE ANI', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-07', nis: '20266A07', name: 'FEBRYAN DWI RAHMAN WICAKSONO', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-08', nis: '20266A08', name: 'MINAR HAYATI', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-09', nis: '20266A09', name: 'NURUL AZZHARA MUHAMMAD', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-10', nis: '20266A10', name: 'M. ALFADRI JUFRI', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-11', nis: '20266A11', name: 'M. ALIANSYAH TIDORE', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-12', nis: '20266A12', name: 'MUH. IBNU ABDILLAH UMASANGAJI', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-13', nis: '20266A13', name: 'MUSRIN', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-14', nis: '20266A14', name: 'SUCI RAMADHANI', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-15', nis: '20266A15', name: 'JALI SAMSUDIN', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-16', nis: '20266A16', name: 'WA ODE ARANTIKA', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-17', nis: '20266A17', name: 'KHODIJA NAILA ALFARAFISYA', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-18', nis: '20266A18', name: 'IDUL FIKRI', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-19', nis: '20266A19', name: 'REZKY FEBIAN SYAFIUDIN', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-20', nis: '20266A20', name: 'MUHAMMAD RAHMAN', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-21', nis: '20266A21', name: 'MENTARI', class_id: '6A', classId: '6A', gender: 'P' },
  { id: '6A-22', nis: '20266A22', name: 'MUH. IDRIS', class_id: '6A', classId: '6A', gender: 'L' },
  { id: '6A-23', nis: '20266A23', name: 'M. ABDULLAH FAQIH UMASUGI', class_id: '6A', classId: '6A', gender: 'L' },
];

export const REAL_6A_NAMES = new Set(SISWA_6A_LIST.map(s => s.name.toUpperCase()));

export async function seedSiswa6AToSupabase() {
  try {
    const supabase = getSupabase();
    // Delete dummy 6A students that are not in official list
    const { data: current6A } = await supabase.from('students').select('*').eq('class_id', '6A');
    if (current6A) {
      for (const s of current6A) {
        if (!REAL_6A_NAMES.has((s.name || '').toUpperCase())) {
          await supabase.from('students').delete().eq('id', s.id);
        }
      }
    }
  } catch (e) {}

  for (const s of SISWA_6A_LIST) {
    await saveStudentToSupabase({
      id: s.id,
      nis: s.nis,
      name: s.name,
      class_id: s.class_id,
      gender: s.gender,
    });
  }
}
