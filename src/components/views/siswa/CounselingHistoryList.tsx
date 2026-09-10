import React from "react";

export function CounselingHistoryList({ studentLogs, isKepsek, handleDelete }: any) {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "Bimbingan": return "bg-cyan-50 text-cyan-600 border-cyan-200/80";
      case "Konseling": return "bg-rose-50 text-rose-600 border-rose-200/80";
      case "Kunjungan Rumah": return "bg-amber-50 text-amber-600 border-amber-200/80";
      case "Telepon Orang Tua": return "bg-emerald-50 text-emerald-600 border-emerald-200/80";
      default: return "bg-slate-50 text-slate-600 border-slate-200/80";
    }
  };

  return (
    <div className={isKepsek ? "md:col-span-7 space-y-3" : "md:col-span-12 space-y-3"}>
      <h3 className="font-bold text-slate-600 flex items-center gap-1.5 border-b pb-1 text-xs">
        <i className="ri-history-line" /> Riwayat Pembinaan ({studentLogs.length})
      </h3>
      {studentLogs.length === 0 ? (
        <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
          <i className="ri-chat-history-line text-2xl opacity-60 mb-1.5 block" />
          Belum ada catatan bimbingan siswa ini.
        </div>
      ) : (
        <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
          {studentLogs.map((log: any) => (
            <div key={log.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl relative space-y-1">
              <div className="flex items-center justify-between gap-1.5">
                <span className={"px-2 py-0.5 rounded-full border text-[9px] font-black " + getCategoryBadge(log.category)}>
                  {log.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">{log.date}</span>
                  {isKepsek && (
                    <button type="button" onClick={() => log.id && handleDelete(log.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded" title="Hapus Catatan">
                      <i className="ri-delete-bin-6-line" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium mt-1">{log.notes}</p>
              {log.followUp && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-600">Tindak Lanjut: </span>{log.followUp}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
