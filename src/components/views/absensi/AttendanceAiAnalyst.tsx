"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { AttendanceAiDialog } from "./AttendanceAiDialog";

export function AttendanceAiAnalyst({ selectedClass }: { selectedClass: string }) {
  const { attendance, students, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const classStudents = students.filter(s => s.classId === selectedClass);
  const flagged = classStudents.map(student => {
    const studentAbsences = attendance.filter(a => a.student_id === student.id && a.class_id === selectedClass);
    const sakit = studentAbsences.filter(a => a.status === "Sakit").length;
    const izin = studentAbsences.filter(a => a.status === "Izin").length;
    const alpa = studentAbsences.filter(a => a.status === "Alpa").length;
    return { student, sakit, izin, alpa, total: sakit + izin + alpa };
  }).filter(item => item.total >= 3);

  const handleAnalystClick = async (studentName: string, classId: string, details: string) => {
    setLoading(true); setAiReport(null);
    setSelectedStudent({ name: studentName, classId, details });
    try {
      const res = await fetch("/api/ai/groq", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: studentName, mode: "rekomendasi_absensi", grade: "Kelas " + classId, details })
      });
      const data = await res.json();
      if (data.result) { setAiReport(data.result); showToast("Analisis absensi berhasil!", "success"); }
      else if (data.fallbackResponse) { setAiReport(data.fallbackResponse); showToast("Menampilkan draf bawaan", "info"); }
      else { showToast(data.error || "Gagal memanggil AI", "error"); }
    } catch { showToast("Gagal memproses analisis AI", "error"); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    showToast("Teks analisis & draf surat berhasil disalin!", "success");
  };

  if (flagged.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
          <i className="ri-error-warning-line text-base text-amber-600 animate-pulse" /> Deteksi Dini Absensi Siswa (Peringatan AI)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-3">
        <p className="text-amber-700 font-medium">Ditemukan {flagged.length} siswa dengan ketidakhadiran &ge; 3 kali di Kelas {selectedClass}.</p>
        <div className="space-y-2">
          {flagged.map(({ student, sakit, izin, alpa, total }) => {
            const detailsText = `${sakit} Sakit, ${izin} Izin, ${alpa} Alpa (Total: ${total} Hari)`;
            return (
              <div key={student.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">{student.name}</span>
                  <span className="text-[10px] text-amber-600 font-bold block mt-0.5">{detailsText}</span>
                </div>
                <Button size="sm" onClick={() => handleAnalystClick(student.name, student.classId, detailsText)} className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] h-7 px-3 gap-1">
                  <i className="ri-magic-line" /> Rekomendasi AI
                </Button>
              </div>
            );
          })}
        </div>
        <AttendanceAiDialog selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} loading={loading} aiReport={aiReport} handleCopy={handleCopy} />
      </CardContent>
    </Card>
  );
}
