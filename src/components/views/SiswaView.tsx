"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AddStudentModal } from "./siswa/AddStudentModal";
import { EditStudentModal } from "./siswa/EditStudentModal";
import { ImportStudentModal } from "./siswa/ImportStudentModal";
import { StudentTable } from "./siswa/StudentTable";
import { StudentHeader } from "./siswa/StudentHeader";
import { CounselingModal } from "./siswa/CounselingModal";
import { SyncDapodikModal } from "./siswa/SyncDapodikModal";
import { useStudentManagement } from "./siswa/useStudentManagement";

export function SiswaView() {
  const m = useStudentManagement();

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <StudentHeader
        handleExportExcel={m.handleExportExcel}
        handleDownloadPDF={m.handleDownloadPDF}
        isKepsek={m.isKepsek}
        setShowAddModal={m.setShowAddModal}
        setShowImportModal={m.setShowImportModal}
        setShowSyncModal={m.setShowSyncModal}
        search={m.search}
        setSearch={m.setSearch}
        lockedClass={m.lockedClass}
        selectedClass={m.selectedClass}
        setSelectedClass={m.setSelectedClass}
        classes={m.classes}
        students={m.students}
        normalizeClass={m.normalizeClass}
      />

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <StudentTable
            filteredStudents={m.filteredStudents}
            isKepsek={m.isKepsek}
            handleEditClick={m.handleEditClick}
            handleDelete={m.handleDelete}
            handleCounselingClick={m.handleCounselingClick}
            isLoading={m.isLoading}
          />
        </CardContent>
      </Card>

      <AddStudentModal
        isOpen={m.showAddModal}
        onOpenChange={m.setShowAddModal}
        saving={m.saving}
        classes={m.classes}
        addForm={m.addForm}
        setAddForm={m.setAddForm}
        onSubmit={m.handleAddSubmit}
      />
      <EditStudentModal
        isOpen={m.showEditModal}
        onOpenChange={m.setShowEditModal}
        saving={m.saving}
        classes={m.classes}
        editForm={m.editForm}
        setEditForm={m.setEditForm}
        onSubmit={m.handleEditSubmit}
      />
      <ImportStudentModal
        isOpen={m.showImportModal}
        onOpenChange={m.setShowImportModal}
        classes={m.classes}
        selectedClass={m.selectedClass}
        onImport={m.handleDirectImport}
      />
      <CounselingModal
        isOpen={m.showCounselingModal}
        onOpenChange={m.setShowCounselingModal}
        student={m.selectedCounselingStudent}
      />
      <SyncDapodikModal
        isOpen={m.showSyncModal}
        onClose={() => m.setShowSyncModal(false)}
        classes={m.classes}
        showToast={m.showToast}
        syncData={m.syncData}
      />
    </div>
  );
}
