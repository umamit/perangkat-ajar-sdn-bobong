import React from "react";
import { Button } from "@/components/ui/button";
import { LkpdCardItem } from "./lkpd/LkpdCardItem";
import { AddLkpdModal } from "./lkpd/AddLkpdModal";
import { useLkpdManagement } from "./lkpd/useLkpdManagement";

export function LkpdView() {
  const {
    filteredLkpd, classes, currentTeacher, isKepsek, selectedClass,
    setSelectedClass, showModal, setShowModal, saving, form, setForm,
    setSelectedFile, handleDelete, handleDownloadPdf, handleSave
  } = useLkpdManagement();

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Lembar Kerja Peserta Didik (LKPD)
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Kelola aktivitas lembar kerja terstruktur Kurikulum Merdeka SD Negeri Bobong
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          >
            <option value="all">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="gap-1.5 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105"
          >
            <i className="ri-add-line" /> Buat LKPD
          </Button>
        </div>
      </div>

      {filteredLkpd.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <i className="ri-article-line text-2xl" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">Belum Ada LKPD</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Klik tombol &quot;Buat LKPD&quot; untuk menyusun lembar aktivitas peserta didik baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLkpd.map((item) => {
            const cls = classes.find((c) => c.id === item.classId);
            const classNameTitle = cls?.name || `Kelas ${item.classId}`;
            const isOwner = isKepsek || item.teacherNip === currentTeacher?.nip;
            return (
              <LkpdCardItem
                key={item.id}
                item={item}
                classNameTitle={classNameTitle}
                isOwner={isOwner}
                onDelete={handleDelete}
                onDownloadPdf={handleDownloadPdf}
              />
            );
          })}
        </div>
      )}

      <AddLkpdModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        classes={classes}
        form={form}
        setForm={setForm}
        saving={saving}
        onSave={handleSave}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
}
