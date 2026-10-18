import React from "react";
import { ExtracurricularRapor } from "@/types/erapor";

interface EraporEkskulSectionProps {
  extracurriculars: ExtracurricularRapor[];
  onUpdateEkskul: (idx: number, field: keyof ExtracurricularRapor, val: string) => void;
}

export function EraporEkskulSection({ extracurriculars, onUpdateEkskul }: EraporEkskulSectionProps) {
  return (
    <div className="space-y-2 pt-2">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
          Kegiatan Ekstrakurikuler
        </h4>
        <span className="text-[10px] font-semibold text-slate-400">
          Klik kolom untuk menyunting kegiatan / predikat / keterangan
        </span>
      </div>

      {/* Tampilan Tabel Desktop */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-300">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-black text-left border-b border-slate-300">
              <th className="p-2 w-10 text-center border-r border-slate-300">No</th>
              <th className="p-2 w-52 border-r border-slate-300">Kegiatan Ekstrakurikuler</th>
              <th className="p-2 w-28 text-center border-r border-slate-300">Predikat</th>
              <th className="p-2">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {extracurriculars.map((eks, idx) => (
              <tr key={eks.no} className="even:bg-slate-50/50">
                <td className="p-2 text-center font-bold text-slate-500 border-r border-slate-200">{eks.no}</td>
                <td className="p-1.5 border-r border-slate-200">
                  <input
                    type="text"
                    value={eks.name}
                    onChange={e => onUpdateEkskul(idx, "name", e.target.value)}
                    className="w-full px-2 py-1 rounded-lg font-extrabold text-slate-800 bg-transparent focus:bg-cyan-50/40 outline-none"
                  />
                </td>
                <td className="p-1.5 text-center border-r border-slate-200">
                  <select
                    value={eks.predicate}
                    onChange={e => onUpdateEkskul(idx, "predicate", e.target.value)}
                    className="px-2 py-1 rounded-lg font-black text-primary bg-transparent focus:bg-cyan-50/40 outline-none text-center"
                  >
                    <option value="Sangat Baik">Sangat Baik</option>
                    <option value="Baik">Baik</option>
                    <option value="Cukup">Cukup</option>
                    <option value="-">-</option>
                  </select>
                </td>
                <td className="p-1.5">
                  <input
                    type="text"
                    value={eks.description}
                    onChange={e => onUpdateEkskul(idx, "description", e.target.value)}
                    className="w-full px-2 py-1 rounded-lg text-[11px] text-slate-700 bg-transparent focus:bg-cyan-50/40 outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tampilan Kartu Mobile */}
      <div className="sm:hidden space-y-2">
        {extracurriculars.map((eks, idx) => (
          <div key={eks.no} className="p-3 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2 text-xs">
            <div className="flex justify-between items-center gap-2">
              <input
                type="text"
                value={eks.name}
                onChange={e => onUpdateEkskul(idx, "name", e.target.value)}
                className="font-extrabold text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200 flex-1"
              />
              <select
                value={eks.predicate}
                onChange={e => onUpdateEkskul(idx, "predicate", e.target.value)}
                className="px-2 py-1 rounded-lg bg-primary/10 text-primary font-black text-xs"
              >
                <option value="Sangat Baik">Sangat Baik</option>
                <option value="Baik">Baik</option>
                <option value="Cukup">Cukup</option>
                <option value="-">-</option>
              </select>
            </div>
            <input
              type="text"
              value={eks.description}
              onChange={e => onUpdateEkskul(idx, "description", e.target.value)}
              className="w-full text-[11px] text-slate-600 bg-white px-2 py-1.5 rounded-lg border border-slate-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
