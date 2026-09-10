import React from 'react';
import { TaskItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileBadge } from './FileBadge';

interface TaskTableDesktopProps {
  tasks: TaskItem[];
  onDelete: (item: TaskItem) => void;
  canDelete: (item: TaskItem) => boolean;
}

export function TaskTableDesktop({ tasks, onDelete, canDelete }: TaskTableDesktopProps) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/40 hover:bg-slate-50/40 border-slate-100">
            <TableHead className="w-12 font-black text-[10px] uppercase text-slate-400">No</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Judul Penugasan</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Kelas</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Jenis</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Tenggat Waktu</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Berkas Soal</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Status</TableHead>
            <TableHead className="w-16 text-right font-black text-[10px] uppercase text-slate-400">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-xs font-semibold text-slate-400">
                <i className="ri-inbox-2-line text-xl block mb-1 text-slate-300" />
                Belum ada penugasan terdaftar. Klik &apos;Buat Tugas Baru&apos; untuk menambahkan.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((item, idx) => (
              <TableRow key={item.id || idx} className="hover:bg-white/50 border-slate-100 transition-colors">
                <TableCell className="font-bold text-xs text-slate-400">{idx + 1}</TableCell>
                <TableCell>
                  <div className="font-bold text-slate-800 text-xs">{item.title}</div>
                  {item.description && (
                    <div className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="font-black text-[10px] rounded-md px-2 py-0.5">
                    {item.classId}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-bold text-[10px] rounded-md px-2 py-0.5 border-slate-200 text-slate-600">
                    {item.type || 'Formatif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                  {item.dueDate}
                </TableCell>
                <TableCell>
                  {item.fileUrl ? (
                    <FileBadge fileUrl={item.fileUrl} fileName={item.fileName} fileType={item.fileType} />
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Tanpa berkas</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === 'Aktif' ? 'success' : 'secondary'} className="font-black text-[10px] rounded-md px-2 py-0.5">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {canDelete(item) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(item)}
                      className="h-7 w-7 p-0 rounded-lg text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200"
                      title="Hapus Penugasan"
                    >
                      <i className="ri-delete-bin-line text-xs" />
                    </Button>
                  ) : (
                    <span className="text-slate-300 text-xs">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
