import { saveStudentToSupabase } from "@/lib/supabase";

export const matchClassId = (dapodikRombel: string, classes: any[]) => {
  if (!dapodikRombel) return classes[0]?.id || "1A";
  const norm = dapodikRombel.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const matched = classes.find(c => {
    const cId = c.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const cName = c.name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    return norm.includes(cId) || norm.includes(cName) || cId.includes(norm);
  });
  return matched ? matched.id : (classes[0]?.id || "1A");
};

export const mapDapodikRowToStudent = (s: any, classes: any[]) => {
  const id = s.peserta_didik_id || s.id || crypto.randomUUID();
  const tempat = s.tempat_lahir || s.tempatLahir || "";
  const tanggal = s.tanggal_lahir || s.tanggalLahir || "";
  const birthInfo = tempat && tanggal ? (tempat + ", " + tanggal) : (tempat || tanggal || undefined);
  return {
    id,
    nis: s.nipd || s.nis || id,
    name: s.nama || s.name || "Siswa Tanpa Nama",
    classId: matchClassId(s.nama_rombel || s.rombel || s.classId, classes),
    gender: s.jenis_kelamin === "P" || s.gender === "P" ? "P" : "L",
    nisn: s.nisn || undefined,
    nik: s.nik || undefined,
    birthInfo,
    parentName: s.nama_ibu_kandung || s.namaIbu || s.nama_ayah || s.namaAyah || undefined,
    religion: s.agama || s.religion || "Islam",
    parentJob: s.pekerjaan_ayah || s.pekerjaan_ibu || s.parentJob || undefined,
    address: s.alamat_jalan || s.alamat || s.address || undefined,
    admissionYear: s.tahun_masuk || s.admissionYear || new Date().getFullYear().toString(),
    scoreFormatif: 0, scoreSumatif: 0, scoreSts: 0, scoreSas: 0
  };
};

export async function syncDapodikToSupabase(previewData: any[], syncData: () => Promise<void>) {
  let count = 0;
  for (const s of previewData) {
    await saveStudentToSupabase(s);
    count++;
  }
  await syncData();
  return count;
}
