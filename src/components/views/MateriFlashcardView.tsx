import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveFlashcardToSupabase } from '@/lib/supabase';
import { FlashcardPlayer } from './flashcard/FlashcardPlayer';
import { FlashcardDialog } from './flashcard/FlashcardDialog';

export function MateriFlashcardView() {
  const { flashcards, currentTeacher, showToast, setFlashcards } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // AI states
  const [aiMode, setAiMode] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  const [form, setForm] = useState({
    word: '',
    translate: '',
    category: 'School & Classroom',
    example: '',
    phase: 'Fase A'
  });

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word.trim() || !form.translate.trim()) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      const newCard = {
        id: Date.now(),
        word: form.word.trim(),
        translate: form.translate.trim(),
        meaning: form.translate.trim(),
        category: form.category,
        example: form.example.trim() || '-',
        phase: form.phase,
        icon: 'ri-book-open-line',
        teacher_nip: currentTeacher?.nip || null
      };

      const success = await saveFlashcardToSupabase(newCard);
      if (success) {
        setFlashcards(prev => [newCard, ...prev]);
        showToast('Kartu kosakata berhasil disimpan ke Supabase Cloud', 'success');
        setShowModal(false);
        setForm({
          word: '',
          translate: '',
          category: 'School & Classroom',
          example: '',
          phase: 'Fase A'
        });
      } else {
        showToast('Gagal menyimpan kartu ke cloud', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      showToast('Masukkan topik terlebih dahulu', 'error');
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiTopic,
          mode: 'generate_flashcards',
          grade: form.phase,
          subject: currentTeacher?.subject || 'Bahasa Inggris'
        }),
      });

      const data = await res.json();
      if (data.result) {
        const cards = JSON.parse(data.result);
        if (Array.isArray(cards)) {
          showToast(`Berhasil merumuskan ${cards.length} kartu! Menyimpan ke cloud...`, 'info');
          let savedCount = 0;
          const savedCards: any[] = [];
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const newCard = {
              id: Date.now() + i,
              word: card.word || 'Word',
              translate: card.meaning || card.translate || 'Terjemahan',
              meaning: card.meaning || card.translate || 'Terjemahan',
              category: card.category || aiTopic,
              example: card.example || '-',
              phase: card.phase || form.phase,
              icon: 'ri-book-open-line',
              teacher_nip: currentTeacher?.nip || null
            };
            const ok = await saveFlashcardToSupabase(newCard);
            if (ok) {
              savedCount++;
              savedCards.push(newCard);
            }
          }
          if (savedCount > 0) {
            setFlashcards(prev => [...savedCards, ...prev]);
            showToast(`${savedCount} Kartu kosakata baru berhasil disimpan ke database!`, 'success');
            setShowModal(false);
            setAiTopic('');
          } else {
            showToast('Gagal menyimpan kartu ke database', 'error');
          }
        } else {
          showToast('Format respon AI tidak sesuai', 'error');
        }
      } else {
        showToast(data.error || 'Gagal memanggil AI', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses kartu kosakata AI', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Media Pembelajaran Interaktif (Flashcard)</h3>
          <p className="text-xs text-slate-500 font-semibold">Media kosakata interaktif {currentTeacher?.subject || 'Mata Pelajaran'} SD (Supabase Sync)</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1 rounded-xl font-black text-xs bg-primary hover:bg-primary-dark text-white">
          <i className="ri-add-line" /> Tambah Flashcard
        </Button>
      </div>
 
      <FlashcardPlayer
        currentCard={currentCard}
        currentIndex={currentIndex}
        total={cardList.length}
        flipped={flipped}
        onFlip={() => setFlipped(!flipped)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
 
      <FlashcardDialog
        open={showModal}
        onOpenChange={setShowModal}
        aiMode={aiMode}
        setAiMode={setAiMode}
        aiTopic={aiTopic}
        setAiTopic={setAiTopic}
        generating={generating}
        onAiGenerate={handleAiGenerate}
        form={form}
        setForm={setForm}
        saving={saving}
        onSave={handleSave}
        subjectLabel={currentTeacher?.subject}
      />
    </div>
  );
}
