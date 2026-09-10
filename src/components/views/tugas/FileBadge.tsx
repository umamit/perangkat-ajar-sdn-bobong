import React from 'react';

interface FileBadgeProps {
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
  className?: string;
}

export function getFileBadgeInfo(target: string, customType?: string) {
  const type = customType || (
    target.match(/\.pdf$/i) ? 'pdf' :
    target.match(/\.(docx|doc)$/i) ? 'word' :
    target.match(/\.(xlsx|xls|csv)$/i) ? 'excel' :
    target.match(/\.(pptx|ppt)$/i) ? 'ppt' :
    target.match(/\.(zip|rar|7z)$/i) ? 'zip' : 'file'
  );

  switch (type) {
    case 'pdf':
      return {
        label: 'PDF',
        icon: 'ri-file-pdf-2-line',
        badgeClass: 'bg-rose-50/90 text-rose-700 border-rose-200/80 hover:bg-rose-100',
        iconColor: 'text-rose-600'
      };
    case 'word':
      return {
        label: 'Word',
        icon: 'ri-file-word-2-line',
        badgeClass: 'bg-blue-50/90 text-blue-700 border-blue-200/80 hover:bg-blue-100',
        iconColor: 'text-blue-600'
      };
    case 'excel':
      return {
        label: 'Excel',
        icon: 'ri-file-excel-2-line',
        badgeClass: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100',
        iconColor: 'text-emerald-600'
      };
    case 'ppt':
      return {
        label: 'PPT',
        icon: 'ri-file-ppt-2-line',
        badgeClass: 'bg-orange-50/90 text-orange-700 border-orange-200/80 hover:bg-orange-100',
        iconColor: 'text-orange-600'
      };
    case 'zip':
      return {
        label: 'ZIP',
        icon: 'ri-file-zip-line',
        badgeClass: 'bg-purple-50/90 text-purple-700 border-purple-200/80 hover:bg-purple-100',
        iconColor: 'text-purple-600'
      };
    default:
      return {
        label: 'Berkas',
        icon: 'ri-file-line',
        badgeClass: 'bg-slate-50/90 text-slate-700 border-slate-200/80 hover:bg-slate-100',
        iconColor: 'text-slate-600'
      };
  }
}

export function FileBadge({ fileName, fileUrl, fileType, className = '' }: FileBadgeProps) {
  if (!fileUrl && !fileName) return null;
  const target = fileName || fileUrl || '';
  const info = getFileBadgeInfo(target, fileType);

  return (
    <a
      href={fileUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border shadow-xs transition-all ${info.badgeClass} ${className}`}
      title={fileName || 'Unduh Berkas Soal'}
    >
      <i className={`${info.icon} ${info.iconColor} text-xs`} />
      <span>{info.label}</span>
      {fileName && (
        <span className="max-w-[110px] truncate text-[10px] opacity-80">
          ({fileName})
        </span>
      )}
      <i className="ri-external-link-line text-[10px] opacity-70 ml-0.5" />
    </a>
  );
}
