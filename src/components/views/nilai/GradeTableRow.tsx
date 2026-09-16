import React from 'react';
import { StudentCurriculumGrade, GradeFieldPath } from './gradeCurriculumTypes';

interface GradeTableRowProps {
  row: StudentCurriculumGrade;
  index: number;
  onCellChange: (studentId: string, path: GradeFieldPath, value: number) => void;
}

export function GradeTableRow({ row, index, onCellChange }: GradeTableRowProps) {
  const renderInput = (path: GradeFieldPath, val?: number, disabled = false) => (
    <input
      type="number"
      min={0}
      max={100}
      disabled={disabled}
      value={val !== undefined && val !== null ? val : ''}
      onChange={(e) => {
        const num = e.target.value === '' ? 0 : Math.min(100, Math.max(0, parseInt(e.target.value, 10)));
        onCellChange(row.studentId, path, num);
      }}
      className={`w-full h-8 text-center text-xs font-semibold focus:bg-amber-50 focus:outline-none focus:ring-1 focus:ring-primary ${
        disabled ? 'bg-slate-50/70 text-slate-600 font-bold cursor-default' : 'bg-transparent text-slate-800'
      }`}
    />
  );

  return (
    <tr className="hover:bg-slate-50/80 border-b border-slate-200/80 transition-colors">
      <td className="sticky left-0 z-10 bg-white px-2 py-1 border-r border-slate-200 text-center text-xs font-medium text-slate-400">
        {index + 1}
      </td>
      <td className="sticky left-12 z-10 bg-white px-3 py-1 border-r border-slate-200 text-xs font-bold text-slate-800 truncate max-w-[200px]" title={row.name}>
        {row.name}
      </td>

      {/* Formatif LM 1 */}
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm1.tp1', row.f_lm1?.tp1)}</td>
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm1.tp2', row.f_lm1?.tp2)}</td>
      <td className="border-r border-slate-200 p-0">{renderInput('f_lm1.tp3', row.f_lm1?.tp3)}</td>

      {/* Formatif LM 2 */}
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm2.tp1', row.f_lm2?.tp1)}</td>
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm2.tp2', row.f_lm2?.tp2)}</td>
      <td className="border-r border-slate-200 p-0">{renderInput('f_lm2.tp3', row.f_lm2?.tp3)}</td>

      {/* Formatif LM 3 */}
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm3.tp1', row.f_lm3?.tp1)}</td>
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm3.tp2', row.f_lm3?.tp2)}</td>
      <td className="border-r border-slate-200 p-0">{renderInput('f_lm3.tp3', row.f_lm3?.tp3)}</td>

      {/* Formatif LM 4 */}
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm4.tp1', row.f_lm4?.tp1)}</td>
      <td className="border-r border-slate-200 p-0">{renderInput('f_lm4.tp2', row.f_lm4?.tp2)}</td>

      {/* Formatif LM 5 */}
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm5.tp1', row.f_lm5?.tp1)}</td>
      <td className="border-r border-slate-100 p-0">{renderInput('f_lm5.tp2', row.f_lm5?.tp2)}</td>
      <td className="border-r border-slate-200 p-0">{renderInput('f_lm5.tp3', row.f_lm5?.tp3)}</td>

      {/* Sumatif LM 1 - LM 5 */}
      <td className="border-r border-slate-200 p-0 bg-emerald-50/20">{renderInput('s_lm1', row.s_lm1)}</td>
      <td className="border-r border-slate-200 p-0 bg-emerald-50/20">{renderInput('s_lm2', row.s_lm2)}</td>
      <td className="border-r border-slate-200 p-0 bg-emerald-50/20">{renderInput('s_lm3', row.s_lm3)}</td>
      <td className="border-r border-slate-200 p-0 bg-emerald-50/20">{renderInput('s_lm4', row.s_lm4)}</td>
      <td className="border-r border-slate-200 p-0 bg-emerald-50/20">{renderInput('s_lm5', row.s_lm5)}</td>

      {/* Rata-Rata */}
      <td className="border-r border-slate-200 text-center text-xs font-bold text-slate-700 bg-amber-50/30">
        {row.rataRata || '-'}
      </td>

      {/* UH, STS, SAS */}
      <td className="border-r border-slate-200 p-0">{renderInput('uh', row.uh)}</td>
      <td className="border-r border-slate-200 p-0">{renderInput('sts', row.sts)}</td>
      <td className="border-r border-slate-200 p-0">{renderInput('sas', row.sas)}</td>

      {/* Nilai Akhir */}
      <td className="text-center text-xs font-black text-primary bg-primary/5">
        {row.nilaiAkhir || '-'}
      </td>
    </tr>
  );
}
