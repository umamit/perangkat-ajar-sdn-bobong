import React from "react";
import { Label } from "@/components/ui/label";

export function JournalNotesField({ form, setForm, handleBeautifyNotes, beautifying }: any) {
  return (
    <div className="space-y-1.5 text-xs text-left">
      <div className="flex justify-between items-center mb-0.5">
        <Label htmlFor="jurnalNotes" className="font-bold text-slate-600">Catatan / Refleksi Guru</Label>
        <button
          type="button"
          onClick={handleBeautifyNotes}
          disabled={beautifying}
          className="text-[9px] text-primary hover:bg-cyan-50/50 font-black flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 transition-all active:scale-95 shadow-2xs cursor-pointer"
        >
          {beautifying ? "Memproses..." : <><i className="ri-magic-line text-amber-500" /> Perbaiki dengan AI</>}
        </button>
      </div>
      <textarea
        id="jurnalNotes"
        value={form.notes}
        onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))}
        placeholder="Catatan perkembangan atau kendala pembelajaran..."
        rows={3}
        className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
      />
    </div>
  );
}
