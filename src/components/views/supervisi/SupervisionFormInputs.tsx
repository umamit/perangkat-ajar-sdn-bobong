'use client';

import React from 'react';

interface Props {
  teacherNip: string;
  setTeacherNip: (val: string) => void;
  customTeacherName: string;
  setCustomTeacherName: (val: string) => void;
  isCustomTeacher: boolean;
  setIsCustomTeacher: (val: boolean) => void;
  classId: string;
  setClassId: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  topic: string;
  setTopic: (val: string) => void;
  teachers: any[];
  classes: any[];
}

export function SupervisionFormInputs({
  teacherNip, setTeacherNip,
  customTeacherName, setCustomTeacherName,
  isCustomTeacher, setIsCustomTeacher,
  classId, setClassId,
  subject, setSubject,
  date, setDate,
  topic, setTopic,
  teachers, classes,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-slate-700">Guru yang Disupervisi:</label>
            <button
              type="button"
              onClick={() => setIsCustomTeacher(!isCustomTeacher)}
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              <i className={isCustomTeacher ? "ri-list-check" : "ri-edit-line"} />
              {isCustomTeacher ? 'Pilih dari Daftar' : 'Ketik Manual'}
            </button>
          </div>

          {isCustomTeacher ? (
            <div className="space-y-1.5">
              <input
                type="text"
                required
                placeholder="Nama Lengkap Guru / Mahasiswa PPL"
                value={customTeacherName}
                onChange={(e) => setCustomTeacherName(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 font-bold outline-none"
              />
              <input
                type="text"
                placeholder="NIP / NUPTK / No. Identitas (Opsional)"
                value={teacherNip}
                onChange={(e) => setTeacherNip(e.target.value)}
                className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-[11px] font-mono outline-none"
              />
            </div>
          ) : (
            <select
              value={teacherNip}
              onChange={(e) => {
                if (e.target.value === '__CUSTOM__') {
                  setIsCustomTeacher(true);
                  return;
                }
                setTeacherNip(e.target.value);
                const t = teachers.find((tc) => tc.nip === e.target.value);
                if (t?.subject) setSubject(t.subject);
              }}
              className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 font-bold outline-none"
            >
              {teachers.map((t) => (
                <option key={t.nip} value={t.nip}>{t.name} ({t.role || 'Guru'})</option>
              ))}
              <option value="__CUSTOM__">+ Ketik Nama Guru Lainnya...</option>
            </select>
          )}
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Kelas:</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 font-bold outline-none"
          >
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran:</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 font-semibold outline-none"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Tanggal Kunjungan:</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 font-bold outline-none"
          />
        </div>
      </div>

      <div>
        <label className="font-bold text-slate-700 block mb-1">Materi Pokok / Topik Pembelajaran:</label>
        <input
          type="text"
          placeholder="Contoh: Operasi Hitung Perkalian Bilangan Cacah"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 font-semibold outline-none"
        />
      </div>
    </div>
  );
}
