'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DeckItem {
  title: string;
  phase: string;
  teacher_nip?: string | null;
  cards: any[];
}

interface FlashcardDeckGridProps {
  decks: DeckItem[];
  currentTeacher: any;
  onSelectDeck: (title: string) => void;
  onDeleteDeck: (title: string, teacher_nip: string) => void;
}

export function FlashcardDeckGrid({
  decks,
  currentTeacher,
  onSelectDeck,
  onDeleteDeck,
}: FlashcardDeckGridProps) {
  if (decks.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
        <i className="ri-folder-unknow-line text-4xl text-slate-300 block mb-2" />
        <p className="text-xs text-slate-400 font-bold">Belum ada dek kartu flashcard</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {decks.map((deck, idx) => (
        <Card
          key={idx}
          className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-xs hover:shadow-md transition-all group overflow-hidden"
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black">
                {deck.phase}
              </Badge>
              <span className="text-[10px] text-slate-400 font-bold">
                {deck.cards.length} Kartu
              </span>
            </div>
            <CardTitle className="text-sm font-black text-slate-800 tracking-tight mt-1 line-clamp-1">
              {deck.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 font-bold gap-2">
              <Button
                onClick={() => onSelectDeck(deck.title)}
                size="sm"
                className="flex-1 rounded-lg text-[10px] font-black bg-primary text-white hover:bg-primary-dark"
              >
                Mulai Belajar
              </Button>
              {(currentTeacher?.nip === '199610272019032006' || currentTeacher?.nip === deck.teacher_nip) && (
                <Button
                  onClick={() => onDeleteDeck(deck.title, deck.teacher_nip || '')}
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-[10px] font-black text-rose-700 border-rose-200 hover:bg-rose-50/50"
                >
                  Hapus
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
