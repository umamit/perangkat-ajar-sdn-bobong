import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function RekapJurnalFilters({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, selectedTeacherNip, setSelectedTeacherNip, months, years, teachers }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <Label className="font-bold text-slate-600">Pilih Bulan</Label>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="h-10 rounded-xl bg-white border-slate-200"><SelectValue placeholder="Bulan" /></SelectTrigger>
          <SelectContent className="bg-white">{months.map((m: any) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="font-bold text-slate-600">Pilih Tahun</Label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="h-10 rounded-xl bg-white border-slate-200"><SelectValue placeholder="Tahun" /></SelectTrigger>
          <SelectContent className="bg-white">{years.map((y: any) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="font-bold text-slate-600">Guru Mengajar</Label>
        <Select value={selectedTeacherNip} onValueChange={setSelectedTeacherNip}>
          <SelectTrigger className="h-10 rounded-xl bg-white border-slate-200"><SelectValue placeholder="Semua Guru" /></SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL">Semua Guru ({teachers.length})</SelectItem>
            {teachers.map((t: any) => <SelectItem key={t.nip} value={t.nip}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
