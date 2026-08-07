import { Student } from '@/types';
import { SISWA_6B_LIST, REAL_6B_NAMES, seedSiswa6BToSupabase } from './seedSiswa6B';
import { SISWA_6A_LIST, REAL_6A_NAMES, seedSiswa6AToSupabase } from './seedSiswa6A';

export function verifyAndCleanClass6Students(rawStudents: Student[]): Student[] {
  // Purge dummy 6A & 6B students that don't match official list
  const loadedStudents = rawStudents.filter((s: any) => {
    if (s.classId === '6B' || s.classId === '6b') {
      return REAL_6B_NAMES.has((s.name || '').toUpperCase());
    }
    if (s.classId === '6A' || s.classId === '6a') {
      return REAL_6A_NAMES.has((s.name || '').toUpperCase());
    }
    return true;
  });

  // Merge official 6A & 6B students if missing
  const existingIds = new Set(loadedStudents.map((s: any) => s.id));
  const missing6B = SISWA_6B_LIST.filter(s => !existingIds.has(s.id));
  const missing6A = SISWA_6A_LIST.filter(s => !existingIds.has(s.id));

  if (missing6B.length > 0 || missing6A.length > 0 || rawStudents.length !== loadedStudents.length) {
    if (missing6B.length > 0 || rawStudents.some((s: any) => s.classId === '6B' && !REAL_6B_NAMES.has((s.name || '').toUpperCase()))) {
      seedSiswa6BToSupabase();
    }
    if (missing6A.length > 0 || rawStudents.some((s: any) => s.classId === '6A' && !REAL_6A_NAMES.has((s.name || '').toUpperCase()))) {
      seedSiswa6AToSupabase();
    }

    const officialAdditions = [
      ...missing6B.map(s => ({ id: s.id, nis: s.nis, name: s.name, classId: s.classId, gender: s.gender, scoreFormatif: 0, scoreSumatif: 0, scoreSts: 0, scoreSas: 0 })),
      ...missing6A.map(s => ({ id: s.id, nis: s.nis, name: s.name, classId: s.classId, gender: s.gender, scoreFormatif: 0, scoreSumatif: 0, scoreSts: 0, scoreSas: 0 }))
    ];

    return [...loadedStudents, ...officialAdditions];
  }

  return loadedStudents;
}
