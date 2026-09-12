'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface QuizCountdownTimerProps {
  formId: string;
  durationMinutes: number;
  onTimeout: () => void;
  disabled?: boolean;
}

export const QuizCountdownTimer: React.FC<QuizCountdownTimerProps> = ({
  formId,
  durationMinutes,
  onTimeout,
  disabled = false,
}) => {
  const storageKey = `formajar_start_${formId}`;
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (typeof window === 'undefined') return totalSeconds;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const startTime = parseInt(saved, 10);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      return Math.max(0, totalSeconds - elapsed);
    }
    localStorage.setItem(storageKey, String(Date.now()));
    return totalSeconds;
  });

  useEffect(() => {
    if (disabled || secondsLeft <= 0) {
      if (secondsLeft <= 0) onTimeout();
      return;
    }

    const interval = setInterval(() => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const startTime = parseInt(saved, 10);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsed);
        setSecondsLeft(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          onTimeout();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [disabled, secondsLeft, totalSeconds, storageKey, onTimeout]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isUrgent = secondsLeft > 0 && secondsLeft <= 120;

  return (
    <div className="sticky top-4 z-40 flex justify-center w-full pointer-events-none mb-4 animate-bounce-short">
      <div className={`pointer-events-auto px-4 py-2 rounded-full backdrop-blur-xl border shadow-lg flex items-center gap-2 transition-all ${
        isUrgent
          ? 'bg-rose-500/90 text-white border-rose-400 animate-pulse'
          : 'bg-white/90 text-slate-800 border-white/80'
      }`}>
        {isUrgent ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4 text-[#12A5B8]" />}
        <span className="text-xs font-semibold tracking-wide uppercase">
          {isUrgent ? 'Sisa Waktu Segera Habis:' : 'Sisa Waktu Kuis:'}
        </span>
        <span className="text-sm font-mono font-bold">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
