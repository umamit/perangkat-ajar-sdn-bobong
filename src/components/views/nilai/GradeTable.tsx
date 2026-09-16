'use client';

import React from 'react';
import { StudentCurriculumGrade, GradeFieldPath } from './gradeCurriculumTypes';
import { GradeFullTable } from './GradeFullTable';
import { GradeFullMobileCard } from './GradeFullMobileCard';

interface GradeTableProps {
  gradesData: StudentCurriculumGrade[];
  onCellChange: (studentId: string, path: GradeFieldPath, value: number) => void;
}

export function GradeTable({ gradesData, onCellChange }: GradeTableProps) {
  return (
    <div className="w-full">
      {/* Mobile Card List View */}
      <div className="block lg:hidden space-y-3">
        {gradesData.map((row, idx) => (
          <GradeFullMobileCard
            key={row.studentId || idx}
            row={row}
            index={idx}
            onCellChange={onCellChange}
          />
        ))}
        {gradesData.length === 0 && (
          <div className="text-center text-slate-500 py-8 text-xs font-bold bg-white rounded-2xl border border-slate-100">
            Tidak ada data siswa ditemukan
          </div>
        )}
      </div>

      {/* Desktop Multi-Level Header Table View */}
      <div className="hidden lg:block">
        <GradeFullTable
          gradesData={gradesData}
          onCellChange={onCellChange}
        />
      </div>
    </div>
  );
}
