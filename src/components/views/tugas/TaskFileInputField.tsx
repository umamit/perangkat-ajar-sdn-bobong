import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFileBadgeInfo } from "./FileBadge";

export function TaskFileInputField({ selectedFile, setSelectedFile }: any) {
  const fileInfo = selectedFile ? getFileBadgeInfo(selectedFile.name) : null;
  return (
    <div className="space-y-1.5 text-xs text-left">
      <Label htmlFor="taskFile" className="font-bold text-slate-600 flex items-center justify-between">
        <span>Unggah Berkas Dokumen (Opsional)</span>
        <span className="text-[10px] text-slate-400 font-normal">Word, PDF, Excel, PPT, ZIP (Max 20MB)</span>
      </Label>
      <Input
        id="taskFile"
        type="file"
        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.zip,.rar,.7z"
        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
        className="h-10 rounded-xl pt-2 file:mr-2 file:py-0 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold"
      />
      {fileInfo && selectedFile && (
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <i className={fileInfo.icon + " " + fileInfo.iconColor + " text-sm"} />
          <span className="font-bold text-slate-700">{fileInfo.label}:</span>
          <span className="truncate max-w-[200px]">{selectedFile.name}</span>
          <span className="text-[10px] text-slate-400 ml-auto">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
        </div>
      )}
    </div>
  );
}
