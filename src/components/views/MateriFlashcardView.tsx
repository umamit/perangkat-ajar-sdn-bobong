import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveFlashcardToSupabase } from '@/lib/supabase';

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Media Pembelajaran Interaktif (Flashcard)</h3>
          <p className="text-xs text-slate-500">Kartu media pembelajaran interaktif {currentTeacher?.subject || 'Mata Pelajaran'} SD (Terhubung Supabase Cloud)</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
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
            <i className="ri-refresh-line" /> {flipped ? 'Kembali ke soal' : 'Lihat Jawaban'}
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Tambah Kartu Kosakata (Flashcard)</DialogTitle>
            <div className="flex gap-2 border-b border-slate-100 pb-2 mt-2">
              <button
                type="button"
                onClick={() => setAiMode(false)}
                className={`text-xs font-bold pb-1 px-2 border-b-2 transition-all ${!aiMode ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
              >
                Input Manual
              </button>
              <button
                type="button"
                onClick={() => setAiMode(true)}
                className={`text-xs font-bold pb-1 px-2 border-b-2 transition-all ${aiMode ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
              >
                ✨ Buat dengan AI
              </button>
            </div>
          </DialogHeader>

          {aiMode ? (
            <div className="space-y-4 mt-4">
              <div className="space-y-1">
                <Label htmlFor="aiTopic">Topik Kosakata / Tema</Label>
                <Input
                  id="aiTopic"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="Contoh: Peralatan makan, Benda kelas, Tubuh manusia"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="aiPhase">Fase / Tingkat</Label>
                <select
                  id="aiPhase"
                  value={form.phase}
                  onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Fase A">Fase A (Kelas 1 & 2)</option>
                  <option value="Fase B">Fase B (Kelas 3 & 4)</option>
                  <option value="Fase C">Fase C (Kelas 5 & 6)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Batal
                </Button>
                <Button type="button" onClick={handleAiGenerate} disabled={generating} className="gap-1.5 font-bold">
                  {generating ? 'Menyusun...' : '✨ Generate 5 Kartu'}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="space-y-1 text-xs">
                <Label htmlFor="flashcardWord">Kata / Istilah ({currentTeacher?.subject || 'Mata Pelajaran'})</Label>
                <Input
                  id="flashcardWord"
                  value={form.word}
                  onChange={e => setForm(f => ({ ...f, word: e.target.value }))}
                  placeholder="Contoh: Classroom atau Lay-up Shoot"
                  required
                />
              </div>
              <div className="space-y-1 text-xs">
                <Label htmlFor="flashcardTranslate">Terjemahan / Arti</Label>
                <Input
                  id="flashcardTranslate"
                  value={form.translate}
                  onChange={e => setForm(f => ({ ...f, translate: e.target.value }))}
                  placeholder="Contoh: Ruang Kelas atau Tembakan melayang"
                  required
                />
              </div>
              <div className="space-y-1 text-xs">
                <Label htmlFor="flashcardCategory">Kategori Kosakata</Label>
                <Input
                  id="flashcardCategory"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="Contoh: School & Classroom, Teknik Dasar, dll."
                  required
                />
              </div>
              <div className="space-y-1 text-xs">
                <Label htmlFor="flashcardPhase">Fase / Tingkat</Label>
                <select
                  id="flashcardPhase"
                  value={form.phase}
                  onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Fase A">Fase A (Kelas 1 & 2)</option>
                  <option value="Fase B">Fase B (Kelas 3 & 4)</option>
                  <option value="Fase C">Fase C (Kelas 5 & 6)</option>
                </select>
              </div>
              <div className="space-y-1 text-xs">
                <Label htmlFor="flashcardExample">Contoh Penggunaan / Kalimat</Label>
                <Input
                  id="flashcardExample"
                  value={form.example}
                  onChange={e => setForm(f => ({ ...f, example: e.target.value }))}
                  placeholder="Contoh kalimat penjelas..."
                />
              </div>
              <DialogFooter className="pt-2 text-xs">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Kartu'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
