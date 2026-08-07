import { Teacher, Student, JournalEntry } from '@/types';
import { verifyAndCleanClass6Students } from '@/lib/syncHelpers';

export const ADMIN_NIP = '199610272019032006';
export const LEGACY_NIP = '197508201999031002';

export const defaultAdminTeacher: Teacher = {
  nip: ADMIN_NIP,
  name: 'Husnita Usman, M.Pd',
  role: 'Kepala Sekolah / Executive Admin',
  subject: 'Bahasa Inggris & Manajemen Sekolah',
  password: 'kepseksdnbobong',
  avatar: '/assets/logo-sdn-bobong.png'
};

export function mapTeachers(raw: any[]): Teacher[] {
  const filtered = raw
    .filter((t: any) => t.nip !== LEGACY_NIP)
    .map((t: any): Teacher => {
      if (t.nip === ADMIN_NIP) {
        return { ...defaultAdminTeacher, password: t.password || 'kepseksdnbobong', avatar: t.avatar_url || defaultAdminTeacher.avatar };
      }
      return {
        nip: t.nip,
        name: t.name,
        role: t.role || 'Guru Mata Pelajaran',
        subject: t.subject || 'Bahasa Inggris',
        password: t.password || 'sdnbobong',
        avatar: t.avatar_url || '/assets/logo-sdn-bobong.png'
      };
    });

  const hasAdmin = filtered.some((t: any) => t.nip === ADMIN_NIP);
  if (!hasAdmin) filtered.unshift(defaultAdminTeacher);
  return filtered;
}

export function mapStudents(raw: any[]): Student[] {
  const mapped = raw.map((s: any): Student => ({
    id: s.id,
    nis: s.nis || s.id,
    name: s.name,
    classId: s.class_id,
    gender: s.gender || 'L',
    scoreFormatif: s.score_formatif || 0,
    scoreSumatif: s.score_sumatif || 0,
    scoreSts: s.score_sts || 0,
    scoreSas: s.score_sas || 0
  }));
  return verifyAndCleanClass6Students(mapped);
}

export function mapClasses(raw: any[]): any[] {
  const classMap = new Map<string, any>();
  raw.forEach((c: any) => {
    if (c && c.id && !classMap.has(c.id)) {
      classMap.set(c.id, { id: c.id, name: c.name, phase: c.phase || 'Fase A', room: c.room || 'Ruang Kelas' });
    }
  });
  return Array.from(classMap.values());
}

export function mapJournals(raw: any[]): JournalEntry[] {
  return raw.map((j: any): JournalEntry => ({
    id: j.id,
    date: j.date,
    time: j.time_slot || '',
    classId: j.class_id,
    topic: j.topic,
    notes: j.notes || '',
    attendance: j.attendance_summary || ''
  }));
}

export function mapAssignments(raw: any[]): any[] {
  return raw.map((a: any) => ({
    id: a.id,
    title: a.title,
    classId: a.class_id,
    dueDate: a.due_date,
    status: a.status || 'Aktif'
  }));
}
