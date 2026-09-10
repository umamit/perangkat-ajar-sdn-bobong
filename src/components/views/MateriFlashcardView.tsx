import React from "react";
import { Button } from "@/components/ui/button";
import { FlashcardPlayer } from "./flashcard/FlashcardPlayer";
import { FlashcardDialog } from "./flashcard/FlashcardDialog";
import { FlashcardDeckGrid } from "./flashcard/FlashcardDeckGrid";
import { useFlashcardManagement } from "./flashcard/useFlashcardManagement";

export function MateriFlashcardView() {
  const f = useFlashcardManagement();

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Media Pembelajaran Interaktif (Flashcard)</h3>
          <p className="text-xs text-slate-500 font-semibold">Media kosakata interaktif {f.currentTeacher?.subject || "Mata Pelajaran"} SD (Supabase Sync)</p>
        </div>
        <Button size="sm" onClick={() => f.setShowModal(true)} className="gap-1 rounded-xl font-black text-xs bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
          <i className="ri-add-line" /> Tambah Flashcard
        </Button>
      </div>
      {f.selectedDeckTitle === null ? (
        <FlashcardDeckGrid
          decks={f.decks}
          currentTeacher={f.currentTeacher}
          onSelectDeck={(title) => { f.setSelectedDeckTitle(title); f.setCurrentIndex(0); f.setFlipped(false); }}
          onDeleteDeck={f.handleDeleteDeck}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <Button variant="outline" size="sm" onClick={() => f.setSelectedDeckTitle(null)} className="h-8 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-50 gap-1">
              <i className="ri-arrow-left-line" /> Daftar Dek
            </Button>
            <span className="text-xs font-black text-slate-600 truncate">
              Dek: {f.selectedDeckTitle} ({f.cardList.length} Kartu)
            </span>
          </div>

          <FlashcardPlayer
            cardList={f.cardList}
            currentCard={f.currentCard}
            currentIndex={f.currentIndex}
            total={f.cardList.length}
            flipped={f.flipped}
            onFlip={() => f.setFlipped(!f.flipped)}
            onPrev={f.handlePrev}
            onNext={f.handleNext}
          />
        </div>
      )}

      <FlashcardDialog
        open={f.showModal}
        onOpenChange={f.setShowModal}
        aiMode={f.aiMode}
        setAiMode={f.setAiMode}
        aiTopic={f.aiTopic}
        setAiTopic={f.setAiTopic}
        generating={f.generating}
        onAiGenerate={f.handleAiGenerate}
        form={f.form}
        setForm={f.setForm}
        saving={f.saving}
        onSave={f.handleSave}
        subjectLabel={f.currentTeacher?.subject}
      />
    </div>
  );
}
