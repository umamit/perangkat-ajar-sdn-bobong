'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_DATA } from '@/data';

export function MateriFlashcardView() {
  const { showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [quizActive, setQuizActive] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const flashcards = INITIAL_DATA.flashcards || [
    { english: 'Good Morning', indonesia: 'Selamat Pagi', category: 'Greetings' },
    { english: 'Thank You', indonesia: 'Terima Kasih', category: 'Greetings' },
    { english: 'Father & Mother', indonesia: 'Ayah & Ibu', category: 'Family' },
    { english: 'Pencil & Book', indonesia: 'Pensil & Buku', category: 'School' },
    { english: 'Cat & Dog', indonesia: 'Kucing & Anjing', category: 'Animals' },
  ];

  const quizQuestions = [
    { question: 'Apa arti dari "Good Morning"?', options: ['Selamat Pagi', 'Selamat Malam', 'Selamat Tinggal'], answer: 'Selamat Pagi' },
    { question: 'Apa Bahasa Inggrisnya "Pensil"?', options: ['Book', 'Pencil', 'Ruler'], answer: 'Pencil' },
    { question: 'Apa arti dari "Thank You"?', options: ['Maaf', 'Terima Kasih', 'Sama-sama'], answer: 'Terima Kasih' },
  ];

  const filteredCards = flashcards.filter(
    c => selectedCategory === 'ALL' || c.category === selectedCategory
  );

  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleQuizAnswer = (option: string) => {
    const q = quizQuestions[quizIdx];
    if (option === q.answer) {
      setQuizScore(prev => prev + 1);
      showToast('Jawaban Benar! 🎉', 'success');
    } else {
      showToast(`Jawaban Kurang Tepat. Yang benar: ${q.answer}`, 'error');
    }

    if (quizIdx + 1 < quizQuestions.length) {
      setQuizIdx(prev => prev + 1);
    } else {
      showToast(`Kuis Selesai! Skor Anda: ${quizScore + (option === q.answer ? 1 : 0)} / ${quizQuestions.length}`, 'info');
      setQuizActive(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Materi & Flashcards Interaktif Bahasa Inggris</h3>
          <p className="text-xs text-slate-500">Media kartu kosa kata interaktif & kuis Bahasa Inggris siswa SD</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => (window as any).showAddFlashcardModal()}>
            <i className="ri-add-line" /> Tambah Flashcard
          </Button>
          <Button variant="accent" size="sm" onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizScore(0); }}>
            <i className="ri-gamepad-line" /> Kuis Interaktif
          </Button>
        </div>
      </div>

      {quizActive && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-emerald-100">
            <CardTitle className="text-base font-bold text-emerald-800 flex items-center gap-2">
              <i className="ri-gamepad-line" /> Kuis Bahasa Inggris (Soal {quizIdx + 1}/{quizQuestions.length})
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setQuizActive(false)}>Tutup</Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <h4 className="text-lg font-bold text-slate-800">{quizQuestions[quizIdx].question}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quizQuestions[quizIdx].options.map((opt, i) => (
                <Button key={i} variant="outline" onClick={() => handleQuizAnswer(opt)} className="h-12 text-sm font-semibold justify-start px-4">
                  {opt}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-slate-600">Filter Kategori:</label>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="h-9 rounded-apple-sm border border-slate-300 bg-white px-3 text-xs font-medium outline-none"
        >
          <option value="ALL">Semua Topik</option>
          <option value="Greetings">Greetings & Introductions</option>
          <option value="Family">My Family</option>
          <option value="School">School Objects</option>
          <option value="Animals">Animals & Pets</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCards.map((c, idx) => {
          const isFlipped = !!flippedCards[idx];

          return (
            <Card
              key={idx}
              onClick={() => toggleFlip(idx)}
              className={`cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col justify-between p-5 text-center border-2 ${
                isFlipped ? 'bg-cyan-50 border-primary' : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary">{c.category}</Badge>
                <i className="ri-pulse-line text-slate-400 text-sm" />
              </div>
              <div className="my-auto">
                <h3 className="text-xl font-extrabold text-slate-800">
                  {isFlipped ? ((c as any).indonesia || c.translate) : ((c as any).english || c.word)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isFlipped ? '(Bahasa Indonesia)' : '(Bahasa Inggris)'}
                </p>
              </div>
              <p className="text-[10px] text-primary-dark font-bold mt-2">
                Klik kartu untuk balik
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
