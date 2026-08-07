'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StudentDialogsProps {
  showAddModal: boolean;
  setShowAddModal: (val: boolean) => void;
  showEditModal: boolean;
  setShowEditModal: (val: boolean) => void;
  showImportModal: boolean;
  setShowImportModal: (val: boolean) => void;
  saving: boolean;
  classes: any[];
  selectedClass: string;
  addForm: any;
  setAddForm: React.Dispatch<React.SetStateAction<any>>;
  editForm: any;
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  handleAddSubmit: (e: React.FormEvent) => Promise<void>;
  handleEditSubmit: (e: React.FormEvent) => Promise<void>;
  handleDirectImport: (file: File) => Promise<void>;
}

export function StudentDialogs({
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  showImportModal,
  setShowImportModal,
  saving,
  classes,
  selectedClass,
  addForm,
  setAddForm,
  editForm,
  setEditForm,
  handleAddSubmit,
  handleEditSubmit,
  handleDirectImport
}: StudentDialogsProps) {
  return (
    <>
      {/* Modal Tambah Siswa */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
              <i className="ri-user-add-line text-primary" /> Tambah Data Siswa Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 mt-2">
            <div className="max-h-[58vh] overflow-y-auto pr-1.5 space-y-3.5 text-left text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="studentName" className="font-bold text-slate-600">Nama Lengkap Siswa</Label>
                <Input
                  id="studentName"
                  value={addForm.name}
                  onChange={e => setAddForm((f: any) => ({ ...f, name: e.target.value }))}
                  placeholder="Masukkan nama lengkap siswa"
                  required
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="studentNis" className="font-bold text-slate-600">NIS</Label>
                  <Input
                    id="studentNis"
                    value={addForm.nis}
                    onChange={e => setAddForm((f: any) => ({ ...f, nis: e.target.value }))}
                    placeholder="NIS"
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="studentNisn" className="font-bold text-slate-600">NISN</Label>
                  <Input
                    id="studentNisn"
                    value={addForm.nisn}
                    onChange={e => setAddForm((f: any) => ({ ...f, nisn: e.target.value }))}
                    placeholder="NISN"
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="studentClass" className="font-bold text-slate-600">Kelas</Label>
                  <select
                    id="studentClass"
                    value={addForm.classId}
                    onChange={e => setAddForm((f: any) => ({ ...f, classId: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="studentGender" className="font-bold text-slate-600">Jenis Kelamin</Label>
                  <select
                    id="studentGender"
                    value={addForm.gender}
                    onChange={e => setAddForm((f: any) => ({ ...f, gender: e.target.value as 'L' | 'P' }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-10"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="studentNik" className="font-bold text-slate-600">NIK (KTP/KK)</Label>
                  <Input
                    id="studentNik"
                    value={addForm.nik}
                    onChange={e => setAddForm((f: any) => ({ ...f, nik: e.target.value }))}
                    placeholder="Nomor NIK"
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="studentReligion" className="font-bold text-slate-600">Agama</Label>
                  <Input
                    id="studentReligion"
                    value={addForm.religion}
                    onChange={e => setAddForm((f: any) => ({ ...f, religion: e.target.value }))}
                    placeholder="Agama"
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="studentBirthInfo" className="font-bold text-slate-600">Tempat Tanggal Lahir</Label>
                <Input
                  id="studentBirthInfo"
                  value={addForm.birthInfo}
                  onChange={e => setAddForm((f: any) => ({ ...f, birthInfo: e.target.value }))}
                  placeholder="Contoh: Bobong, 12 April 2014"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="studentParentName" className="font-bold text-slate-600">Nama Orang Tua</Label>
                  <Input
                    id="studentParentName"
                    value={addForm.parentName}
                    onChange={e => setAddForm((f: any) => ({ ...f, parentName: e.target.value }))}
                    placeholder="Nama Ayah / Ibu"
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="studentParentJob" className="font-bold text-slate-600">Pekerjaan Orang Tua</Label>
                  <Input
                    id="studentParentJob"
                    value={addForm.parentJob}
                    onChange={e => setAddForm((f: any) => ({ ...f, parentJob: e.target.value }))}
                    placeholder="Pekerjaan"
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="studentAddress" className="font-bold text-slate-600">Alamat Tempat Tinggal</Label>
                  <Input
                    id="studentAddress"
                    value={addForm.address}
                    onChange={e => setAddForm((f: any) => ({ ...f, address: e.target.value }))}
                    placeholder="Alamat"
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="studentAdmissionYear" className="font-bold text-slate-600">Tahun Masuk Sekolah</Label>
                  <Input
                    id="studentAdmissionYear"
                    value={addForm.admissionYear}
                    onChange={e => setAddForm((f: any) => ({ ...f, admissionYear: e.target.value }))}
                    placeholder="Contoh: 2023"
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-xl h-10 text-xs font-bold">
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10">
                {saving ? 'Menyimpan...' : 'Simpan Data Siswa'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Siswa */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
              <i className="ri-edit-line text-primary" /> Edit Data Siswa
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
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
                  <Input
                    id="editStudentReligion"
                    value={editForm.religion}
                    onChange={e => setEditForm((f: any) => ({ ...f, religion: e.target.value }))}
                    placeholder="Agama"
                    className="h-10 rounded-xl"
                  />
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
                  <Input
                    id="editStudentParentJob"
                    value={editForm.parentJob}
                    onChange={e => setEditForm((f: any) => ({ ...f, parentJob: e.target.value }))}
                    placeholder="Pekerjaan"
                    className="h-10 rounded-xl"
                  />
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
                  <Label htmlFor="editStudentAdmissionYear" className="font-bold text-slate-600">Tahun Masuk Sekolah</Label>
                  <Input
                    id="editStudentAdmissionYear"
                    value={editForm.admissionYear}
                    onChange={e => setEditForm((f: any) => ({ ...f, admissionYear: e.target.value }))}
                    placeholder="Contoh: 2023"
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="rounded-xl h-10 text-xs font-bold">
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl h-10 text-xs font-black bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10">
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Impor Excel */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-md bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
              <i className="ri-upload-2-line text-primary" /> Impor Langsung Data Siswa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-cyan-50/70 border border-cyan-150 p-4 rounded-2xl text-[11px] space-y-1.5 text-slate-700 backdrop-blur-sm">
              <p className="font-black text-cyan-800 flex items-center gap-1.5">
                <i className="ri-information-line text-sm" /> IMPOR LANGSUNG MASSAL:
              </p>
              <p className="leading-relaxed font-semibold">
                Pilih file Excel (.xlsx, .xls) atau CSV (.csv). Seluruh data siswa akan otomatis langsung dimasukkan ke <strong>Kelas {selectedClass !== 'ALL' ? selectedClass : (classes[0]?.id || '1A')}</strong>.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-200 p-8 text-center rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl shadow-inner mb-3">
                <i className="ri-file-excel-2-line" />
              </div>
              <p className="text-xs font-black text-slate-700 mb-1">Pilih File Excel / CSV untuk Memulai</p>
              <p className="text-[10px] text-slate-400 font-bold mb-4">Mendukung format kolom Nama, NISN, Kelas, Jenis Kelamin</p>
              <input
                type="file"
                id="directImportFile"
                accept=".xlsx, .xls, .csv"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleDirectImport(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <Button type="button" onClick={() => document.getElementById('directImportFile')?.click()} className="rounded-xl h-10 text-xs font-black bg-primary hover:bg-primary-dark text-white px-5">
                Pilih & Impor File
              </Button>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowImportModal(false)} className="rounded-xl h-10 text-xs font-bold w-full sm:w-auto">
                Batal
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
