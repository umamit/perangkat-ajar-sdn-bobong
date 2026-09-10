import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AiResultCard({ result, onCopy }: any) {
  if (!result) return null;
  return (
    <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden animate-fade-in">
      <CardHeader className="pb-2 border-b border-slate-100 bg-white/35 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
          <i className="ri-article-line text-primary" /> Hasil AI Kurikulum Merdeka
        </CardTitle>
        <Button onClick={onCopy} variant="outline" size="sm" className="text-[10px] font-black h-8 rounded-lg border-slate-200 hover:bg-slate-50 gap-1">
          <i className="ri-file-copy-line" /> Salin Teks
        </Button>
      </CardHeader>
      <CardContent className="pt-4 p-4">
        <div className="prose prose-slate max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100 overflow-x-auto">
          {result}
        </div>
      </CardContent>
    </Card>
  );
}
