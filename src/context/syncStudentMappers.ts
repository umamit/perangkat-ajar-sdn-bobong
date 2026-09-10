import { Student } from "@/types";
import { verifyAndCleanClass6Students } from "@/lib/syncHelpers";

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

export function mapStudents(raw: RawStudent[]): Student[] {
  const mapped = raw.map((s): Student => ({
    id: s.id,
    nis: s.nis || s.id,
    name: s.name,
    classId: s.class_id,
    gender: s.gender || "L",
    scoreFormatif: s.score_formatif || 0,
    scoreSumatif: s.score_sumatif || 0,
    scoreSts: s.score_sts || 0,
    scoreSas: s.score_sas || 0,
    nisn: s.nisn || "",
    nik: s.nik || "",
    birthInfo: s.tempat_tanggal_lahir || "",
    parentName: s.nama_orang_tua || "",
    religion: s.agama || "",
    parentJob: s.pekerjaan_orang_tua || "",
    address: s.alamat || "",
    admissionYear: s.tahun_masuk || ""
  }));
  return verifyAndCleanClass6Students(mapped);
}
