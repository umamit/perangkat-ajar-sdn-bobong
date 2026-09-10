import React from "react";
import { getFileBadgeInfo } from "@/components/views/tugas/FileBadge";

interface PublicUploadFileInputProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export function PublicUploadFileInput({
  selectedFile,
  setSelectedFile,
}: PublicUploadFileInputProps) {
  const fileInfo = selectedFile ? getFileBadgeInfo(selectedFile.name) : null;

  return (
    <div className="space-y-1.5 text-xs text-left">
      <label className="font-bold text-slate-700 flex justify-between items-center">
        <span>Unggah Berkas Soal *</span>
        <span className="text-[10px] text-slate-400 font-normal">Word, PDF, Excel, PPT, ZIP (Maks 20MB)</span>
      </label>
      <input
        type="file"
        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.zip,.rar,.7z"
        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
        required
        className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary"
      />
      {fileInfo && selectedFile && (
        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <i className={`${fileInfo.icon} ${fileInfo.iconColor} text-base`} />
          <span className="font-bold">{fileInfo.label}:</span>
          <span className="truncate max-w-[220px] font-medium">{selectedFile.name}</span>
          <span className="text-[10px] text-slate-400 ml-auto font-semibold">
            ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
          </span>
        </div>
      )}
    </div>
  );
}
