import React from 'react';
import { TaskItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileBadge } from './FileBadge';

interface TaskCardsMobileProps {
  tasks: TaskItem[];
  onDelete: (item: TaskItem) => void;
  canDelete: (item: TaskItem) => boolean;
}

export function TaskCardsMobile({ tasks, onDelete, canDelete }: TaskCardsMobileProps) {
  if (tasks.length === 0) {
    return (
      <div className="md:hidden text-center py-8 text-xs font-semibold text-slate-400 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 p-6">
        <i className="ri-inbox-2-line text-2xl block mb-1 text-slate-300" />
        Belum ada penugasan terdaftar.
      </div>
    );
  }

  return (
    <div className="md:hidden flex flex-col gap-3">
      {tasks.map((item, idx) => (
        <Card key={item.id || idx} className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-xs p-4 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black text-slate-400 block uppercase">Tugas #{idx + 1}</span>
                {item.description?.includes('[PENGIRIM PUBLIK:') && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center gap-1">
                    <i className="ri-earth-line text-[10px]" /> Publik
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-sm text-slate-800 leading-snug mt-0.5">{item.title}</h4>
            </div>
            <Badge variant={item.status === 'Aktif' ? 'success' : 'secondary'} className="font-black text-[10px] rounded-md px-2 py-0.5 shrink-0">
              {item.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="default" className="font-black text-[10px] rounded-md px-2 py-0.5">
              Kelas {item.classId}
            </Badge>
            <Badge variant="outline" className="font-bold text-[10px] rounded-md px-2 py-0.5 border-slate-200 text-slate-600">
              {item.type || 'Formatif'}
            </Badge>
            <span className="text-[11px] font-medium text-slate-500 ml-auto flex items-center gap-1">
              <i className="ri-calendar-event-line text-slate-400" /> {item.dueDate}
            </span>
          </div>

          {item.description && (
            <p className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
            <div>
              {item.fileUrl ? (
                <FileBadge fileUrl={item.fileUrl} fileName={item.fileName} fileType={item.fileType} />
              ) : (
                <span className="text-[10px] font-semibold text-slate-400 italic">Tanpa berkas</span>
              )}
            </div>

            {canDelete(item) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item)}
                className="h-8 w-8 p-0 rounded-xl text-rose-600 border-rose-100 hover:bg-rose-50"
                title="Hapus Penugasan"
              >
                <i className="ri-delete-bin-line text-xs" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
