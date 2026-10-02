'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SupervisionItem, initialSupervisionScores } from '@/types/supervision';
import { computeSupervisionScore } from './supervisionCalculations';
import { SupervisionAspectsSection } from './SupervisionAspectsSection';
import { SupervisionFormInputs } from './SupervisionFormInputs';

interface Props {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  initialData?: SupervisionItem | null;
  teachers: any[];
  classes: any[];
  onSave: (item: SupervisionItem) => void;
}

export function SupervisionModalForm({ isOpen, onOpenChange, initialData, teachers, classes, onSave }: Props) {
  const [teacherNip, setTeacherNip] = useState('');
  const [customTeacherName, setCustomTeacherName] = useState('');
  const [isCustomTeacher, setIsCustomTeacher] = useState(false);
  const [classId, setClassId] = useState('1A');
  const [subject, setSubject] = useState('Matematika');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [scores, setScores] = useState(initialSupervisionScores);
  const [notesGood, setNotesGood] = useState('');
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    if (initialData) {
      const match = teachers.some((t) => t.nip === initialData.teacherNip);
      setIsCustomTeacher(!match);
      setTeacherNip(initialData.teacherNip);
      setCustomTeacherName(initialData.teacherName);
      setClassId(initialData.classId);
      setSubject(initialData.subject);
      setDate(initialData.date);
      setTopic(initialData.topic);
      setScores(initialData.scores);
      setNotesGood(initialData.notesGood);
      setRecommendations(initialData.recommendations);
    } else {
      setIsCustomTeacher(false);
      setTeacherNip(teachers[0]?.nip || '');
      setCustomTeacherName('');
      setClassId(classes[0]?.id || '1A');
      setTopic('');
      setScores(initialSupervisionScores);
      setNotesGood('');
      setRecommendations('');
    }
  }, [initialData, isOpen, teachers, classes]);

  const { totalScore, percentage, predicate } = computeSupervisionScore(scores);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tObj = teachers.find((t) => t.nip === teacherNip);
    const finalName = isCustomTeacher
      ? customTeacherName.trim() || 'Guru SD Negeri Bobong'
      : tObj?.name || 'Guru SD Negeri Bobong';

    onSave({
      id: initialData?.id || crypto.randomUUID(),
      teacherNip: isCustomTeacher ? teacherNip.trim() || '-' : teacherNip,
      teacherName: finalName,
      classId,
      subject,
      date,
      topic: topic.trim() || 'Pembelajaran Tematik / Mata Pelajaran',
      scores,
      totalScore,
      percentage,
      predicate,
      notesGood: notesGood.trim(),
      notesImprove: '',
      recommendations: recommendations.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <i className="ri-shield-check-line text-primary" />
            {initialData ? 'Perbarui Catatan Supervisi' : 'Lembar Observasi Supervisi Akademik'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2 text-xs">
          <SupervisionFormInputs
            teacherNip={teacherNip} setTeacherNip={setTeacherNip}
            customTeacherName={customTeacherName} setCustomTeacherName={setCustomTeacherName}
            isCustomTeacher={isCustomTeacher} setIsCustomTeacher={setIsCustomTeacher}
            classId={classId} setClassId={setClassId}
            subject={subject} setSubject={setSubject}
            date={date} setDate={setDate}
            topic={topic} setTopic={setTopic}
            teachers={teachers} classes={classes}
          />

          <SupervisionAspectsSection
            scores={scores} setScores={setScores}
            totalScore={totalScore} percentage={percentage} predicate={predicate}
          />

          <div className="space-y-2">
            <div>
              <label className="font-bold text-slate-700 block mb-0.5">Kekuatan & Kelebihan Guru:</label>
              <textarea
                rows={2}
                placeholder="Guru sangat komunikatif, memanfaatkan media konkrit..."
                value={notesGood}
                onChange={(e) => setNotesGood(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 font-medium outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-0.5">Rekomendasi Tindak Lanjut Kepala Sekolah:</label>
              <textarea
                rows={2}
                placeholder="Perlu memperbanyak aktivitas mandiri kelompok..."
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 font-medium outline-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-9 text-xs">
              Batal
            </Button>
            <Button type="submit" className="rounded-xl h-9 text-xs font-bold bg-primary text-white hover:brightness-105">
              Simpan Observasi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
