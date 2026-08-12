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
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isModalCardFlipped, setIsModalCardFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  // Reset selected student when class changes
  useEffect(() => {
    setSelectedStudent(null);
  }, [selectedClassId]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintSingle = () => {
    document.body.classList.add('print-single-active');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-single-active');
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 print:space-y-0 print:p-0">
      {/* Controls: Hidden on print */}
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
        /* Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center print:grid-cols-2 print:gap-4 print:bg-white print:w-full print:block">
          {filteredStudents.map(s => {
            const isFlipped = !!flippedCards[s.id];
            return (
              <div
                key={s.id}
                className="w-[340px] h-[215px] card-perspective cursor-pointer print:w-[340px] print:h-[215px] print:mb-6 print:inline-block print:mx-2 print:break-inside-avoid relative group"
                onClick={() => {
                  setSelectedStudent(s);
                  setIsModalCardFlipped(false);
                }}
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
                        <p className="text-[6.5px] text-white/70 font-semibold">Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu</p>
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
                <button
                  onClick={(e) => toggleFlip(s.id, e)}
                  className="absolute bottom-3 right-3 w-7 h-7 bg-white/95 text-slate-700 hover:bg-slate-100 hover:text-primary rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-105 z-10 print:hidden"
                  title="Balik Kartu"
                >
                  <i className="ri-loop-left-line text-xs font-bold" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL (MODAL POPUP) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:static print:bg-white print:p-0 print:inset-auto">
          {/* Modal Container */}
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 animate-scale-in border border-slate-100 print:static print:shadow-none print:border-none print:p-0 print:bg-white">
            
            {/* Close Button: Hidden on print */}
            <button
              onClick={() => setSelectedStudent(null)}
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
                  <div className="card-front rounded-[18px] overflow-hidden border border-white/80 bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-2 border-b border-white/20 pb-2">
                      <img src="/assets/logo-sdn-bobong.png" alt="Logo" className="w-8 h-8 object-contain" />
                      <div className="leading-tight text-left">
                        <h4 className="text-[10px] font-black tracking-wider uppercase">Kartu Identitas Siswa</h4>
                        <h5 className="text-[11px] font-black text-secondary">SD Negeri Bobong</h5>
                        <p className="text-[6.5px] text-white/70 font-semibold">Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu</p>
                      </div>
                    </div>
                    <div className="flex-1 flex gap-3 pt-3 items-center">
                      <div className="w-16 h-20 rounded-lg bg-white/10 border border-white/25 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        <i className="ri-user-3-line text-3xl text-white/50" />
                      </div>
                      <div className="flex-1 text-left space-y-1 text-[9px] font-bold text-white/90">
                        <div>
                          <span className="text-[7px] text-white/60 block leading-none">NAMA LENGKAP</span>
                          <span className="font-extrabold uppercase text-white tracking-wide truncate block max-w-[180px]">{selectedStudent.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div>
                            <span className="text-[7px] text-white/60 block leading-none">NISN</span>
                            <span>{selectedStudent.nisn || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[7px] text-white/60 block leading-none">KELAS</span>
                            <Badge className="bg-secondary text-slate-900 text-[8px] px-1.5 py-0 rounded font-black h-4 mt-0.5">{selectedClassId}</Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-[7px] text-white/60 block leading-none">NIK</span>
                          <span>{selectedStudent.nik || '-'}</span>
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
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0A7E8D&data=${encodeURIComponent(selectedStudent.id)}`} 
                          alt="QR Code" 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    </div>
                    <div className="border-t border-teal-500/10 pt-2 text-[6px] text-slate-400 font-bold text-center leading-tight">
                      <p>SD NEGERI BOBONG - Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Prov. Maluku Utara, 97791</p>
                      <p className="text-[5px] text-slate-350">ID: {selectedStudent.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flat Print Layout for Single Card (Visible only during printing) */}
              <div className="hidden print-single-card print:flex print:flex-col print:gap-6 print:items-center">
                {/* Front Side Print */}
                <div className="w-[340px] h-[215px] rounded-[18px] overflow-hidden border border-white/80 bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 border-b border-white/20 pb-2">
                    <img src="/assets/logo-sdn-bobong.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <div className="leading-tight text-left">
                      <h4 className="text-[10px] font-black tracking-wider uppercase">Kartu Identitas Siswa</h4>
                      <h5 className="text-[11px] font-black text-secondary">SD Negeri Bobong</h5>
                      <p className="text-[6.5px] text-white/70 font-semibold">Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu</p>
                    </div>
                  </div>
                  <div className="flex-1 flex gap-3 pt-3 items-center">
                    <div className="w-16 h-20 rounded-lg bg-white/10 border border-white/25 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      <i className="ri-user-3-line text-3xl text-white/50" />
                    </div>
                    <div className="flex-1 text-left space-y-1 text-[9px] font-bold text-white/90">
                      <div>
                        <span className="text-[7px] text-white/60 block leading-none">NAMA LENGKAP</span>
                        <span className="font-extrabold uppercase text-white tracking-wide truncate block max-w-[180px]">{selectedStudent.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          <span className="text-[7px] text-white/60 block leading-none">NISN</span>
                          <span>{selectedStudent.nisn || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-white/60 block leading-none">KELAS</span>
                          <span className="bg-secondary/20 text-secondary border border-secondary/40 text-[8px] px-1.5 py-0.5 rounded font-black h-4 mt-0.5 inline-block">{selectedClassId}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[7px] text-white/60 block leading-none">NIK</span>
                        <span>{selectedStudent.nik || '-'}</span>
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
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0A7E8D&data=${encodeURIComponent(selectedStudent.id)}`} 
                        alt="QR Code" 
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>
                  <div className="border-t border-teal-500/10 pt-2 text-[6px] text-slate-400 font-bold text-center leading-tight">
                    <p>SD NEGERI BOBONG - Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Prov. Maluku Utara, 97791</p>
                    <p className="text-[5px] text-slate-350">ID: {selectedStudent.id}</p>
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
                <h3 className="text-xl font-black text-slate-800 leading-tight truncate">{selectedStudent.name}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">NISN</span>
                  <span className="text-slate-800">{selectedStudent.nisn || '-'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">NIK</span>
                  <span className="text-slate-800">{selectedStudent.nik || '-'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Tempat, Tgl Lahir</span>
                  <span className="text-slate-800">{selectedStudent.birthInfo || '-'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Agama</span>
                  <span className="text-slate-800">{selectedStudent.religion || '-'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Nama Orang Tua / Wali</span>
                  <span className="text-slate-800">{selectedStudent.parentName || '-'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Pekerjaan Orang Tua</span>
                  <span className="text-slate-800">{selectedStudent.parentJob || '-'}</span>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Alamat Tempat Tinggal</span>
                  <span className="block text-slate-650 font-medium leading-relaxed">{selectedStudent.address || '-'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
