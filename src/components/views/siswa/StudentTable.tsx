"use client";

import React, { useState, useMemo } from "react";
import { useLegacyTable as useTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table/legacy";
import { flexRender, SortingState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Student } from "@/types";
import { formatAdmissionYear } from "@/lib/utils";
import { StudentMobileCard } from "./StudentMobileCard";
import { getStudentTableColumns } from "./studentColumns";

interface StudentTableProps {
  filteredStudents: Student[];
  isKepsek: boolean;
  handleEditClick: (student: Student) => void;
  handleDelete: (id: string, name: string) => void;
  handleCounselingClick: (student: Student) => void;
  isLoading?: boolean;
}

export function StudentTable({ filteredStudents, isKepsek, handleEditClick, handleDelete, handleCounselingClick, isLoading }: StudentTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const toggleExpand = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  const columns = useMemo(() => getStudentTableColumns(isKepsek, handleEditClick, handleDelete, handleCounselingClick), [isKepsek, handleEditClick, handleDelete, handleCounselingClick]);

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
      <div className="block md:hidden space-y-3">
        {isLoading && filteredStudents.length === 0 ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 animate-pulse">
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
          <div className="text-center text-slate-500 py-8 text-xs font-bold bg-white rounded-2xl border border-slate-100">
            Tidak ada data siswa ditemukan
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-slate-50/40 hover:bg-slate-50/40">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="font-black text-[10px] uppercase text-slate-500">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cIdx}><div className="h-4 bg-slate-200 rounded w-4/5 mx-auto" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className="hover:bg-white/40 border-slate-100 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
