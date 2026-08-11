import { Teacher, Student, JournalEntry, ClassInfo, TaskItem, CounselingLog, ModuleAjar } from '@/types';
import { verifyAndCleanClass6Students } from '@/lib/syncHelpers';

// Raw Supabase row shapes (snake_case dari DB)
interface RawTeacher { nip: string; name: string; role?: string; subject?: string; password?: string; avatar_url?: string; }
interface RawStudent {
  id: string;
  nis?: string;
  name: string;
  class_id: string;
  gender?: string;
  score_formatif?: number;
  score_sumatif?: number;
  score_sts?: number;
  score_sas?: number;
  nisn?: string;
  nik?: string;
  tempat_tanggal_lahir?: string;
  nama_orang_tua?: string;
  agama?: string;
  pekerjaan_orang_tua?: string;
  alamat?: string;
  tahun_masuk?: string;
}
interface RawClass { id: string; name: string; phase?: string; room?: string; }
interface RawJournal { id: string; date: string; time_slot?: string; class_id: string; topic: string; notes?: string; attendance_summary?: string; }
interface RawAssignment { id: string; title: string; class_id: string; due_date: string; status?: string; }

export const ADMIN_NIP = '199610272019032006';
export const LEGACY_NIP = '197508201999031002';

export const defaultAdminTeacher: Teacher = {
  nip: ADMIN_NIP,
  name: 'Husnita Usman, M.Pd',
  role: 'Kepala Sekolah / Executive Admin',
  subject: 'Bahasa Inggris & Manajemen Sekolah',
  avatar: '/assets/logo-sdn-bobong.png'
};

export function mapTeachers(raw: RawTeacher[]): Teacher[] {
  const filtered = raw
    .filter(t => t.nip !== LEGACY_NIP)
    .map((t): Teacher => {
      if (t.nip === ADMIN_NIP) {
        return { ...defaultAdminTeacher, password: t.password, avatar: t.avatar_url || defaultAdminTeacher.avatar };
      }
      return {
        nip: t.nip,
        name: t.name,
        role: t.role || 'Guru Mata Pelajaran',
        subject: t.subject || 'Bahasa Inggris',
        password: t.password,
        avatar: t.avatar_url || '/assets/logo-sdn-bobong.png'
      };
    });

  const hasAdmin = filtered.some(t => t.nip === ADMIN_NIP);
  if (!hasAdmin) filtered.unshift(defaultAdminTeacher);
  return filtered;
}

export function mapStudents(raw: RawStudent[]): Student[] {
  const mapped = raw.map((s): Student => ({
    id: s.id,
    nis: s.nis || s.id,
    name: s.name,
    classId: s.class_id,
    gender: s.gender || 'L',
    scoreFormatif: s.score_formatif || 0,
    scoreSumatif: s.score_sumatif || 0,
    scoreSts: s.score_sts || 0,
    scoreSas: s.score_sas || 0,
    nisn: s.nisn || '',
    nik: s.nik || '',
    birthInfo: s.tempat_tanggal_lahir || '',
    parentName: s.nama_orang_tua || '',
    religion: s.agama || '',
    parentJob: s.pekerjaan_orang_tua || '',
    address: s.alamat || '',
    admissionYear: s.tahun_masuk || ''
  }));
  return verifyAndCleanClass6Students(mapped);
}

export function mapClasses(raw: RawClass[]): ClassInfo[] {
  const classMap = new Map<string, ClassInfo>();
  raw.forEach(c => {
    if (c && c.id && !classMap.has(c.id)) {
      classMap.set(c.id, { id: c.id, name: c.name, phase: c.phase || 'Fase A', room: c.room || 'Ruang Kelas' });
    }
  });
  return Array.from(classMap.values());
}

export function mapJournals(raw: RawJournal[]): JournalEntry[] {
  return raw.map((j): JournalEntry => ({
    id: j.id,
    date: j.date,
    time: j.time_slot || '',
    classId: j.class_id,
    topic: j.topic,
    notes: j.notes || '',
    attendance: j.attendance_summary || ''
  }));
}

export function mapAssignments(raw: RawAssignment[]): TaskItem[] {
  return raw.map((a): TaskItem => ({
    id: a.id,
    title: a.title,
    classId: a.class_id,
    dueDate: a.due_date,
    type: 'Tugas',
    status: a.status || 'Aktif',
    description: ''
  }));
}

interface RawCounselingLog {
  id: string;
  student_id: string;
  date: string;
  category: 'Bimbingan' | 'Konseling' | 'Kunjungan Rumah' | 'Telepon Orang Tua';
  notes: string;
  follow_up?: string;
  teacher_nip?: string;
  created_at?: string;
}

export function mapCounselingLogs(raw: RawCounselingLog[]): CounselingLog[] {
  return raw.map((l): CounselingLog => ({
    id: l.id,
    studentId: l.student_id,
    date: l.date,
    category: l.category,
    notes: l.notes,
    followUp: l.follow_up || '',
    teacherNip: l.teacher_nip || '',
    created_at: l.created_at
  }));
}

export interface RawModule {
  id: string;
  grade?: string;
  phase?: string;
  title: string;
  tp?: string;
  atp?: string;
  cp?: string;
  duration?: string;
  teacher_nip?: string;
  file_url?: string;
  class_id?: string;
}

export function mapModules(raw: RawModule[]): ModuleAjar[] {
  return raw.map((m): ModuleAjar => ({
    id: m.id,
    grade: m.grade || '',
    phase: m.phase || 'Fase A',
    title: m.title,
    tp: m.tp || '',
    atp: m.atp || '',
    cp: m.cp || '',
    target: '',
    duration: m.duration || '2 x 35 Menit',
    materials: [],
    steps: [],
    assessment: '',
    teacherNip: m.teacher_nip || '',
    fileUrl: m.file_url || '',
    classId: m.class_id || '',
    file_url: m.file_url || '',
    teacher_nip: m.teacher_nip || '',
    class_id: m.class_id || ''
  }));
}
