'use client';

import React, { useState, useEffect } from 'react';
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
  cardList?: FlashcardItem[];
  currentCard: FlashcardItem;
  currentIndex: number;
  total: number;
  flipped: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function FlashcardPlayer({
  cardList,
  currentCard,
  currentIndex,
  total,
  flipped,
  onFlip,
  onPrev,
  onNext,
}: FlashcardPlayerProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const primaryWord = (currentCard.word || '').split('/')[0].trim();
  const primaryMeaning = (currentCard.meaning || currentCard.translate || '').split('/')[0].trim();
  const searchQuery = primaryWord || primaryMeaning;
  const promptText = `cute cartoon illustration of ${primaryWord} ${primaryMeaning ? `(${primaryMeaning})` : ''}, school flashcard style, isolated clean white background, vector digital art`;
  const imageUrl = `/api/image-proxy?query=${encodeURIComponent(searchQuery)}&prompt=${encodeURIComponent(promptText)}`;

  // Pre-load all images for the current deck
  useEffect(() => {
    if (!cardList || cardList.length === 0) return;
    cardList.forEach((c) => {
      const pWord = (c.word || '').split('/')[0].trim();
      const pMeaning = (c.meaning || c.translate || '').split('/')[0].trim();
      const pQuery = pWord || pMeaning;
      const pText = `cute cartoon illustration of ${pWord} ${pMeaning ? `(${pMeaning})` : ''}, school flashcard style, isolated clean white background, vector digital art`;
      const url = `/api/image-proxy?query=${encodeURIComponent(pQuery)}&prompt=${encodeURIComponent(pText)}`;
      if (typeof window !== 'undefined') {
        const img = new window.Image();
        img.src = url;
      }
    });
  }, [cardList]);

  useEffect(() => {
    setImageLoading(true);
  }, [currentIndex, currentCard.word]);

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

        {/* Dynamic AI Illustration Container */}
        <div className="my-3 w-32 h-32 relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center shadow-inner shrink-0">
          {imageLoading && (
            <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-1.5 text-slate-400">
              <i className="ri-loader-4-line animate-spin text-lg text-primary" />
              <span className="text-[9px] font-bold text-slate-500 tracking-tight">Memuat ilustrasi...</span>
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={imageUrl}
            src={imageUrl}
            alt={currentCard.word}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
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

