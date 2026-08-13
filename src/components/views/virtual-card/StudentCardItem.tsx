'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StudentCardItemProps {
  student: any;
  selectedClassId: string;
  isFlipped?: boolean;
  onFlip?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

export function StudentCardItem({
  student: s,
  selectedClassId,
  isFlipped = false,
  onFlip,
  onClick
}: StudentCardItemProps) {
  return (
    <div
      className="w-[340px] h-[215px] card-perspective cursor-pointer print:w-[340px] print:h-[215px] print:mb-6 print:inline-block print:mx-2 print:break-inside-avoid relative group"
      onClick={onClick}
    >
      <div className={`card-inner ${isFlipped ? 'is-flipped' : ''} print:[transform:none]`}>
        
        {/* SISI DEPAN */}
        <div className="card-front print:relative print:[backface-visibility:visible] rounded-[18px] overflow-hidden border border-teal-100 bg-gradient-to-br from-teal-50/60 via-slate-50 to-teal-50/30 text-slate-800 shadow-md flex flex-col justify-between p-0">
          {/* Header: Teal Gradient with gold bottom stripe */}
          <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white px-4 py-2.5 flex items-center gap-2 relative">
            <img src="/assets/logo-sdn-bobong.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div className="leading-tight text-left">
              <h4 className="text-[9px] font-black tracking-wider uppercase">Kartu Identitas Siswa</h4>
              <h5 className="text-[11px] font-black text-secondary">SD Negeri Bobong</h5>
              <p className="text-[6px] text-white/75 font-semibold">Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E5A900]" />
          </div>

          {/* Body */}
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

          {/* Footer */}
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

        {/* SISI BELAKANG */}
        <div className="card-back print:relative print:[backface-visibility:visible] print:[transform:none] rounded-[18px] overflow-hidden border border-teal-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 text-slate-800 shadow-md p-4 flex flex-col justify-between print:mt-4 relative">
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
                loading="lazy"
              />
            </div>
          </div>

          <div className="border-t border-teal-500/10 pt-2 text-[6px] text-slate-400 font-bold text-center leading-tight">
            <p>SD NEGERI BOBONG - Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Prov. Maluku Utara, 97791</p>
            <p className="text-[5px] text-slate-350">ID: {s.id}</p>
          </div>
        </div>

      </div>

      {/* Flip shortcut button in Grid view */}
      {onFlip && (
        <button
          onClick={onFlip}
          className="absolute bottom-3 right-3 w-7 h-7 bg-white/95 text-slate-700 hover:bg-slate-100 hover:text-primary rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-105 z-10 print:hidden"
          title="Balik Kartu"
        >
          <i className="ri-loop-left-line text-xs font-bold" />
        </button>
      )}
    </div>
  );
}
