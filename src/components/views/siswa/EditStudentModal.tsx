'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditStudentModalProps {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  saving: boolean;
  classes: any[];
  editForm: any;
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function EditStudentModal({
  isOpen,
  onOpenChange,
  saving,
  classes,
  editForm,
  setEditForm,
  onSubmit
}: EditStudentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-edit-line text-primary" /> Edit Data Siswa
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="max-h-[58vh] overflow-y-auto pr-1.5 space-y-3.5 text-left text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="editStudentName" className="font-bold text-slate-600">Nama Lengkap Siswa</Label>
              <Input
                id="editStudentName"
                value={editForm.name}
                onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))}
                placeholder="Masukkan nama lengkap siswa"
                required
                className="h-10 rounded-xl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="editStudentNis" className="font-bold text-slate-600">NIS</Label>
                <Input
                  id="editStudentNis"
                  value={editForm.nis}
                  onChange={e => setEditForm((f: any) => ({ ...f, nis: e.target.value }))}
                  placeholder="NIS"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editStudentNisn" className="font-bold text-slate-600">NISN</Label>
                <Input
                  id="editStudentNisn"
                  value={editForm.nisn}
                  onChange={e => setEditForm((f: any) => ({ ...f, nisn: e.target.value }))}
                  placeholder="NISN"
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="editStudentClass" className="font-bold text-slate-600">Kelas</Label>
                <select
                  id="editStudentClass"
                  value={editForm.classId}
                  onChange={e => setEditForm((f: any) => ({ ...f, classId: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editStudentGender" className="font-bold text-slate-600">Jenis Kelamin</Label>
                <select
                  id="editStudentGender"
                  value={editForm.gender}
                  onChange={e => setEditForm((f: any) => ({ ...f, gender: e.target.value as 'L' | 'P' }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="editStudentNik" className="font-bold text-slate-600">NIK (KTP/KK)</Label>
                <Input
                  id="editStudentNik"
                  value={editForm.nik}
                  onChange={e => setEditForm((f: any) => ({ ...f, nik: e.target.value }))}
                  placeholder="Nomor NIK"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editStudentReligion" className="font-bold text-slate-600">Agama</Label>
                <select
                  id="editStudentReligion"
                  value={editForm.religion}
                  onChange={e => setEditForm((f: any) => ({ ...f, religion: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10"
                >
                  <option value="">Pilih Agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen (Protestan)</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                  <option value="Lainnya">Lainnya / Kepercayaan</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editStudentBirthInfo" className="font-bold text-slate-600">Tempat Tanggal Lahir</Label>
              <Input
                id="editStudentBirthInfo"
                value={editForm.birthInfo}
                onChange={e => setEditForm((f: any) => ({ ...f, birthInfo: e.target.value }))}
                placeholder="Contoh: Bobong, 12 April 2014"
                className="h-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="editStudentParentName" className="font-bold text-slate-600">Nama Orang Tua</Label>
                <Input
                  id="editStudentParentName"
                  value={editForm.parentName}
                  onChange={e => setEditForm((f: any) => ({ ...f, parentName: e.target.value }))}
                  placeholder="Nama Ayah / Ibu"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editStudentParentJob" className="font-bold text-slate-600">Pekerjaan Orang Tua</Label>
                <select
                  id="editStudentParentJob"
                  value={editForm.parentJob}
                  onChange={e => setEditForm((f: any) => ({ ...f, parentJob: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10"
                >
                  <option value="">Pilih Pekerjaan</option>
                  <option value="PNS / ASN">PNS / ASN</option>
                  <option value="TNI / POLRI">TNI / POLRI</option>
                  <option value="Karyawan Swasta">Karyawan Swasta</option>
                  <option value="Wiraswasta / Pedagang">Wiraswasta / Pedagang</option>
                  <option value="Petani / Pekebun">Petani / Pekebun</option>
                  <option value="Nelayan">Nelayan</option>
                  <option value="Buruh">Buruh</option>
                  <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                  <option value="Tidak Bekerja">Tidak Bekerja</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="editStudentAddress" className="font-bold text-slate-600">Alamat Tempat Tinggal</Label>
                <Input
                  id="editStudentAddress"
                  value={editForm.address}
                  onChange={e => setEditForm((f: any) => ({ ...f, address: e.target.value }))}
                  placeholder="Alamat"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editStudentAdmissionYear" className="font-bold text-slate-600">Tanggal Masuk Sekolah</Label>
                <Input
                  id="editStudentAdmissionYear"
                  type="date"
                  value={editForm.admissionYear}
                  onChange={e => setEditForm((f: any) => ({ ...f, admissionYear: e.target.value }))}
                  className="h-10 rounded-xl text-slate-700"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10 text-xs font-bold">
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
