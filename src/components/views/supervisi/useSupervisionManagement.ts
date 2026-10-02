'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SupervisionItem } from '@/types/supervision';
import { downloadSupervisiPDF } from '@/modules/generateSupervisiPDF';
import { saveSupervisionToSupabase, deleteSupervisionFromSupabase } from '@/lib/supabaseSupervision';

const STORAGE_KEY = 'sdn_bobong_supervision_list';

export function useSupervisionManagement() {
  const { teachers, classes, schoolSettings, showToast, currentTeacher } = useApp();
  const [items, setItems] = useState<SupervisionItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupervisionItem | null>(null);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }

    // Ambil data terbaru dari cloud
    fetch('/api/sync', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.supervisions && Array.isArray(data.supervisions) && data.supervisions.length > 0) {
          const cloudItems: SupervisionItem[] = data.supervisions.map((s: any) => ({
            id: s.id,
            teacherNip: s.teacher_nip || '-',
            teacherName: s.teacher_name,
            classId: s.class_id,
            subject: s.subject,
            date: s.date,
            timeSlot: s.time_slot,
            topic: s.topic,
            scores: typeof s.scores === 'string' ? JSON.parse(s.scores) : s.scores,
            totalScore: s.total_score,
            percentage: s.percentage,
            predicate: s.predicate,
            notesGood: s.notes_good || '',
            notesImprove: s.notes_improve || '',
            recommendations: s.recommendations || '',
            createdAt: s.created_at,
          }));
          setItems(cloudItems);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudItems));
        }
      })
      .catch(err => console.warn('[Supervisions Sync Error]', err));
  }, []);

  const handleSave = async (item: SupervisionItem) => {
    const exists = items.some(i => i.id === item.id);
    const updated = exists ? items.map(i => (i.id === item.id ? item : i)) : [item, ...items];
    setItems(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    showToast(`Menyimpan supervisi ${item.teacherName}...`, 'info');
    setIsModalOpen(false);
    setEditingItem(null);

    try {
      await saveSupervisionToSupabase(item);
      showToast(`Supervisi ${item.teacherName} berhasil tersimpan ke cloud!`, 'success');
    } catch {
      showToast(`Supervisi tersimpan lokal (offline)`, 'info');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus catatan supervisi ${name}?`)) return;
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(`Catatan supervisi ${name} telah dihapus`, 'info');
    try {
      await deleteSupervisionFromSupabase(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = async (item: SupervisionItem) => {
    try {
      showToast('Membuat berkas PDF supervisi...', 'info');
      const headName = schoolSettings?.headmaster_name || currentTeacher?.name || 'Husnita Usman, M.Pd';
      const headNip = schoolSettings?.headmaster_nip || currentTeacher?.nip || '199610272019032006';
      await downloadSupervisiPDF(item, headName, headNip, schoolSettings);
      showToast('Berkas PDF berhasil diunduh!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal mencetak berkas PDF', 'error');
    }
  };

  const filteredItems = items.filter(i => {
    const matchSearch = i.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      i.subject.toLowerCase().includes(search.toLowerCase()) ||
      i.topic.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'ALL' || i.classId === filterClass;
    return matchSearch && matchClass;
  });

  return {
    items: filteredItems, teachers, classes, isModalOpen, setIsModalOpen,
    editingItem, setEditingItem, search, setSearch, filterClass, setFilterClass,
    handleSave, handleDelete, handlePrint,
  };
}
