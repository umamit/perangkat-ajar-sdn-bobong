"use client";

import React from "react";
import { EraporHeader } from "./erapor/EraporHeader";
import { EraporSheetView } from "./erapor/EraporSheetView";
import { useEraporManagement } from "./erapor/useEraporManagement";

export function EraporView() {
  const {
    classes, lockedClass, selectedClass, setSelectedClass,
    classStudents, selectedStudentId, setSelectedStudentId,
    raporData, downloading,
    handleUpdateNotes, handlePrintCurrentPDF, handleNextStudent, handlePrevStudent
  } = useEraporManagement();

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800 pb-10">
      <EraporHeader
        classes={classes}
        lockedClass={lockedClass}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classStudents={classStudents}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        downloading={downloading}
        onPrintPDF={handlePrintCurrentPDF}
        onPrevStudent={handlePrevStudent}
        onNextStudent={handleNextStudent}
      />

      {!raporData ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-primary flex items-center justify-center mb-3">
            <i className="ri-file-paper-2-line text-2xl" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">Pilih Siswa untuk Menampilkan e-Rapor</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Silakan pilih kelas dan nama peserta didik pada menu di atas untuk melihat dan mencetak Lembar Hasil Belajar Kurikulum Merdeka.
          </p>
        </div>
      ) : (
        <EraporSheetView
          rapor={raporData}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
    </div>
  );
}
