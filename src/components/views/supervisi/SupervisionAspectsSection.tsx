'use client';

import React from 'react';
import { SupervisionScores } from '@/types/supervision';
import { SUPERVISION_ASPECTS } from './supervisionCalculations';

interface Props {
  scores: SupervisionScores;
  setScores: React.Dispatch<React.SetStateAction<SupervisionScores>>;
  totalScore: number;
  percentage: number;
  predicate: string;
}

export function SupervisionAspectsSection({
  scores,
  setScores,
  totalScore,
  percentage,
  predicate,
}: Props) {
  return (
    <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/70 space-y-2.5">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <span className="font-black text-slate-800">Indikator Observasi Kelas</span>
        <span className="font-black text-primary">Skor: {totalScore} / 28 ({percentage}%) • {predicate}</span>
      </div>
      {SUPERVISION_ASPECTS.map((asp, idx) => (
        <div key={asp.key} className="flex items-center justify-between gap-3 py-1">
          <div className="flex-1">
            <p className="font-bold text-slate-800">{idx + 1}. {asp.title}</p>
            <p className="text-[10px] text-slate-400 font-medium">{asp.desc}</p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map(sVal => (
              <button
                key={sVal}
                type="button"
                onClick={() => setScores(prev => ({ ...prev, [asp.key]: sVal }))}
                className={`w-7 h-7 rounded-lg font-bold text-xs transition-all ${
                  scores[asp.key] === sVal
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sVal}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
