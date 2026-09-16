import React, { useState } from 'react';
import { StudentCurriculumGrade, GradeFieldPath } from './gradeCurriculumTypes';

interface GradeFullMobileCardProps {
  row: StudentCurriculumGrade;
  index: number;
  onCellChange: (studentId: string, path: GradeFieldPath, value: number) => void;
}

export function GradeFullMobileCard({ row, index, onCellChange }: GradeFullMobileCardProps) {
  const [openLm, setOpenLm] = useState<string | null>(null);

  const toggleLm = (lm: string) => {
    setOpenLm(openLm === lm ? null : lm);
  };

  const renderInput = (label: string, path: GradeFieldPath, val?: number) => (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-xs text-slate-600 font-medium">{label}:</span>
      <input
        type="number"
        min={0}
        max={100}
        value={val !== undefined && val !== null && val !== 0 ? val : ''}
        placeholder="-"
        onChange={(e) => {
          const num = e.target.value === '' ? 0 : Math.min(100, Math.max(0, parseInt(e.target.value, 10)));
          onCellChange(row.studentId, path, num);
        }}
        className="w-16 h-8 text-center text-xs font-bold rounded-lg border border-slate-200 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
          <h4 className="text-sm font-bold text-slate-900 truncate max-w-[190px]">{row.name}</h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">Nilai Akhir</span>
          <span className="text-base font-black text-primary">{row.nilaiAkhir || '-'}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {['LM1', 'LM2', 'LM3', 'LM4', 'LM5'].map((lm) => (
          <button
            key={lm}
            type="button"
            onClick={() => toggleLm(lm)}
            className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border transition-all ${
              openLm === lm ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {lm}
          </button>
        ))}
      </div>

      {openLm === 'LM1' && (
        <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
          <p className="text-[11px] font-bold text-sky-900 mb-1">Lingkup Materi 1</p>
          {renderInput('Formatif TP1', 'f_lm1.tp1', row.f_lm1?.tp1)}
          {renderInput('Formatif TP2', 'f_lm1.tp2', row.f_lm1?.tp2)}
          {renderInput('Formatif TP3', 'f_lm1.tp3', row.f_lm1?.tp3)}
          {renderInput('Sumatif LM1', 's_lm1', row.s_lm1)}
        </div>
      )}

      {openLm === 'LM2' && (
        <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
          <p className="text-[11px] font-bold text-sky-900 mb-1">Lingkup Materi 2</p>
          {renderInput('Formatif TP1', 'f_lm2.tp1', row.f_lm2?.tp1)}
          {renderInput('Formatif TP2', 'f_lm2.tp2', row.f_lm2?.tp2)}
          {renderInput('Formatif TP3', 'f_lm2.tp3', row.f_lm2?.tp3)}
          {renderInput('Sumatif LM2', 's_lm2', row.s_lm2)}
        </div>
      )}

      {openLm === 'LM3' && (
        <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
          <p className="text-[11px] font-bold text-sky-900 mb-1">Lingkup Materi 3</p>
          {renderInput('Formatif TP1', 'f_lm3.tp1', row.f_lm3?.tp1)}
          {renderInput('Formatif TP2', 'f_lm3.tp2', row.f_lm3?.tp2)}
          {renderInput('Formatif TP3', 'f_lm3.tp3', row.f_lm3?.tp3)}
          {renderInput('Sumatif LM3', 's_lm3', row.s_lm3)}
        </div>
      )}

      {openLm === 'LM4' && (
        <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
          <p className="text-[11px] font-bold text-sky-900 mb-1">Lingkup Materi 4</p>
          {renderInput('Formatif TP1', 'f_lm4.tp1', row.f_lm4?.tp1)}
          {renderInput('Formatif TP2', 'f_lm4.tp2', row.f_lm4?.tp2)}
          {renderInput('Sumatif LM4', 's_lm4', row.s_lm4)}
        </div>
      )}

      {openLm === 'LM5' && (
        <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
          <p className="text-[11px] font-bold text-sky-900 mb-1">Lingkup Materi 5</p>
          {renderInput('Formatif TP1', 'f_lm5.tp1', row.f_lm5?.tp1)}
          {renderInput('Formatif TP2', 'f_lm5.tp2', row.f_lm5?.tp2)}
          {renderInput('Formatif TP3', 'f_lm5.tp3', row.f_lm5?.tp3)}
          {renderInput('Sumatif LM5', 's_lm5', row.s_lm5)}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
        <div>{renderInput('UH', 'uh', row.uh)}</div>
        <div>{renderInput('STS', 'sts', row.sts)}</div>
        <div>{renderInput('SAS', 'sas', row.sas)}</div>
      </div>
    </div>
  );
}
