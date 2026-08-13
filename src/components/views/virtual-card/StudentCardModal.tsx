'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudentCardItem } from './StudentCardItem';

interface StudentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  selectedClassId: string;
  isModalCardFlipped: boolean;
  setIsModalCardFlipped: (val: boolean) => void;
  handlePrintSingle: () => void;
}

export function StudentCardModal({
  isOpen,
  onClose,
  student: s,
  selectedClassId,
  isModalCardFlipped,
  setIsModalCardFlipped,
  handlePrintSingle
}: StudentCardModalProps) {
  if (!isOpen || !s) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:static print:bg-white print:p-0 print:inset-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 animate-scale-in border border-slate-100 print:static print:shadow-none print:border-none print:p-0 print:bg-white">
        
        {/* Close Button: Hidden on print */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors z-20 print:hidden"
        >
          <i className="ri-close-line text-xl" />
        </button>

        {/* Left Column: Interactive Card Preview */}
        <div className="flex flex-col items-center gap-4 shrink-0 mx-auto md:mx-0">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:hidden">Preview Kartu (Klik untuk Balik)</h4>
          
          {/* 3D Flip Card Container */}
          <div
            className="w-[340px] h-[215px] card-perspective cursor-pointer print:hidden"
            onClick={() => setIsModalCardFlipped(!isModalCardFlipped)}
          >
            <div className={`card-inner ${isModalCardFlipped ? 'is-flipped' : ''}`}>
              {/* FRONT */}
              <div className="card-front rounded-[18px] overflow-hidden border border-teal-100 bg-gradient-to-br from-teal-50/60 via-slate-50 to-teal-50/30 text-slate-800 p-0 flex flex-col justify-between">
                {/* Header: Teal Gradient with gold bottom stripe */}
                <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white px-4 py-2.5 flex items-center gap-2 relative">
                  <img src="/assets/logo-sdn-bobong.png" alt="Logo" className="w-8 h-8 object-contain" />
                  <div className="leading-tight text-left">
                    <h4 className="text-[9px] font-black tracking-wider uppercase">Kartu Identitas Siswa</h4>
                    <h5 className="text-[11px] font-black text-secondary">SD Negeri Bobong</h5>
                    <p className="text-[5.5px] text-white/75 font-semibold">Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E5A900]" />
                </div>

                <div className="flex-1 flex gap-3 px-4 pt-3 items-center">
                  <div className="w-16 h-20 rounded-lg bg-white border border-teal-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    <i className="ri-user-3-line text-3xl text-slate-350" />
                  </div>
                  <div className="flex-1 text-left space-y-1 text-[9px] font-bold text-slate-700">
                    <div>
                      <span className="text-[7px] text-slate-400 block leading-none">NAMA LENGKAP</span>
                      <span className="font-extrabold uppercase text-slate-900 tracking-wide truncate block max-w-[180px]">{s.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <span className="text-[7px] text-slate-400 block leading-none">NISN</span>
                        <span className="text-slate-800">{s.nisn || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-slate-400 block leading-none">KELAS</span>
                        <Badge className="bg-primary/10 text-primary border border-primary/20 text-[8px] px-1.5 py-0.5 rounded font-black h-4 mt-0.5">{selectedClassId}</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-[7px] text-slate-400 block leading-none">NIK</span>
                      <span className="text-slate-800">{s.nik || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-slate-100 px-4 pb-3 pt-1.5 text-[6px] text-slate-500 font-bold bg-slate-50/50">
                  <span>Berlaku Selama Menjadi Siswa</span>
                  <div className="text-right leading-none relative">
                    <span className="block mb-0.5">Mengetahui,</span>
                    <span className="block font-black text-slate-700">Kepala Sekolah</span>
                    <div className="absolute right-0 bottom-[-5px] w-12 h-12 bg-blue-500/5 rounded-full border border-blue-500/20 flex items-center justify-center text-[5px] text-blue-500/50 font-black uppercase rotate-[-12deg] tracking-tighter">
                      SDN BOBONG
                    </div>
                    <span className="block font-extrabold text-slate-700 mt-4 border-t border-slate-200 pt-0.5">Husnita Usman, M.Pd</span>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div className="card-back rounded-[18px] overflow-hidden border border-teal-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 text-slate-800 p-4 flex flex-col justify-between relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-amber-400" />
                <div className="border-b border-teal-500/10 pb-1.5 text-center mt-1">
                  <h4 className="text-[9px] font-black text-primary-dark tracking-wide uppercase">TATA TERTIB &amp; KETENTUAN KARTU</h4>
                </div>
                <div className="flex-1 flex gap-3 pt-3 items-center">
                  <ol className="flex-1 text-left list-decimal list-inside text-[7px] text-slate-600 font-bold space-y-1">
                    <li>Kartu ini adalah identitas resmi siswa SD Negeri Bobong.</li>
                    <li>Wajib dibawa setiap hari dan saat kegiatan belajar.</li>
                    <li>Gunakan QR Code di samping untuk presensi kehadiran harian.</li>
                    <li>Kartu tidak boleh dipindahtangankan/disalahgunakan.</li>
                  </ol>
                  <div className="w-18 h-18 bg-teal-50/40 border border-teal-100 rounded-lg p-1 flex items-center justify-center shrink-0">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0A7E8D&data=${encodeURIComponent(s.id)}`} 
                      alt="QR Code" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
                <div className="border-t border-teal-500/10 pt-2 text-[6px] text-slate-400 font-bold text-center leading-tight">
                  <p>SD NEGERI BOBONG - Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791</p>
                  <p className="text-[5px] text-slate-350">ID: {s.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flat Print Layout for Single Card (Visible only during printing) */}
          <div className="hidden print-single-card print:flex print:flex-col print:gap-6 print:items-center">
            {/* Front Side Print */}
            <div className="w-[340px] h-[215px] rounded-[18px] overflow-hidden border border-teal-100 bg-gradient-to-br from-teal-50/60 via-slate-50 to-teal-50/30 text-slate-800 p-0 flex flex-col justify-between">
              <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white px-4 py-2.5 flex items-center gap-2 relative">
                <img src="/assets/logo-sdn-bobong.png" alt="Logo" className="w-8 h-8 object-contain" />
                <div className="leading-tight text-left">
                  <h4 className="text-[9px] font-black tracking-wider uppercase">Kartu Identitas Siswa</h4>
                  <h5 className="text-[11px] font-black text-secondary">SD Negeri Bobong</h5>
                  <p className="text-[5.5px] text-white/75 font-semibold">Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E5A900]" />
              </div>
              <div className="flex-1 flex gap-3 px-4 pt-3 items-center">
                <div className="w-16 h-20 rounded-lg bg-white border border-teal-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <i className="ri-user-3-line text-3xl text-slate-350" />
                </div>
                <div className="flex-1 text-left space-y-1 text-[9px] font-bold text-slate-700">
                  <div>
                    <span className="text-[7px] text-slate-400 block leading-none">NAMA LENGKAP</span>
                    <span className="font-extrabold uppercase text-slate-900 tracking-wide truncate block max-w-[180px]">{s.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <span className="text-[7px] text-slate-400 block leading-none">NISN</span>
                      <span className="text-slate-800">{s.nisn || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[7px] text-slate-400 block leading-none">KELAS</span>
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[8px] px-1.5 py-0.5 rounded font-black h-4 mt-0.5 inline-block">{selectedClassId}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[7px] text-slate-400 block leading-none">NIK</span>
                    <span className="text-slate-800">{s.nik || '-'}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-slate-100 px-4 pb-3 pt-1.5 text-[6px] text-slate-500 font-bold bg-slate-50/50">
                <span>Berlaku Selama Menjadi Siswa</span>
                <div className="text-right leading-none relative">
                  <span className="block mb-0.5">Mengetahui,</span>
                  <span className="block font-black text-slate-700">Kepala Sekolah</span>
                  <div className="absolute right-0 bottom-[-5px] w-12 h-12 bg-blue-500/5 rounded-full border border-blue-500/20 flex items-center justify-center text-[5px] text-blue-500/50 font-black uppercase rotate-[-12deg] tracking-tighter">
                    SDN BOBONG
                  </div>
                  <span className="block font-extrabold text-slate-700 mt-4 border-t border-slate-200 pt-0.5">Husnita Usman, M.Pd</span>
                </div>
              </div>
            </div>

            {/* Back Side Print */}
            <div className="w-[340px] h-[215px] rounded-[18px] overflow-hidden border border-teal-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 text-slate-800 p-4 flex flex-col justify-between relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-amber-400" />
              <div className="border-b border-teal-500/10 pb-1.5 text-center mt-1">
                <h4 className="text-[9px] font-black text-primary-dark tracking-wide uppercase">TATA TERTIB &amp; KETENTUAN KARTU</h4>
              </div>
              <div className="flex-1 flex gap-3 pt-3 items-center">
                <ol className="flex-1 text-left list-decimal list-inside text-[7px] text-slate-600 font-bold space-y-1">
                  <li>Kartu ini adalah identitas resmi siswa SD Negeri Bobong.</li>
                  <li>Wajib dibawa setiap hari dan saat kegiatan belajar.</li>
                  <li>Gunakan QR Code di samping untuk presensi kehadiran harian.</li>
                  <li>Kartu tidak boleh dipindahtangankan/disalahgunakan.</li>
                </ol>
                <div className="w-18 h-18 bg-teal-50/40 border border-teal-100 rounded-lg p-1 flex items-center justify-center shrink-0">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0A7E8D&data=${encodeURIComponent(s.id)}`} 
                    alt="QR Code" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
              <div className="border-t border-teal-500/10 pt-2 text-[6px] text-slate-400 font-bold text-center leading-tight">
                <p>SD NEGERI BOBONG - Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791</p>
                <p className="text-[5px] text-slate-350">ID: {s.id}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePrintSingle}
            className="w-full h-10 rounded-xl bg-primary hover:bg-primary-dark text-white font-black text-xs gap-2 print:hidden shadow-md shadow-primary/10 mt-2"
          >
            <i className="ri-printer-line text-sm" /> Cetak Kartu Ini
          </Button>
        </div>

        {/* Right Column: Detailed Student Profile */}
        <div className="flex-1 space-y-4 text-left print:hidden">
          <div>
            <span className="text-[9px] font-black text-primary tracking-wider uppercase">Data Induk Profil Lengkap</span>
            <h3 className="text-xl font-black text-slate-800 leading-tight truncate">{s.name}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">NISN</span>
              <span className="text-slate-800">{s.nisn || '-'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">NIK</span>
              <span className="text-slate-800">{s.nik || '-'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Tempat, Tgl Lahir</span>
              <span className="text-slate-800">{s.birthInfo || '-'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Agama</span>
              <span className="text-slate-800">{s.religion || '-'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Nama Orang Tua / Wali</span>
              <span className="text-slate-800">{s.parentName || '-'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Pekerjaan Orang Tua</span>
              <span className="text-slate-800">{s.parentJob || '-'}</span>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Alamat Tempat Tinggal</span>
              <span className="block text-slate-650 font-medium leading-relaxed">{s.address || '-'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
