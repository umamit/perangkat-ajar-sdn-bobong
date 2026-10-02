'use client';

import React from 'react';

interface Props {
  teacherNip: string;
  setTeacherNip: (val: string) => void;
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
  teacherNip,
  setTeacherNip,
  classId,
  setClassId,
  subject,
  setSubject,
  date,
  setDate,
  topic,
  setTopic,
  teachers,
  classes,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Guru yang Disupervisi:</label>
          <select
            value={teacherNip}
            onChange={(e) => {
              setTeacherNip(e.target.value);
              const t = teachers.find((tc) => tc.nip === e.target.value);
              if (t?.subject) setSubject(t.subject);
            }}
            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 font-bold outline-none"
          >
            {teachers.map((t) => (
              <option key={t.nip} value={t.nip}>{t.name} ({t.role || 'Guru'})</option>
            ))}
          </select>
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
