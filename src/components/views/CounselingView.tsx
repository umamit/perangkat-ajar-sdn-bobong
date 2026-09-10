'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { deleteCounselingLogFromSupabase } from '@/lib/supabase';
import { CounselingTimeline } from './counseling/CounselingTimeline';
import { CounselingForm } from './counseling/CounselingForm';
import { CounselingLog } from '@/types';

export function CounselingView() {
  const { counselingLogs, setCounselingLogs, students, classes, currentTeacher, showToast } = useApp();
  
  // Filter states
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile navigation tab for Kepsek ('timeline' | 'form')
  const [activeTab, setActiveTab] = useState<'timeline' | 'form'>('timeline');

  const isKepsek = currentTeacher?.nip === '199610272019032006';

  const handleDelete = async (id: string) => {
    if (confirm('Hapus catatan pembinaan ini?')) {
      setCounselingLogs(prev => prev.filter(l => l.id !== id));
      await deleteCounselingLogFromSupabase(id);
      showToast('Catatan BK berhasil dihapus permanen', 'info');
    }
  };

  const handleSuccessAdd = (newLog: CounselingLog) => {
    setCounselingLogs(prev => [newLog, ...prev]);
    setActiveTab('timeline');
  };

  const filteredLogs = counselingLogs.filter(log => {
    const student = students.find(s => s.id === log.studentId);
    if (!student) return false;

    const matchesClass = filterClass === 'ALL' || student.classId === filterClass;
    const matchesCategory = filterCategory === 'ALL' || log.category === filterCategory;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (student.nis || '').includes(searchQuery);

    return matchesClass && matchesCategory && matchesSearch;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Pusat Layanan Bimbingan Konseling (BK)
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold">
            Timeline pembinaan karakter siswa dan riwayat bimbingan terintegrasi
          </p>
        </div>

        {/* Mobile Tab Toggle for Kepsek */}
        {isKepsek && (
          <div className="flex sm:hidden p-1 bg-slate-100 rounded-xl border border-slate-200/60 w-full">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-2 rounded-lg font-extrabold text-xs transition-all ${
                activeTab === 'timeline'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <i className="ri-history-line mr-1" /> Riwayat ({filteredLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-2 rounded-lg font-extrabold text-xs transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <i className="ri-add-circle-line mr-1" /> Catat Baru
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline View */}
        <div
          className={`space-y-4 ${
            isKepsek ? 'lg:col-span-8' : 'lg:col-span-12'
          } ${isKepsek && activeTab !== 'timeline' ? 'hidden sm:block' : 'block'}`}
        >
          <CounselingTimeline
            logs={filteredLogs}
            students={students}
            classes={classes}
            filterClass={filterClass}
            setFilterClass={setFilterClass}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isKepsek={isKepsek}
            onDelete={handleDelete}
          />
        </div>

        {/* Form View for Kepsek */}
        {isKepsek && (
          <div
            className={`lg:col-span-4 ${
              activeTab !== 'form' ? 'hidden sm:block' : 'block'
            }`}
          >
            <div className="sm:sticky sm:top-24">
              <CounselingForm
                students={students}
                currentTeacher={currentTeacher}
                onSuccess={handleSuccessAdd}
                showToast={showToast}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
