import React from 'react';
import { StudentCurriculumGrade, GradeFieldPath } from './gradeCurriculumTypes';
import { GradeTableHeaders } from './GradeTableHeaders';
import { GradeTableRow } from './GradeTableRow';

interface GradeFullTableProps {
  gradesData: StudentCurriculumGrade[];
  onCellChange: (studentId: string, path: GradeFieldPath, value: number) => void;
}

export function GradeFullTable({ gradesData, onCellChange }: GradeFullTableProps) {
  if (gradesData.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium text-xs bg-white/60 rounded-2xl border border-slate-100">
        Tidak ada data siswa pada filter kelas yang dipilih.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs max-h-[70vh]">
      <table className="w-full text-left border-collapse select-none">
        <GradeTableHeaders />
        <tbody className="divide-y divide-slate-100">
          {gradesData.map((row, idx) => (
            <GradeTableRow
              key={row.studentId || idx}
              row={row}
              index={idx}
              onCellChange={onCellChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
