import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function StudentPicker({ students, selectedStudentId, setSelectedStudentId, studentSearchText, setStudentSearchText, showStudentDropdown, setShowStudentDropdown }: any) {
  const filteredStudents = students.filter((s: any) =>
    s.name.toLowerCase().includes(studentSearchText.toLowerCase()) ||
    (s.nis || "").includes(studentSearchText) ||
    s.classId.toLowerCase().includes(studentSearchText.toLowerCase())
  );

  const handleSelect = (s: any) => {
    setSelectedStudentId(s.id);
    setStudentSearchText(s.name + " (" + s.classId + ")");
    setShowStudentDropdown(false);
  };

  return (
    <div className="space-y-1 text-left relative">
      <Label className="font-bold text-slate-600 text-xs">Pilih Siswa</Label>
      <div className="relative">
        <Input
          type="text"
          placeholder="Ketik nama / kelas..."
          value={studentSearchText}
          onChange={e => { setStudentSearchText(e.target.value); setShowStudentDropdown(true); }}
          onFocus={() => setShowStudentDropdown(true)}
          className="h-10 rounded-xl pr-8 text-xs font-semibold bg-white/70"
          required={!selectedStudentId}
        />
        {selectedStudentId && (
          <button type="button" onClick={() => { setSelectedStudentId(""); setStudentSearchText(""); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">
            <i className="ri-close-circle-line" />
          </button>
        )}
      </div>
      {showStudentDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl p-1">
          {filteredStudents.length === 0 ? (
            <p className="text-center py-3 text-slate-400 text-xs">Siswa tidak ditemukan</p>
          ) : (
            filteredStudents.map((s: any) => (
              <div key={s.id} onClick={() => handleSelect(s)} className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center transition-colors">
                <span className="font-bold text-slate-800 text-xs">{s.name}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">Kelas {s.classId}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
