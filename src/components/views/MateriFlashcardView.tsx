import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { saveFlashcardToSupabase, deleteFlashcardDeckFromSupabase } from '@/lib/supabaseFlashcard';
import { FlashcardPlayer } from './flashcard/FlashcardPlayer';
import { FlashcardDialog } from './flashcard/FlashcardDialog';
import { FlashcardDeckGrid } from './flashcard/FlashcardDeckGrid';

export function MateriFlashcardView() {
  const { flashcards, currentTeacher, showToast, setFlashcards, syncData } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selectedDeckTitle, setSelectedDeckTitle] = useState<string | null>(null);
  const [form, setForm] = useState({ word: '', translate: '', category: 'School & Classroom', example: '', phase: 'Fase A' });

  const decks = React.useMemo(() => {
    const groups: Record<string, { title: string; phase: string; teacher_nip?: string | null; cards: any[] }> = {};
    (flashcards || []).forEach(c => {
      const key = c.title || c.category || 'General';
      if (!groups[key]) {
        groups[key] = {
          title: key,
          phase: c.phase || 'Fase A',
          teacher_nip: c.teacher_nip,
          cards: []
        };
      }
      groups[key].cards.push(c);
    });
    return Object.values(groups);
  }, [flashcards]);

  const activeDeck = decks.find(d => d.title === selectedDeckTitle);
  const cardList = activeDeck ? activeDeck.cards : [];

  const currentCard = cardList[currentIndex] || cardList[0];

  const handleNext = () => {
    if (cardList.length === 0) return;
    setFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cardList.length);
  };

  const handlePrev = () => {
    if (cardList.length === 0) return;
    setFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cardList.length) % cardList.length);
  };

  const handleDeleteDeck = async (title: string, teacher_nip: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus seluruh dek "${title}" beserta semua kartunya?`)) return;
    setFlashcards(prev => prev.filter(c => (c.title || c.category) !== title));
    if (selectedDeckTitle === title) {
      setSelectedDeckTitle(null);
    }
    const ok = await deleteFlashcardDeckFromSupabase(title, teacher_nip);
    if (ok) {
      showToast(`Dek "${title}" berhasil dihapus`, 'success');
    } else {
      showToast('Gagal menghapus dek dari cloud', 'error');
      await syncData();
    }
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
        id: crypto.randomUUID(),
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
              id: crypto.randomUUID(),
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
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Media Pembelajaran Interaktif (Flashcard)</h3>
          <p className="text-xs text-slate-500 font-semibold">Media kosakata interaktif {currentTeacher?.subject || 'Mata Pelajaran'} SD (Supabase Sync)</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
          <i className="ri-add-line" /> Tambah Flashcard
        </Button>
      </div>
      {selectedDeckTitle === null ? (
        <FlashcardDeckGrid
          decks={decks}
          currentTeacher={currentTeacher}
          onSelectDeck={(title) => {
            setSelectedDeckTitle(title);
            setCurrentIndex(0);
            setFlipped(false);
          }}
          onDeleteDeck={handleDeleteDeck}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDeckTitle(null)}
              className="h-8 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-50 gap-1"
            >
              <i className="ri-arrow-left-line" /> Daftar Dek
            </Button>
            <span className="text-xs font-black text-slate-600 truncate">
              Dek: {selectedDeckTitle} ({cardList.length} Kartu)
            </span>
          </div>

          <FlashcardPlayer
            cardList={cardList}
            currentCard={currentCard}
            currentIndex={currentIndex}
            total={cardList.length}
            flipped={flipped}
            onFlip={() => setFlipped(!flipped)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      )}
 
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
