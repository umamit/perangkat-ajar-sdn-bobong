import React from "react";

export function AiModeTabs({ mode, setMode }: any) {
  const modes = [
    { id: "modul_ajar", icon: "ri-book-open-line", label: "Modul Ajar (RPP)" },
    { id: "alur_tujuan", icon: "ri-node-tree", label: "Alur Tujuan (ATP)" },
    { id: "lkpd_interaktif", icon: "ri-pages-line", label: "Lembar Kerja (LKPD)" },
    { id: "soal_asesmen", icon: "ri-file-list-3-line", label: "Bank Soal Asesmen" },
    { id: "projek_p5", icon: "ri-palette-line", label: "Rancangan P5" },
    { id: "konsultasi", icon: "ri-question-answer-line", label: "Tanya Jawab Pedagogi" }
  ];

  return (
    <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={"px-3 py-2 text-xs font-black rounded-xl transition-all duration-300 " + (
            mode === m.id ? "bg-primary text-white shadow-md shadow-primary/10" : "bg-white/60 text-slate-600 hover:bg-slate-50 border border-slate-100"
          )}
        >
          <i className={m.icon + " mr-1"} /> {m.label}
        </button>
      ))}
    </div>
  );
}
