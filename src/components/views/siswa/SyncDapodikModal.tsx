"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SyncPreviewTable } from "./SyncPreviewTable";
import { mapDapodikRowToStudent, syncDapodikToSupabase } from "./syncDapodikLogic";

export function SyncDapodikModal({ isOpen, onClose, classes, showToast, syncData }: any) {
  const [activeTab, setActiveTab] = useState<"auto" | "manual">("manual");
  const [wsUrl, setWsUrl] = useState("http://localhost:5774");
  const [wsToken, setWsToken] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleProcessManualJson = () => {
    if (!jsonInput.trim()) return showToast("Input JSON masih kosong", "error");
    try {
      const parsed = JSON.parse(jsonInput);
      const rows = Array.isArray(parsed) ? parsed : (parsed.rows || parsed.data || []);
      if (!Array.isArray(rows) || rows.length === 0) return showToast("Format JSON tidak valid atau tidak memiliki baris data", "error");
      const mapped = rows.map(r => mapDapodikRowToStudent(r, classes));
      setPreviewData(mapped);
      showToast("Berhasil memetakan " + mapped.length + " data siswa", "success");
    } catch (e: any) { showToast("Gagal membaca JSON: " + e.message, "error"); }
  };

  const handleFetchAuto = async () => {
    if (!wsToken.trim()) return showToast("Token Web Service wajib diisi", "error");
    setLoading(true); setPreviewData([]);
    try {
      const response = await fetch(wsUrl + "/dapodik/api/v1/getSiswa?token=" + wsToken, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("HTTP Error " + response.status);
      const parsed = await response.json();
      const rows = Array.isArray(parsed) ? parsed : (parsed.rows || parsed.data || []);
      if (rows.length === 0) {
        showToast("Tidak ada data siswa ditemukan di Web Service", "error");
      } else {
        const mapped = rows.map((r: any) => mapDapodikRowToStudent(r, classes));
        setPreviewData(mapped);
        showToast("Koneksi berhasil! " + mapped.length + " data siswa siap", "success");
      }
    } catch {
      showToast("Koneksi gagal. Pastikan ekstensi bypass CORS aktif atau gunakan Metode B", "error");
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (previewData.length === 0) return;
    setLoading(true);
    try {
      const count = await syncDapodikToSupabase(previewData, syncData);
      showToast("Sukses sinkronisasi " + count + " siswa!", "success");
      setPreviewData([]); setJsonInput(""); setWsToken(""); onClose();
    } catch (e: any) {
      showToast("Gagal menyimpan: " + e.message, "error");
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 text-slate-800 border-none shadow-2xl">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="text-sm font-black flex items-center gap-2 text-primary-dark">
            <i className="ri-exchange-funds-line text-lg" /> Sinkronisasi Data Siswa Dapodik
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b border-slate-100 mt-2 text-xs font-bold">
          <button onClick={() => { setActiveTab("manual"); setPreviewData([]); }} className={"px-4 py-2 border-b-2 transition-all " + (activeTab === "manual" ? "border-primary text-primary font-black" : "border-transparent text-slate-400")}>
            Metode B: Tempel JSON (Rekomendasi)
          </button>
          <button onClick={() => { setActiveTab("auto"); setPreviewData([]); }} className={"px-4 py-2 border-b-2 transition-all " + (activeTab === "auto" ? "border-primary text-primary font-black" : "border-transparent text-slate-400")}>
            Metode A: Tarik Otomatis API
          </button>
        </div>

        {activeTab === "manual" && (
          <div className="space-y-3 pt-3">
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-bold leading-relaxed space-y-1">
              <p className="text-primary font-extrabold">Cara Mengambil Data JSON Dapodik:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Buka: <code className="bg-slate-200/60 px-1 rounded text-red-600">http://localhost:5774/dapodik/api/v1/getSiswa?token=TOKEN</code></li>
                <li>Pilih semua teks (Ctrl+A), salin (Ctrl+C), lalu tempel ke bawah.</li>
              </ol>
            </div>
            <textarea placeholder="Tempel JSON data siswa Dapodik di sini..." value={jsonInput} onChange={e => setJsonInput(e.target.value)} className="w-full h-32 text-[10px] font-mono p-3 rounded-xl border border-slate-200 bg-slate-50/20 focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
            <Button onClick={handleProcessManualJson} className="w-full h-9 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white rounded-xl">Proses Data JSON</Button>
          </div>
        )}

        {activeTab === "auto" && (
          <div className="space-y-3 pt-3">
            <div className="bg-amber-50/60 border border-amber-200 text-amber-800 p-3 rounded-xl text-[10px] font-bold">
              Koneksi langsung membutuhkan ekstensi bypass CORS browser karena dipanggil dari HTTPS.
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-500">URL Web Service</label>
                <Input type="text" value={wsUrl} onChange={e => setWsUrl(e.target.value)} className="h-9 text-xs rounded-xl" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-500">Token Dapodik</label>
                <Input type="password" placeholder="Kunci API" value={wsToken} onChange={e => setWsToken(e.target.value)} className="h-9 text-xs rounded-xl" />
              </div>
            </div>
            <Button onClick={handleFetchAuto} disabled={loading} className="w-full h-9 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white rounded-xl">
              {loading ? "Menghubungkan..." : "Koneksikan & Ambil Data"}
            </Button>
          </div>
        )}

        <SyncPreviewTable previewData={previewData} loading={loading} onSave={handleSave} onCancel={() => setPreviewData([])} />
      </DialogContent>
    </Dialog>
  );
}
