import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { saveFlashcardToSupabase, deleteFlashcardDeckFromSupabase } from "@/lib/supabaseFlashcard";

export function useFlashcardManagement() {
  const { flashcards, currentTeacher, showToast, setFlashcards, syncData } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedDeckTitle, setSelectedDeckTitle] = useState<string | null>(null);
  const [form, setForm] = useState({ word: "", translate: "", category: "School & Classroom", example: "", phase: "Fase A" });

  const decks = useMemo(() => {
    const groups: Record<string, any> = {};
    (flashcards || []).forEach(c => {
      const key = c.title || c.category || "General";
      if (!groups[key]) groups[key] = { title: key, phase: c.phase || "Fase A", teacher_nip: c.teacher_nip, cards: [] };
      groups[key].cards.push(c);
    });
    return Object.values(groups);
  }, [flashcards]);

  const activeDeck = decks.find(d => d.title === selectedDeckTitle);
  const cardList = activeDeck ? activeDeck.cards : [];
  const currentCard = cardList[currentIndex] || cardList[0];

  const handleNext = () => { if (cardList.length > 0) { setFlipped(false); setCurrentIndex(p => (p + 1) % cardList.length); } };
  const handlePrev = () => { if (cardList.length > 0) { setFlipped(false); setCurrentIndex(p => (p - 1 + cardList.length) % cardList.length); } };

  const handleDeleteDeck = async (title: string, teacher_nip: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus seluruh dek "${title}" beserta semua kartunya?`)) return;
    setFlashcards(prev => prev.filter(c => (c.title || c.category) !== title));
    if (selectedDeckTitle === title) setSelectedDeckTitle(null);
    if (await deleteFlashcardDeckFromSupabase(title, teacher_nip)) showToast(`Dek "${title}" berhasil dihapus`, "success");
    else { showToast("Gagal menghapus dek dari cloud", "error"); await syncData(); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word.trim() || !form.translate.trim()) return showToast("Semua field wajib diisi", "error");
    setSaving(true);
    try {
      const newCard = {
        id: crypto.randomUUID(), word: form.word.trim(), translate: form.translate.trim(), meaning: form.translate.trim(),
        category: form.category, example: form.example.trim() || "-", phase: form.phase, icon: "ri-book-open-line", teacher_nip: currentTeacher?.nip || null
      };
      if (await saveFlashcardToSupabase(newCard)) {
        setFlashcards(prev => [newCard, ...prev]);
        showToast("Kartu kosakata berhasil disimpan", "success");
        setShowModal(false);
        setForm({ word: "", translate: "", category: "School & Classroom", example: "", phase: "Fase A" });
      } else { showToast("Gagal menyimpan kartu ke cloud", "error"); }
    } catch { showToast("Terjadi kesalahan saat menyimpan", "error"); }
    finally { setSaving(false); }
  };

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) return showToast("Masukkan topik terlebih dahulu", "error");
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/groq", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiTopic, mode: "generate_flashcards", grade: form.phase, subject: currentTeacher?.subject || "Bahasa Inggris" })
      });
      const data = await res.json();
      if (data.result) {
        const cards = JSON.parse(data.result);
        if (Array.isArray(cards)) {
          let count = 0; const saved: any[] = [];
          for (const c of cards) {
            const card = { id: crypto.randomUUID(), word: c.word || "Word", translate: c.meaning || c.translate || "Terjemahan", meaning: c.meaning || c.translate || "Terjemahan", category: c.category || aiTopic, example: c.example || "-", phase: c.phase || form.phase, icon: "ri-book-open-line", teacher_nip: currentTeacher?.nip || null };
            if (await saveFlashcardToSupabase(card)) { count++; saved.push(card); }
          }
          if (count > 0) { setFlashcards(prev => [...saved, ...prev]); showToast(`${count} Kartu berhasil disimpan!`, "success"); setShowModal(false); setAiTopic(""); }
          else showToast("Gagal menyimpan kartu ke database", "error");
        }
      }
    } catch { showToast("Gagal memproses kartu kosakata AI", "error"); }
    finally { setGenerating(false); }
  };

  return {
    currentTeacher, currentIndex, setCurrentIndex, flipped, setFlipped, showModal, setShowModal,
    saving, aiMode, setAiMode, aiTopic, setAiTopic, generating, selectedDeckTitle, setSelectedDeckTitle,
    form, setForm, decks, cardList, currentCard, handleNext, handlePrev, handleDeleteDeck, handleSave, handleAiGenerate
  };
}
