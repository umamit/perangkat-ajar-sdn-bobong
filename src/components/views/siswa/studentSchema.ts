import * as z from 'zod';

export const studentSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  nis: z.string().optional(),
  nisn: z.string().regex(/^\d{10}$/, 'NISN harus terdiri dari 10 digit angka').optional().or(z.literal('')),
  nik: z.string().regex(/^\d{16}$/, 'NIK harus terdiri dari 16 digit angka').optional().or(z.literal('')),
  classId: z.string(),
  gender: z.enum(['L', 'P']),
  birthInfo: z.string().optional(),
  parentName: z.string().optional(),
  religion: z.string().optional(),
  parentJob: z.string().optional(),
  address: z.string().optional(),
  admissionYear: z.string().regex(/^\d{4}$/, 'Tahun masuk harus 4 digit angka (misal: 2023)').optional().or(z.literal(''))
});

export const initialStudentForm = {
  name: '',
  classId: '1A',
  gender: 'L' as 'L' | 'P',
  nis: '',
  nisn: '',
  nik: '',
  birthInfo: '',
  parentName: '',
  religion: '',
  parentJob: '',
  address: '',
  admissionYear: ''
};
