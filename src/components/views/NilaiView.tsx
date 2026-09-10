"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RaporAiDescriptor } from "./nilai/RaporAiDescriptor";
import { GradeTable } from "./nilai/GradeTable";
import { GradeAnalysis } from "./nilai/GradeAnalysis";
import { GradeHeader } from "./nilai/GradeHeader";
import { useGradeManagement, SUBJECTS } from "./nilai/useGradeManagement";

export function NilaiView() {
  const g = useGradeManagement();

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <GradeHeader
        selectedSubject={g.selectedSubject}
        onExportExcel={g.handleExportExcel}
        onDownloadPDF={g.handleDownloadPDF}
      />

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => g.setActiveTab("input")}
          className={"px-4 py-2.5 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 " + (
            g.activeTab === "input" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          <i className="ri-edit-line" /> Tabel Input Nilai
        </button>
        <button
          onClick={() => g.setActiveTab("analisis")}
          className={"px-4 py-2.5 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 " + (
            g.activeTab === "analisis" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          <i className="ri-bar-chart-2-line" /> Analisis & Peta Nilai
        </button>
      </div>

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 bg-white/35">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Filter Kelas:</label>
              {g.lockedClass ? (
                <Badge variant="default" className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  Kelas {g.lockedClass} (Binaan)
                </Badge>
              ) : (
                <select
                  value={g.selectedClass}
                  onChange={e => g.setSelectedClass(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ALL">Semua Kelas ({g.students.length} Siswa)</option>
                  {g.classes.map(c => {
                    const count = g.students.filter(s => g.normalizeClass(s.classId) === g.normalizeClass(c.id)).length;
                    return <option key={c.id} value={c.id}>{c.name} ({count} Siswa)</option>;
                  })}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Mata Pelajaran:</label>
              {g.isGuruMapel ? (
                <Badge variant="default" className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  {g.selectedSubject}
                </Badge>
              ) : (
                <select
                  value={g.selectedSubject}
                  onChange={e => g.setSelectedSubject(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SUBJECTS.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                </select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {g.activeTab === "input" ? (
            <GradeTable
              filteredStudents={g.filteredStudents}
              getStudentScore={g.getStudentScore}
              onGradeChange={g.handleGradeChange}
              onOpenAiDialog={g.setAiDialog}
            />
          ) : (
            <div className="p-5">
              <GradeAnalysis
                filteredStudents={g.filteredStudents}
                selectedSubject={g.selectedSubject}
                grades={g.grades}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <RaporAiDescriptor
        open={g.aiDialog.open}
        onOpenChange={open => g.setAiDialog(prev => ({ ...prev, open }))}
        studentName={g.aiDialog.studentName}
        studentClass={g.aiDialog.studentClass}
        subject={g.selectedSubject}
        score={g.aiDialog.score}
      />
    </div>
  );
}
