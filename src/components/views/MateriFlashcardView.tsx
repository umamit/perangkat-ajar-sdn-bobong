'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function MateriFlashcardView() {
  const { flashcards } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cardList = flashcards && flashcards.length > 0 ? flashcards : [
    { id: '1', title: 'Greetings & Introduction', word: 'Hello / Good Morning', meaning: 'Halo / Selamat Pagi', phase: 'Fase A' },
    { id: '2', title: 'Classroom Objects', word: 'Pencil & Book', meaning: 'Pensil & Buku', phase: 'Fase A' },
    { id: '3', title: 'Numbers 1-20', word: 'One, Two, Three...', meaning: 'Satu, Dua, Tiga...', phase: 'Fase B' }
  ];

  const currentCard = cardList[currentIndex] || cardList[0];

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cardList.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cardList.length) % cardList.length);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Media Pembelajaran Interaktif (Flashcard)</h3>
          <p className="text-xs text-slate-500">Kartu kosakata interaktif Bahasa Inggris SD (Terhubung Supabase Cloud)</p>
        </div>
        <Button size="sm" onClick={() => (window as any).showAddFlashcardModal()}>
          <i className="ri-add-line" /> Tambah Flashcard
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        <Card
          onClick={() => setFlipped(!flipped)}
          className="cursor-pointer min-h-[260px] flex flex-col justify-between items-center text-center p-8 bg-gradient-to-br from-white to-slate-50 shadow-xl border border-slate-200/80 rounded-2xl hover:border-primary transition-all duration-300"
        >
          <div className="w-full flex justify-between items-center">
            <Badge variant="default">{currentCard.phase || 'Fase A'}</Badge>
            <span className="text-xs text-slate-400 font-bold">
              {currentIndex + 1} / {cardList.length}
            </span>
          </div>

          <div className="my-6 space-y-2">
            <h2 className="text-2xl font-black text-slate-800">
              {flipped ? currentCard.meaning : currentCard.word}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {flipped ? 'Arti dalam Bahasa Indonesia' : 'Klik kartu untuk melihat terjemahan'}
            </p>
          </div>

          <div className="text-xs font-bold text-primary flex items-center gap-1">
            <i className="ri-refresh-line" /> {flipped ? 'Kembali ke Bahasa Inggris' : 'Lihat Terjemahan'}
          </div>
        </Card>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" size="sm" onClick={handlePrev}>
            <i className="ri-arrow-left-s-line" /> Sebelumnya
          </Button>
          <Button size="sm" onClick={handleNext}>
            Berikutnya <i className="ri-arrow-right-s-line" />
          </Button>
        </div>
      </div>
    </div>
  );
}
