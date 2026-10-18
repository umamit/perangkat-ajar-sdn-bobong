export interface SubjectGradeRapor {
  no: number;
  subject: string;
  finalScore: number;
  competencyHigh: string;
  competencyGuidance: string;
  fullDescription: string;
}

export interface StudentRaporData {
  studentId: string;
  name: string;
  nis: string;
  nisn: string;
  classId: string;
  className: string;
  phase: string;
  semester: string;
  academicYear: string;
  schoolName: string;
  npsn: string;
  schoolAddress: string;
  subjects: SubjectGradeRapor[];
  attendance: {
    sakit: number;
    izin: number;
    alpa: number;
  };
  homeroomNotes: string;
  homeroomTeacherName: string;
  homeroomTeacherNip: string;
  headmasterName: string;
  headmasterNip: string;
}
