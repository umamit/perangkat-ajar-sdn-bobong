"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StudentFormFields } from "./StudentFormFields";

export function AddStudentModal({ isOpen, onOpenChange, saving, classes, addForm, setAddForm, onSubmit }: any) {
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    if (!isOpen) { setBirthPlace(""); setBirthDate(""); }
  }, [isOpen]);

  const handlePlaceChange = (place: string) => {
    setBirthPlace(place);
    setAddForm((f: any) => ({ ...f, birthInfo: place && birthDate ? (place + ", " + birthDate) : (place || birthDate || "") }));
  };

  const handleDateChange = (date: string) => {
    setBirthDate(date);
    setAddForm((f: any) => ({ ...f, birthInfo: birthPlace && date ? (birthPlace + ", " + date) : (birthPlace || date || "") }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-user-add-line text-primary" /> Tambah Data Siswa Baru
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <StudentFormFields
            form={addForm}
            setForm={setAddForm}
            classes={classes}
            birthPlace={birthPlace}
            birthDate={birthDate}
            handlePlaceChange={handlePlaceChange}
            handleDateChange={handleDateChange}
            idPrefix="student"
          />
          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10 text-xs font-bold">
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-gradient-to-b from-primary via-primary to-primary-dark text-white shadow-md shadow-primary/20 border border-white/30 hover:brightness-105">
              {saving ? "Menyimpan..." : "Simpan Data Siswa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
