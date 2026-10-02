'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SupervisionItem } from '@/types/supervision';
import { downloadSupervisiPDF } from '@/modules/generateSupervisiPDF';

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
  }, []);

  const saveToStorage = (updated: SupervisionItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = (item: SupervisionItem) => {
    const exists = items.some(i => i.id === item.id);
    let updated: SupervisionItem[];
    if (exists) {
      updated = items.map(i => (i.id === item.id ? item : i));
      showToast(`Supervisi ${item.teacherName} berhasil diperbarui!`, 'success');
    } else {
      updated = [item, ...items];
      showToast(`Supervisi ${item.teacherName} berhasil disimpan!`, 'success');
    }
    saveToStorage(updated);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus catatan supervisi ${name}?`)) return;
    const updated = items.filter(i => i.id !== id);
    saveToStorage(updated);
    showToast(`Catatan supervisi ${name} telah dihapus`, 'info');
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
    items: filteredItems,
    teachers,
    classes,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
    search,
    setSearch,
    filterClass,
    setFilterClass,
    handleSave,
    handleDelete,
    handlePrint,
  };
}
