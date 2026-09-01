'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { saveStudentToSupabase } from '@/lib/supabase';

interface SyncDapodikModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: any[];
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  syncData: () => Promise<void>;
}

export function SyncDapodikModal({ isOpen, onClose, classes, showToast, syncData }: SyncDapodikModalProps) {
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('manual');
  const [wsUrl, setWsUrl] = useState('http://localhost:5774');
  const [wsToken, setWsToken] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Normalizer for mapping Rombel/Class
  const matchClassId = (dapodikRombel: string) => {
    if (!dapodikRombel) return classes[0]?.id || '1A';
    const normalizedDapodik = dapodikRombel.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const matched = classes.find(c => {
      const normalizedClass = c.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const normalizedClassName = c.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      return normalizedDapodik.includes(normalizedClass) || 
             normalizedDapodik.includes(normalizedClassName) || 
             normalizedClass.includes(normalizedDapodik);
    });
    return matched ? matched.id : (classes[0]?.id || '1A');
  };

  // Convert raw Dapodik data row to Supabase Student schema
  const mapDapodikRowToStudent = (s: any) => {
    const id = s.peserta_didik_id || s.id || crypto.randomUUID();
    const tempat = s.tempat_lahir || s.tempatLahir || '';
    const tanggal = s.tanggal_lahir || s.tanggalLahir || '';
    const birthInfo = tempat && tanggal ? `${tempat}, ${tanggal}` : (tempat || tanggal || undefined);
    
    return {
      id,
      nis: s.nipd || s.nis || id,
      name: s.nama || s.name || 'Siswa Tanpa Nama',
      classId: matchClassId(s.nama_rombel || s.rombel || s.classId),
      gender: s.jenis_kelamin === 'P' || s.gender === 'P' ? 'P' : 'L',
      nisn: s.nisn || undefined,
      nik: s.nik || undefined,
      birthInfo,
      parentName: s.nama_ibu_kandung || s.namaIbu || s.nama_ayah || s.namaAyah || undefined,
      religion: s.agama || s.religion || 'Islam',
      parentJob: s.pekerjaan_ayah || s.pekerjaan_ibu || s.parentJob || undefined,
      address: s.alamat_jalan || s.alamat || s.address || undefined,
      admissionYear: s.tahun_masuk || s.admissionYear || new Date().getFullYear().toString(),
      scoreFormatif: 0,
      scoreSumatif: 0,
      scoreSts: 0,
      scoreSas: 0
    };
  };

  // Parse direct raw json data
  const handleProcessManualJson = () => {
    if (!jsonInput.trim()) {
      showToast('Input JSON masih kosong', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const rows = Array.isArray(parsed) ? parsed : (parsed.rows || parsed.data || []);
      
      if (!Array.isArray(rows) || rows.length === 0) {
        showToast('Format JSON tidak valid atau tidak memiliki baris data siswa', 'error');
        return;
      }

      const mapped = rows.map(mapDapodikRowToStudent);
      setPreviewData(mapped);
      showToast(`Berhasil memetakan ${mapped.length} data siswa`, 'success');
    } catch (e: any) {
      showToast(`Gagal membaca JSON: ${e.message}`, 'error');
    }
  };

  // Connect to live local Dapodik API (Metode A)
  const handleFetchAuto = async () => {
    if (!wsToken.trim()) {
      showToast('Token Web Service wajib diisi', 'error');
      return;
    }

    setLoading(true);
    setPreviewData([]);
    try {
      // API call: fetch directly to localhost via browser client
      const response = await fetch(`${wsUrl}/dapodik/api/v1/getSiswa?token=${wsToken}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      
      const parsed = await response.json();
      const rows = Array.isArray(parsed) ? parsed : (parsed.rows || parsed.data || []);
      
      if (rows.length === 0) {
        showToast('Tidak ada data siswa ditemukan di Web Service', 'error');
      } else {
        const mapped = rows.map(mapDapodikRowToStudent);
        setPreviewData(mapped);
        showToast(`Koneksi berhasil! ${mapped.length} data siswa siap diproses`, 'success');
      }
    } catch (e: any) {
      showToast('Koneksi gagal. Pastikan ekstensi bypass CORS aktif atau gunakan Metode B (Salin-Tempel JSON)', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Commit mapped students to Supabase Cloud database
  const handleSaveToSupabase = async () => {
    if (previewData.length === 0) return;
    setLoading(true);
    try {
      let successCount = 0;
      for (const student of previewData) {
        await saveStudentToSupabase(student);
        successCount++;
      }
      await syncData();
      showToast(`Sukses sinkronisasi ${successCount} siswa dari Dapodik!`, 'success');
      setPreviewData([]);
      setJsonInput('');
      setWsToken('');
      onClose();
    } catch (e: any) {
      showToast(`Gagal menyimpan ke database: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 text-slate-800 border-none shadow-2xl">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="text-sm font-black flex items-center gap-2 text-primary-dark">
            <i className="ri-exchange-funds-line text-lg" /> Sinkronisasi Data Siswa Dapodik
          </DialogTitle>
        </DialogHeader>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 mt-2 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('manual'); setPreviewData([]); }}
            className={`px-4 py-2 border-b-2 transition-all ${activeTab === 'manual' ? 'border-primary text-primary font-black' : 'border-transparent text-slate-400'}`}
          >
            Metode B: Tempel JSON (Rekomendasi)
          </button>
          <button
            onClick={() => { setActiveTab('auto'); setPreviewData([]); }}
            className={`px-4 py-2 border-b-2 transition-all ${activeTab === 'auto' ? 'border-primary text-primary font-black' : 'border-transparent text-slate-400'}`}
          >
            Metode A: Tarik Otomatis API
          </button>
        </div>

        {/* Manual Tab content */}
        {activeTab === 'manual' && (
          <div className="space-y-3 pt-3">
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-bold leading-relaxed space-y-1">
              <p className="text-primary font-extrabold">Cara Mengambil Data JSON Dapodik:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Buka tab baru dan ketik: <code className="bg-slate-200/60 px-1 rounded text-red-600">http://localhost:5774/dapodik/api/v1/getSiswa?token=TOKEN_ANDA</code></li>
                <li>Tekan tombol <kbd className="bg-white border px-1 rounded shadow-sm text-slate-700">Ctrl + A</kbd> (pilih semua teks) dan salin (<kbd className="bg-white border px-1 rounded shadow-sm text-slate-700">Ctrl + C</kbd>).</li>
                <li>Tempelkan teks JSON tersebut ke kolom di bawah ini lalu klik tombol proses.</li>
              </ol>
            </div>

            <textarea
              placeholder="Tempel JSON data siswa Dapodik di sini..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-32 text-[10px] font-mono p-3 rounded-xl border border-slate-200 bg-slate-50/20 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />

            <Button
              onClick={handleProcessManualJson}
              className="w-full h-9 text-xs font-black bg-primary hover:bg-primary-dark text-white rounded-xl"
            >
              Proses Data JSON
            </Button>
          </div>
        )}

        {/* Auto Tab content */}
        {activeTab === 'auto' && (
          <div className="space-y-3 pt-3">
            <div className="bg-amber-50/60 border border-amber-200 text-amber-800 p-3 rounded-xl text-[10px] font-bold leading-relaxed">
              <i className="ri-alert-line mr-1 text-sm align-middle" /> 
              Koneksi langsung membutuhkan ekstensi bypass CORS browser diaktifkan pada browser Anda, karena browser melarang memanggil API lokal dari domain HTTPS.
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-500">URL Web Service</label>
                <Input
                  type="text"
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                  className="h-9 text-xs rounded-xl focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-500">Token Dapodik</label>
                <Input
                  type="password"
                  placeholder="Kunci API"
                  value={wsToken}
                  onChange={(e) => setWsToken(e.target.value)}
                  className="h-9 text-xs rounded-xl focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <Button
              onClick={handleFetchAuto}
              disabled={loading}
              className="w-full h-9 text-xs font-black bg-primary hover:bg-primary-dark text-white rounded-xl"
            >
              {loading ? 'Menghubungkan...' : 'Koneksikan & Ambil Data'}
            </Button>
          </div>
        )}

        {/* Data Preview Table */}
        {previewData.length > 0 && (
          <div className="mt-4 space-y-3 text-left">
            <div className="flex justify-between items-center">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Preview Hasil Pemetaan ({previewData.length} Siswa)</h5>
              <Badge className="bg-teal-500/10 text-teal-700 border border-teal-500/20 text-[9px] font-black rounded-lg">Siap Disinkronkan</Badge>
            </div>

            <div className="border border-slate-200/80 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
              <table className="w-full text-left text-[10px] border-collapse">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200/80 font-bold text-slate-600">
                  <tr>
                    <th className="p-2">Nama Lengkap</th>
                    <th className="p-2">NISN</th>
                    <th className="p-2">L/P</th>
                    <th className="p-2">Pemetaan Kelas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
                  {previewData.slice(0, 10).map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td className="p-2 font-bold truncate max-w-[150px]">{s.name}</td>
                      <td className="p-2">{s.nisn || '-'}</td>
                      <td className="p-2">{s.gender}</td>
                      <td className="p-2">
                        <Badge className="bg-primary/10 text-primary font-black border border-primary/25 rounded px-1.5 py-0.5">{s.classId}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <div className="bg-slate-50 p-2 text-center text-[9px] font-bold text-slate-400 border-t border-slate-100">
                  + {previewData.length - 10} data siswa lainnya...
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4 print:hidden">
              <Button
                variant="outline"
                onClick={() => setPreviewData([])}
                className="flex-1 h-10 rounded-xl font-bold text-xs"
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveToSupabase}
                disabled={loading}
                className="flex-1 h-10 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md shadow-teal-500/10"
              >
                {loading ? 'Menyimpan...' : 'Simpan & Sinkronkan ke Database'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
