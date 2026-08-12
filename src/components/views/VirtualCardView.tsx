'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function VirtualCardView() {
  const { students, classes } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 print:space-y-0 print:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h3 className="text-lg font-black text-slate-850 tracking-tight flex items-center gap-2">
            <i className="ri-contacts-fill text-primary" /> Kartu Siswa Virtual
          </h3>
          <p className="text-xs text-slate-500 font-semibold">Cetak kartu pelajar virtual resmi dilengkapi QR Code absensi digital</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-bold outline-none focus:ring-2 focus:ring-primary/20 h-10 shadow-sm"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <Button
            onClick={handlePrint}
            disabled={filteredStudents.length === 0}
            className="h-10 rounded-xl font-black text-xs bg-primary hover:bg-primary-dark text-white gap-2 shadow-md shadow-primary/10"
          >
            <i className="ri-printer-line text-sm" /> Cetak Kartu Kelas ({filteredStudents.length})
          </Button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Card className="p-8 text-center text-slate-450 font-bold text-xs bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl print:hidden">
          <i className="ri-user-unfollow-line text-3xl block text-slate-350 mb-2" />
          Belum ada data siswa di kelas ini.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center print:grid-cols-2 print:gap-4 print:bg-white print:w-full print:block">
          {filteredStudents.map(s => {
            const isFlipped = !!flippedCards[s.id];
            return (
              <div
                key={s.id}
                className="w-[340px] h-[215px] card-perspective cursor-pointer print:w-[340px] print:h-[215px] print:mb-6 print:inline-block print:mx-2 print:break-inside-avoid"
                onClick={() => toggleFlip(s.id)}
              >
                <div
                  className={`card-inner ${isFlipped ? 'is-flipped' : ''} print:[transform:none]`}
                >
                  
                  {/* SISI DEPAN */}
                  <div className="card-front print:relative print:[backface-visibility:visible] rounded-[18px] overflow-hidden border border-white/80 bg-gradient-to-br from-teal-600 to-cyan-700 text-white shadow-md p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-2 border-b border-white/20 pb-2">
                      <img src="/assets/logo-sdn-bobong.png" alt="Logo" className="w-8 h-8 object-contain" />
                      <div className="leading-tight text-left">
                        <h4 className="text-[10px] font-black tracking-wider uppercase">Kartu Identitas Siswa</h4>
                        <h5 className="text-[11px] font-black text-secondary">SD Negeri Bobong</h5>
                        <p className="text-[7px] text-white/70 font-semibold">Kec. Taliabu Barat, Kab. Pulau Taliabu</p>
                      </div>
                    </div>

                    <div className="flex-1 flex gap-3 pt-3 items-center">
                      <div className="w-16 h-20 rounded-lg bg-white/10 border border-white/25 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        <i className="ri-user-3-line text-3xl text-white/50" />
                      </div>
                      
                      <div className="flex-1 text-left space-y-1 text-[9px] font-bold text-white/90">
                        <div>
                          <span className="text-[7px] text-white/60 block leading-none">NAMA LENGKAP</span>
                          <span className="font-extrabold uppercase text-white tracking-wide truncate block max-w-[180px]">{s.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div>
                            <span className="text-[7px] text-white/60 block leading-none">NISN</span>
                            <span>{s.nisn || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[7px] text-white/60 block leading-none">KELAS</span>
                            <Badge className="bg-secondary text-slate-900 text-[8px] px-1.5 py-0 rounded font-black h-4 mt-0.5">{selectedClassId}</Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-[7px] text-white/60 block leading-none">NIK</span>
                          <span>{s.nik || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/15 pt-2 text-[6px] text-white/75 font-bold">
                      <span>Berlaku Selama Menjadi Siswa</span>
                      <div className="text-right leading-none relative">
                        <span className="block mb-0.5">Mengetahui,</span>
                        <span className="block font-black text-white">Kepala Sekolah</span>
                        <div className="absolute right-0 bottom-[-5px] w-12 h-12 bg-blue-500/10 rounded-full border border-blue-500/30 flex items-center justify-center text-[5px] text-blue-500/80 font-black uppercase rotate-[-12deg] tracking-tighter">
                          SDN BOBONG
                        </div>
                        <span className="block font-extrabold text-white mt-4 border-t border-white/30 pt-0.5">Husnita Usman, M.Pd</span>
                      </div>
                    </div>
                  </div>

                  {/* SISI BELAKANG */}
                  <div className="card-back print:relative print:[backface-visibility:visible] print:[transform:none] rounded-[18px] overflow-hidden border border-slate-200 bg-white text-slate-800 shadow-md p-4 flex flex-col justify-between print:mt-4">
                    <div className="border-b border-slate-100 pb-1 text-center">
                      <h4 className="text-[9px] font-black text-primary-dark tracking-wide uppercase">TATA TERTIB &amp; KETENTUAN KARTU</h4>
                    </div>

                    <div className="flex-1 flex gap-3 pt-3 items-center">
                      <ol className="flex-1 text-left list-decimal list-inside text-[7px] text-slate-500 font-bold space-y-1">
                        <li>Kartu ini adalah identitas resmi siswa SD Negeri Bobong.</li>
                        <li>Wajib dibawa setiap hari dan saat kegiatan belajar.</li>
                        <li>Gunakan QR Code di samping untuk presensi kehadiran harian.</li>
                        <li>Kartu tidak boleh dipindahtangankan/disalahgunakan.</li>
                      </ol>

                      <div className="w-18 h-18 bg-slate-50 border border-slate-100 rounded-lg p-1 flex items-center justify-center shrink-0">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0A7E8D&data=${encodeURIComponent(s.id)}`} 
                          alt="QR Code" 
                          className="w-16 h-16 object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-2 text-[6px] text-slate-400 font-bold text-center leading-tight">
                      <p>SD NEGERI BOBONG - Jln. Lintas Bobong, Kec. Taliabu Barat, Pulau Taliabu</p>
                      <p className="text-[5px] text-slate-350">ID: {s.id}</p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
