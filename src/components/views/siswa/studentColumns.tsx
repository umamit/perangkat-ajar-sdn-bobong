import React from "react";
import { formatAdmissionYear } from "@/lib/utils";

export function getStudentTableColumns(isKepsek: boolean, handleEditClick: any, handleDelete: any, handleCounselingClick: any) {
  const cols: any[] = [
    { id: "no", header: "Nomor Urut", cell: ({ row }: any) => <span className="font-bold text-slate-400 text-xs">{row.index + 1}</span> },
    { accessorKey: "nis", header: "NIS", cell: ({ getValue }: any) => <span className="font-bold text-slate-800 text-xs">{getValue() || "-"}</span> },
    { accessorKey: "nisn", header: "NISN", cell: ({ getValue }: any) => <span className="font-semibold text-slate-600 text-xs">{getValue() || "-"}</span> },
    { accessorKey: "nik", header: "NIK", cell: ({ getValue }: any) => <span className="font-semibold text-slate-600 text-xs">{getValue() || "-"}</span> },
    { accessorKey: "name", header: "Nama Siswa", cell: ({ getValue }: any) => <span className="font-black text-slate-800 text-xs">{getValue()}</span> },
    { accessorKey: "birthInfo", header: "Tempat Tanggal Lahir", cell: ({ getValue }: any) => <span className="font-semibold text-slate-600 text-xs">{getValue() || "-"}</span> },
    {
      accessorKey: "gender",
      header: "Jenis Kelamin",
      cell: ({ getValue }: any) => getValue() === "L"
        ? <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded text-xs font-bold">Laki-Laki</span>
        : <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs font-bold">Perempuan</span>
    },
    { accessorKey: "parentName", header: "Nama Orang Tua", cell: ({ getValue }: any) => <span className="font-semibold text-slate-600 text-xs">{getValue() || "-"}</span> },
    { accessorKey: "religion", header: "Agama", cell: ({ getValue }: any) => <span className="font-semibold text-slate-600 text-xs">{getValue() || "-"}</span> },
    { accessorKey: "parentJob", header: "Pekerjaan Orang Tua", cell: ({ getValue }: any) => <span className="font-semibold text-slate-600 text-xs">{getValue() || "-"}</span> },
    { accessorKey: "address", header: "Alamat", cell: ({ getValue }: any) => <span className="font-semibold text-slate-600 text-xs">{getValue() || "-"}</span> },
    { accessorKey: "admissionYear", header: "Tahun Masuk SD", cell: ({ getValue }: any) => <span className="font-black text-slate-700 text-xs">{formatAdmissionYear(getValue())}</span> }
  ];

  cols.push({
    id: "actions",
    header: "Aksi",
    cell: ({ row }: any) => {
      const s = row.original;
      return (
        <div className="flex items-center justify-center gap-1.5">
          {isKepsek && (
            <>
              <button onClick={() => handleCounselingClick(s)} className="p-1 rounded-lg text-primary hover:bg-cyan-50 hover:text-primary-dark transition-colors" title="Catatan BK / Wali">
                <i className="ri-heart-pulse-line text-sm" />
              </button>
              <button onClick={() => handleEditClick(s)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Edit Siswa">
                <i className="ri-edit-line text-sm" />
              </button>
              <button onClick={() => handleDelete(s.id || s.nis || "", s.name)} className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Hapus Siswa">
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </>
          )}
        </div>
      );
    }
  });

  return cols;
}
