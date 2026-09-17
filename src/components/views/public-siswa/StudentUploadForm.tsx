'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export interface ParsedStudent {
  name: string;
  nis: string;
  gender: 'L' | 'P';
}

interface StudentUploadFormProps {
  onAddBatch: (list: ParsedStudent[]) => void;
  onAddSingle: (s: ParsedStudent) => void;
  onError: (msg: string) => void;
}

export function StudentUploadForm({ onAddBatch, onAddSingle, onError }: StudentUploadFormProps) {
  const [fileName, setFileName] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualNis, setManualNis] = useState('');
  const [manualGender, setManualGender] = useState<'L' | 'P'>('L');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(ws);

        const list: ParsedStudent[] = [];
        rows.forEach((row) => {
          const keys = Object.keys(row);
          const findVal = (...names: string[]) => {
            const k = keys.find((key) => names.some((n) => key.toLowerCase().trim() === n.toLowerCase().trim()));
            return k ? String(row[k]).trim() : '';
          };
          let name = findVal('Nama Lengkap', 'Nama', 'name', 'Nama Siswa', 'siswa');
          let nis = findVal('NISN', 'NIS', 'No Induk', 'id');
          let genderVal = findVal('Jenis Kelamin', 'gender', 'JK', 'L/P');

          if (!name && keys.length >= 2) {
            const v1 = String(row[keys[0]] || '').trim();
            const v2 = String(row[keys[1]] || '').trim();
            if (isNaN(Number(v2)) && v2.length > 2) { name = v2; nis = v1; }
            else if (isNaN(Number(v1)) && v1.length > 2) { name = v1; }
          }

          if (name && name.toLowerCase() !== 'nama' && name.toLowerCase() !== 'nama lengkap') {
            const gender = (genderVal.toUpperCase().startsWith('P') || genderVal.toUpperCase().startsWith('W')) ? 'P' : 'L';
            list.push({ name, nis, gender });
          }
        });

        if (list.length === 0) onError('Tidak ditemukan baris data siswa yang valid di file Excel.');
        else onAddBatch(list);
      } catch {
        onError('Gagal membaca file Excel. Pastikan format .xlsx atau .xls valid.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    onAddSingle({ name: manualName.trim(), nis: manualNis.trim(), gender: manualGender });
    setManualName('');
    setManualNis('');
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-slate-100/50 transition-all">
        <i className="ri-file-excel-2-line text-3xl text-emerald-600 block mb-1" />
        <p className="text-xs font-bold text-slate-800">Unggah File Excel / CSV Data Siswa</p>
        <p className="text-[11px] text-slate-400 font-medium mb-3">Kolom: Nama Lengkap, NISN, Jenis Kelamin (L/P)</p>
        <label className="inline-block cursor-pointer px-4 py-2 rounded-xl text-xs font-black bg-primary text-white hover:brightness-105 shadow-md shadow-primary/20">
          Pilih File Excel
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
        </label>
        {fileName && <p className="text-xs text-primary font-bold mt-2">Terpilih: {fileName}</p>}
      </div>

      <form onSubmit={handleManual} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
        <span className="text-[11px] font-bold text-slate-600 block">Atau Tambah Satuan Secara Manual:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Nama Siswa"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold outline-none"
          />
          <input
            type="text"
            placeholder="NISN (Opsional)"
            value={manualNis}
            onChange={(e) => setManualNis(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold outline-none"
          />
          <div className="flex gap-1.5">
            <select
              value={manualGender}
              onChange={(e) => setManualGender(e.target.value as 'L' | 'P')}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold outline-none"
            >
              <option value="L">L</option>
              <option value="P">P</option>
            </select>
            <button type="submit" className="flex-1 h-9 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900">
              Tambah
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
