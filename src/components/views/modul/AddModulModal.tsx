'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ModulFormFields } from './ModulFormFields';

interface AddModulModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: any[];
  form: {
    title: string;
    classId: string;
    duration: string;
    tp: string;
    cp: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    title: string;
    classId: string;
    duration: string;
    tp: string;
    cp: string;
  }>>;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  setSelectedFile: (file: File | null) => void;
}

export function AddModulModal({
  isOpen,
  onClose,
  classes,
  form,
  setForm,
  saving,
  onSave,
  setSelectedFile,
}: AddModulModalProps) {
  const handleResetAndClose = () => {
    onClose();
    setForm({
      title: '',
      classId: classes[0]?.id || '1A',
      duration: '2 x 35 Menit',
      tp: '',
      cp: '',
    });
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-add-box-line text-primary" /> Buat Modul Ajar / RPP Baru
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSave} className="space-y-4 mt-2">
          <ModulFormFields
            classes={classes}
            form={form}
            setForm={setForm}
            setSelectedFile={setSelectedFile}
          />
          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetAndClose}
              className="rounded-xl h-10 text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105"
            >
              {saving ? 'Menyimpan...' : 'Simpan Modul'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
