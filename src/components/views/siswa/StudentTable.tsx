'use client';

import React, { useState, useMemo } from 'react';
import {
  useLegacyTable as useTable,
  getCoreRowModel,
  getSortedRowModel
} from '@tanstack/react-table/legacy';
import { flexRender, SortingState } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';

interface StudentTableProps {
  filteredStudents: Student[];
  isKepsek: boolean;
  handleEditClick: (student: Student) => void;
  handleDelete: (id: string, name: string) => void;
}

export function StudentTable({
  filteredStudents,
  isKepsek,
  handleEditClick,
  handleDelete
}: StudentTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // 1. Definisikan Column TanStack Table untuk desktop view
  const columns = useMemo(() => {
    const cols = [
      {
        id: 'no',
        header: 'Nomor Urut',
        cell: ({ row }: any) => <span className="font-bold text-slate-400 text-xs">{row.index + 1}</span>
      },
      {
        accessorKey: 'nis',
        header: 'NIS',
        cell: ({ getValue }: any) => <span className="font-bold text-slate-800 text-xs">{(getValue() as string) || '-'}</span>
      },
      {
        accessorKey: 'nisn',
        header: 'NISN',
        cell: ({ getValue }: any) => <span className="font-semibold text-slate-650 text-xs">{(getValue() as string) || '-'}</span>
      },
      {
        accessorKey: 'nik',
        header: 'NIK',
        cell: ({ getValue }: any) => <span className="font-semibold text-slate-650 text-xs">{(getValue() as string) || '-'}</span>
      },
      {
        accessorKey: 'name',
        header: 'Nama Siswa',
        cell: ({ getValue }: any) => <span className="font-black text-slate-800 text-xs">{getValue() as string}</span>
      },
      {
        accessorKey: 'birthInfo',
        header: 'Tempat Tanggal Lahir',
        cell: ({ getValue }: any) => <span className="font-semibold text-slate-650 text-xs">{(getValue() as string) || '-'}</span>
      },
      {
        accessorKey: 'gender',
        header: 'Jenis Kelamin',
        cell: ({ getValue }: any) => {
          const val = getValue() as string;
          return val === 'L' ? (
            <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded text-xs font-bold">Laki-Laki</span>
          ) : (
            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs font-bold">Perempuan</span>
          );
        }
      },
      {
        accessorKey: 'parentName',
        header: 'Nama Orang Tua',
        cell: ({ getValue }: any) => <span className="font-semibold text-slate-650 text-xs">{(getValue() as string) || '-'}</span>
      },
      {
        accessorKey: 'religion',
        header: 'Agama',
        cell: ({ getValue }: any) => <span className="font-semibold text-slate-650 text-xs">{(getValue() as string) || '-'}</span>
      },
      {
        accessorKey: 'parentJob',
        header: 'Pekerjaan Orang Tua',
        cell: ({ getValue }: any) => <span className="font-semibold text-slate-650 text-xs">{(getValue() as string) || '-'}</span>
      },
      {
        accessorKey: 'address',
        header: 'Alamat',
        cell: ({ getValue }: any) => <span className="font-semibold text-slate-650 text-xs">{(getValue() as string) || '-'}</span>
      },
      {
        accessorKey: 'admissionYear',
        header: 'Tahun Masuk SD',
        cell: ({ getValue }: any) => <span className="font-black text-slate-700 text-xs">{(getValue() as string) || '-'}</span>
      }
    ];

    if (isKepsek) {
      cols.push({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }: any) => {
          const s = row.original;
          return (
            <div className="flex items-center justify-center gap-0.5">
              <button
                onClick={() => handleEditClick(s)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title="Edit Siswa"
              >
                <i className="ri-edit-line text-sm" />
              </button>
              <button
                onClick={() => handleDelete(s.id || s.nis || '', s.name)}
                className="p-1 rounded-lg text-rose-450 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title="Hapus Siswa"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>
          );
        }
      });
    }

    return cols;
  }, [isKepsek, handleEditClick, handleDelete]);

  // 2. Inisialisasi TanStack Table Hook menggunakan useTable
  const table = useTable({
    data: filteredStudents,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="w-full">
      {/* Mobile Card-based Layout */}
      <div className="block md:hidden space-y-3">
        {filteredStudents.map((s, idx) => {
          const isExpanded = expandedId === s.id;
          return (
            <div
              key={s.id || idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 transition-all"
            >
              <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpand(s.id)}>
                <div className="flex gap-2.5 items-center">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 w-5 h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{s.name}</h4>
                    <p className="text-[10px] text-slate-455 font-bold mt-0.5">NIS: {s.nis || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    s.gender === 'L' ? 'bg-cyan-50 text-cyan-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {s.gender === 'L' ? 'L' : 'P'}
                  </span>
                  <i className={`text-slate-400 text-lg transition-transform ${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                </div>
              </div>

              {isExpanded && (
                <div className="mt-2 pt-2.5 border-t border-slate-105 space-y-2.5 text-xs text-slate-650 animate-fade-in">
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">NIS</span>
                      <span className="font-bold text-slate-700">{s.nis || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">NISN</span>
                      <span className="font-bold text-slate-700">{s.nisn || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">NIK</span>
                      <span className="font-bold text-slate-700">{s.nik || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Nama Siswa</span>
                      <span className="font-bold text-slate-700">{s.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Tempat Tanggal Lahir</span>
                      <span className="font-bold text-slate-700">{s.birthInfo || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Jenis Kelamin</span>
                      <span className="font-bold text-slate-700">{s.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Nama Orang Tua</span>
                      <span className="font-bold text-slate-700">{s.parentName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Agama</span>
                      <span className="font-bold text-slate-700">{s.religion || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Pekerjaan Orang Tua</span>
                      <span className="font-bold text-slate-700">{s.parentJob || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Alamat</span>
                      <span className="font-bold text-slate-700">{s.address || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[9px] uppercase">Tahun Masuk SD</span>
                      <span className="font-bold text-slate-700">{s.admissionYear || '-'}</span>
                    </div>
                  </div>

                  {isKepsek && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(s)}
                        className="flex-1 h-9 text-xs rounded-xl font-bold border-slate-200 text-slate-650 hover:bg-slate-50 gap-1.5"
                      >
                        <i className="ri-edit-line text-sm" /> Edit Siswa
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(s.id || s.nis || '', s.name)}
                        className="flex-1 h-9 text-xs rounded-xl font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1.5"
                      >
                        <i className="ri-delete-bin-line text-sm" /> Hapus
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filteredStudents.length === 0 && (
          <div className="text-center text-slate-450 py-8 text-xs font-bold bg-white rounded-2xl border border-slate-100">
            Tidak ada data siswa ditemukan
          </div>
        )}
      </div>

      {/* Desktop Table Layout using TanStack Table API */}
      <div className="hidden md:block overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-slate-50/40 hover:bg-slate-50/40">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="font-black text-[10px] uppercase text-slate-455">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className="hover:bg-white/40 border-slate-100 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-slate-400 py-8 text-xs font-semibold">
                  Tidak ada data siswa ditemukan untuk filter ini
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
