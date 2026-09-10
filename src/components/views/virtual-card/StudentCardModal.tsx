"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { StudentCardFront } from "./StudentCardFront";
import { StudentCardBack } from "./StudentCardBack";
import { StudentProfileDetails } from "./StudentProfileDetails";

interface StudentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  selectedClassId: string;
  isModalCardFlipped: boolean;
  setIsModalCardFlipped: (val: boolean) => void;
  handlePrintSingle: () => void;
}

export function StudentCardModal({
  isOpen, onClose, student: s, selectedClassId, isModalCardFlipped, setIsModalCardFlipped, handlePrintSingle
}: StudentCardModalProps) {
  if (!isOpen || !s) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 animate-scale-in border border-slate-100">
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors z-20">
          <i className="ri-close-line text-xl" />
        </button>

        <div className="flex flex-col items-center gap-4 shrink-0 mx-auto md:mx-0 w-full max-w-[340px]">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview Kartu (Klik untuk Balik)</h4>
          <div className="w-full max-w-[340px] h-[215px] card-perspective cursor-pointer" onClick={() => setIsModalCardFlipped(!isModalCardFlipped)}>
            <div className={"card-inner " + (isModalCardFlipped ? "is-flipped" : "")}>
              <StudentCardFront s={s} selectedClassId={selectedClassId} />
              <StudentCardBack s={s} />
            </div>
          </div>
          <Button onClick={handlePrintSingle} className="w-full h-10 rounded-xl bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-black text-xs gap-2 shadow-md shadow-primary/10 mt-2">
            <i className="ri-printer-line text-sm" /> Cetak Kartu Ini
          </Button>
        </div>

        <StudentProfileDetails s={s} />
      </div>
    </div>
  );
}
