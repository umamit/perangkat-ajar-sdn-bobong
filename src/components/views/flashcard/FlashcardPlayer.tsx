'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FlashcardItem {
  word: string;
  meaning?: string;
  translate?: string;
  phase?: string;
}

interface FlashcardPlayerProps {
  currentCard: FlashcardItem;
  currentIndex: number;
  total: number;
  flipped: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function FlashcardPlayer({
  currentCard,
  currentIndex,
  total,
  flipped,
  onFlip,
  onPrev,
  onNext,
}: FlashcardPlayerProps) {
  const promptText = `cute cartoon illustration of ${currentCard.word} (${currentCard.meaning || currentCard.translate || ''}), school flashcard style, isolated clean white background, vector digital art`;
  const imageUrl = `/api/image-proxy?prompt=${encodeURIComponent(promptText)}`;

  return (
    <div className="max-w-md mx-auto">
      <Card
        onClick={onFlip}
        className="cursor-pointer min-h-[360px] flex flex-col justify-between items-center text-center p-6 bg-gradient-to-br from-white via-white to-primary/5 shadow-xl border border-white/80 rounded-3xl hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
      >
        <div className="w-full flex justify-between items-center">
          <Badge variant="default" className="font-black text-[10px] rounded-lg px-2.5 py-0.5">{currentCard.phase || 'Fase A'}</Badge>
          <span className="text-[10px] text-slate-400 font-black tracking-wider">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Dynamic AI Illustration */}
        <div className="my-3 w-32 h-32 relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center shadow-inner shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={currentCard.word}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
        </div>

        <div className="my-3 space-y-2.5">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {flipped ? (currentCard.meaning || currentCard.translate) : currentCard.word}
          </h2>
          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
            {flipped ? 'Arti dalam Bahasa Indonesia' : 'Klik kartu untuk melihat arti'}
          </p>
        </div>

        <div className="text-[10px] font-black text-primary flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
          <i className="ri-refresh-line animate-spin-slow" /> {flipped ? 'KEMBALI KE SOAL' : 'LIHAT JAWABAN'}
        </div>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" size="sm" onClick={onPrev} className="text-xs font-black rounded-xl border-slate-200 hover:bg-slate-50 gap-1">
          <i className="ri-arrow-left-s-line" /> Sebelumnya
        </Button>
        <Button size="sm" onClick={onNext} className="text-xs font-black rounded-xl bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10 gap-1">
          Berikutnya <i className="ri-arrow-right-s-line" />
        </Button>
      </div>
    </div>
  );
}
