import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LkpdItem } from "@/types/lkpd";

interface LkpdCardItemProps {
  item: LkpdItem;
  classNameTitle: string;
  isOwner: boolean;
  onDelete: (id: string) => void;
  onDownloadPdf: (item: LkpdItem) => void;
}

export function LkpdCardItem({ item, classNameTitle, isOwner, onDelete, onDownloadPdf }: LkpdCardItemProps) {
  return (
    <Card className="rounded-2xl border border-white/85 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/20">
      <CardHeader className="pb-2 bg-white/35 border-b border-slate-100/50">
        <div className="flex justify-between items-center">
          <Badge variant="default" className="font-black text-[10px] rounded-lg px-2.5 py-0.5">
            {classNameTitle}
          </Badge>
          <div className="flex items-center gap-1.5">
            {isOwner && (
              <button
                onClick={() => onDelete(item.id)}
                className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                title="Hapus LKPD"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shadow-inner">
              <i className="ri-article-line text-base" />
            </div>
          </div>
        </div>
        <CardTitle className="text-sm font-extrabold text-slate-800 mt-3 line-clamp-1">
          {item.fileUrl ? (
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline inline-flex items-center gap-1 group transition-colors"
              title="Klik untuk membuka/melihat berkas LKPD"
            >
              <span>{item.title}</span>
              <i className="ri-external-link-line text-xs text-slate-400 group-hover:text-primary" />
            </a>
          ) : (
            item.title
          )}
        </CardTitle>
        <div className="text-[10px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
          <i className="ri-user-line text-[10px]" />
          <span>Oleh: {item.teacherName || "Guru Mata Pelajaran"}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-xs pt-4">
        {item.tp && (
          <div className="space-y-1">
            <span className="font-black text-slate-400 text-[10px] uppercase tracking-wider block">
              Tujuan Pembelajaran:
            </span>
            <p className="text-slate-600 font-semibold line-clamp-2 leading-relaxed">
              {item.tp}
            </p>
          </div>
        )}
        <div className="space-y-1">
          <span className="font-black text-slate-400 text-[10px] uppercase tracking-wider block">
            Petunjuk Singkat:
          </span>
          <p className="text-slate-600 font-semibold line-clamp-2 leading-relaxed">
            {item.instructions || "Kerjakan sesuai instruksi guru mata pelajaran."}
          </p>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 font-bold">
          <span className="text-slate-400 text-[10px] font-medium">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "Terjadwal"}
          </span>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadPdf(item)}
              className="h-8 rounded-lg text-[10px] font-black text-rose-700 border-rose-300 hover:bg-rose-50/50 gap-1"
            >
              <i className="ri-file-pdf-2-line text-rose-600" /> Cetak PDF
            </Button>
            {item.fileUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.fileUrl, "_blank")}
                className="h-8 rounded-lg text-[10px] font-black text-emerald-700 bg-emerald-50/50 border-emerald-300 hover:bg-emerald-100/60 gap-1"
                title="Buka dan lihat berkas LKPD"
              >
                <i className="ri-eye-line text-emerald-600" /> Lihat Berkas
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
