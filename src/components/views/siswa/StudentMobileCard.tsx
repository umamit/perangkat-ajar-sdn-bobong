'use client';

import React from 'react';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';

interface StudentMobileCardProps {
  student: Student;
  idx: number;
  isExpanded: boolean;
  toggleExpand: (id: string) => void;
  isKepsek: boolean;
  handleEditClick: (student: Student) => void;
  handleDelete: (id: string, name: string) => void;
  formatAdmissionYear: (dateStr: string) => string;
  handleCounselingClick: (student: Student) => void;
}

export function StudentMobileCard({
  student,
  idx,
  isExpanded,
  toggleExpand,
  isKepsek,
  handleEditClick,
  handleDelete,
  formatAdmissionYear,
  handleCounselingClick
}: StudentMobileCardProps) {
  const s = student;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 transition-all">
      <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpand(s.id)}>
        <div className="flex gap-2.5 items-center">
          <span className="text-xs font-bold text-slate-400 bg-slate-50 w-5 h-5 rounded-full flex items-center justify-center">
            {idx + 1}
          </span>
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{s.name}</h4>
            <p className="text-[10px] text-slate-455 font-bold mt-0.5">NIS: {s.nis || '-'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            s.gender === 'L' ? 'bg-cyan-50 text-cyan-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {s.gender === 'L' ? 'L' : 'P'}
          </span>
          <i className={`text-slate-400 text-lg transition-transform ${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 pt-2.5 border-t border-slate-105 space-y-2.5 text-xs text-slate-600 animate-fade-in">
          <div className="space-y-2">
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">NIS</span>
              <span className="font-bold text-slate-700">{s.nis || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">NISN</span>
              <span className="font-bold text-slate-700">{s.nisn || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">NIK</span>
              <span className="font-bold text-slate-700">{s.nik || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">Nama Siswa</span>
              <span className="font-bold text-slate-700">{s.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">Tempat Tanggal Lahir</span>
              <span className="font-bold text-slate-700">{s.birthInfo || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">Jenis Kelamin</span>
              <span className="font-bold text-slate-700">{s.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">Nama Orang Tua</span>
              <span className="font-bold text-slate-700">{s.parentName || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">Agama</span>
              <span className="font-bold text-slate-700">{s.religion || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">Pekerjaan Orang Tua</span>
              <span className="font-bold text-slate-700">{s.parentJob || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">Alamat</span>
              <span className="font-bold text-slate-700">{s.address || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">Tahun Masuk SD</span>
              <span className="font-bold text-slate-700">{formatAdmissionYear(s.admissionYear || '')}</span>
            </div>
          </div>

          {isKepsek && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCounselingClick(s)}
                className="flex-1 min-w-[120px] h-9 text-xs rounded-xl font-bold border-cyan-200 text-primary hover:bg-cyan-50/50 gap-1.5 bg-white"
              >
                <i className="ri-heart-pulse-line text-sm" /> BK / Catatan Wali
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditClick(s)}
                className="flex-1 h-9 text-xs rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5"
              >
                <i className="ri-edit-line text-sm" /> Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(s.id || s.nis || '', s.name)}
                className="h-9 text-xs rounded-xl font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1.5"
              >
                <i className="ri-delete-bin-line text-sm" /> Hapus
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
