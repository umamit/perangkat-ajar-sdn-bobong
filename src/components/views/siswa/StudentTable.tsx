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
import { formatAdmissionYear } from '@/lib/utils';
import { StudentMobileCard } from './StudentMobileCard';

interface StudentTableProps {
  filteredStudents: Student[];
  isKepsek: boolean;
  handleEditClick: (student: Student) => void;
  handleDelete: (id: string, name: string) => void;
  handleCounselingClick: (student: Student) => void;
  isLoading?: boolean;
}

export function StudentTable({
  filteredStudents,
  isKepsek,
  handleEditClick,
  handleDelete,
  handleCounselingClick,
  isLoading
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
        cell: ({ getValue }: any) => <span className="font-black text-slate-700 text-xs">{formatAdmissionYear(getValue() as string)}</span>
      }
    ];

    cols.push({
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }: any) => {
        const s = row.original;
        return (
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handleCounselingClick(s)}
              className="p-1 rounded-lg text-primary hover:bg-cyan-50 hover:text-primary-dark transition-colors"
              title="Catatan BK / Wali"
            >
              <i className="ri-heart-pulse-line text-sm" />
            </button>
            {isKepsek && (
              <>
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
              </>
            )}
          </div>
        );
      }
    });

    return cols;
  }, [isKepsek, handleEditClick, handleDelete, handleCounselingClick]);

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
        {isLoading && filteredStudents.length === 0 ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 animate-pulse"
            >
              <div className="flex gap-2.5 items-center">
                <div className="w-6 h-6 rounded-full bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 rounded-lg w-2/3" />
                  <div className="h-3 bg-slate-200 rounded-lg w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : filteredStudents.map((s, idx) => (
          <StudentMobileCard
            key={s.id || idx}
            student={s}
            idx={idx}
            isExpanded={expandedId === s.id}
            toggleExpand={toggleExpand}
            isKepsek={isKepsek}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
            formatAdmissionYear={formatAdmissionYear}
            handleCounselingClick={handleCounselingClick}
          />
        ))}
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
            {isLoading && filteredStudents.length === 0 ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <TableRow key={rIdx} className="animate-pulse border-slate-100">
                  {columns.map((_, cIdx) => (
                    <TableCell key={cIdx}>
                      <div className="h-4 bg-slate-200 rounded w-4/5 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.map(row => (
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
