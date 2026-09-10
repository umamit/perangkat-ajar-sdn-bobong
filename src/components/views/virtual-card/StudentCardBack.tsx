import React from "react";

export function StudentCardBack({ s }: any) {
  return (
    <div className="card-back rounded-[18px] overflow-hidden border border-teal-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 text-slate-800 shadow-md p-4 flex flex-col justify-between relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-amber-400" />
      <div className="border-b border-teal-500/10 pb-1.5 text-center mt-1">
        <h4 className="text-[9px] font-black text-primary-dark tracking-wide uppercase">TATA TERTIB & KETENTUAN KARTU</h4>
      </div>

      <div className="flex-1 flex gap-3 pt-3 items-center">
        <ol className="flex-1 text-left list-decimal list-inside text-[7px] text-slate-600 font-bold space-y-1">
          <li>Kartu ini adalah identitas resmi siswa SD Negeri Bobong.</li>
          <li>Wajib dibawa setiap hari dan saat kegiatan belajar.</li>
          <li>Gunakan QR Code di samping untuk presensi kehadiran harian.</li>
          <li>Kartu tidak boleh dipindahtangankan/disalahgunakan.</li>
        </ol>

        <div className="w-18 h-18 bg-teal-50/40 border border-teal-100 rounded-lg p-1 flex items-center justify-center shrink-0">
          <img src={"https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0A7E8D&data=" + encodeURIComponent(s.id)} alt="QR Code" className="w-16 h-16 object-contain" loading="lazy" />
        </div>
      </div>

      <div className="border-t border-teal-500/10 pt-2 text-[6px] text-slate-400 font-bold text-center leading-tight">
        <p>SD NEGERI BOBONG - Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791</p>
        <p className="text-[5px] text-slate-400">ID: {s.id}</p>
      </div>
    </div>
  );
}
