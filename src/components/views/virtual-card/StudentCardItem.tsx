"use client";

import React from "react";
import { StudentCardFront } from "./StudentCardFront";
import { StudentCardBack } from "./StudentCardBack";

interface StudentCardItemProps {
  student: any;
  selectedClassId: string;
  isFlipped?: boolean;
  onFlip?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

export function StudentCardItem({
  student: s, selectedClassId, isFlipped = false, onFlip, onClick
}: StudentCardItemProps) {
  return (
    <div className="max-w-[340px] w-full h-[215px] card-perspective cursor-pointer print:w-[340px] print:h-auto print:mb-12 print:inline-block print:mx-2 print:break-inside-avoid relative group mx-auto" onClick={onClick}>
      <div className={"card-inner print:hidden " + (isFlipped ? "is-flipped" : "")}>
        <StudentCardFront s={s} selectedClassId={selectedClassId} />
        <StudentCardBack s={s} />
      </div>

      <div className="hidden print:flex print:flex-col print:gap-6 print:items-center">
        <StudentCardFront s={s} selectedClassId={selectedClassId} />
        <StudentCardBack s={s} />
      </div>

      {onFlip && (
        <button onClick={onFlip} className="absolute bottom-3 right-3 w-7 h-7 bg-white/95 text-slate-700 hover:bg-slate-100 hover:text-primary rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-105 z-10 print:hidden" title="Balik Kartu">
          <i className="ri-loop-left-line text-xs font-bold" />
        </button>
      )}
    </div>
  );
}
