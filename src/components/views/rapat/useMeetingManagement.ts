import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { MeetingNote, MeetingAttendee } from '@/types/meeting';
import { getSupabase } from '@/lib/supabase';

const STORAGE_KEY = 'sdn_bobong_meeting_notes';

const initialMeetingForm: Omit<MeetingNote, 'id'> = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  timeStart: '08:30',
  timeEnd: '11:00',
  location: 'Ruang Guru SD Negeri Bobong',
  leaderName: 'Husnita Usman, M.Pd',
  leaderNip: '199610272019032006',
  notaryName: '',
  notaryNip: '',
  agendaTopics: '',
  discussionSummary: '',
  decisions: '',
  attendees: [],
  status: 'Rencana'
};

export function useMeetingManagement() {
  const { teachers, currentTeacher, showToast } = useApp();
  const [meetings, setMeetings] = useState<MeetingNote[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Rencana' | 'Selesai'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingNote | null>(null);
  const [form, setForm] = useState(initialMeetingForm);
  const [saving, setSaving] = useState(false);

  const isKepsek = !!(
    currentTeacher?.role?.toLowerCase().includes('kepala sekolah') ||
    currentTeacher?.role?.toLowerCase().includes('admin') ||
    currentTeacher?.nip === '199610272019032006'
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMeetings(JSON.parse(saved));
    } catch {}
  }, []);

  const saveToStorage = (data: MeetingNote[]) => {
    setMeetings(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  };

  const handleOpenAdd = () => {
    const defaultAttendees: MeetingAttendee[] = teachers.map(t => ({
      nip: t.nip,
      name: t.name,
      role: t.role,
      status: 'Hadir'
    }));

    setSelectedMeeting(null);
    setForm({
      ...initialMeetingForm,
      notaryName: currentTeacher?.name || '',
      notaryNip: currentTeacher?.nip || '',
      attendees: defaultAttendees
    });
    setShowModal(true);
  };

  const handleOpenEdit = (m: MeetingNote) => {
    setSelectedMeeting(m);
    setForm({
      title: m.title,
      date: m.date,
      timeStart: m.timeStart,
      timeEnd: m.timeEnd || '',
      location: m.location,
      leaderName: m.leaderName,
      leaderNip: m.leaderNip || '',
      notaryName: m.notaryName,
      notaryNip: m.notaryNip || '',
      agendaTopics: m.agendaTopics,
      discussionSummary: m.discussionSummary,
      decisions: m.decisions,
      attendees: m.attendees || [],
      status: m.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return showToast('Judul rapat wajib diisi', 'error');

    setSaving(true);
    try {
      if (selectedMeeting) {
        const updated = meetings.map(m => m.id === selectedMeeting.id ? { ...form, id: m.id } : m);
        saveToStorage(updated);
        showToast('Notula rapat berhasil diperbarui', 'success');
      } else {
        const newMeeting: MeetingNote = { ...form, id: crypto.randomUUID() };
        saveToStorage([newMeeting, ...meetings]);
        showToast('Agenda rapat baru berhasil ditambahkan', 'success');
      }
      setShowModal(false);
    } catch {
      showToast('Gagal menyimpan notula rapat', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus agenda rapat "${title}"?`)) return;
    saveToStorage(meetings.filter(m => m.id !== id));
    showToast(`Agenda rapat "${title}" telah dihapus`, 'info');
  };

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.location.toLowerCase().includes(search.toLowerCase()) ||
        m.agendaTopics.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [meetings, search, statusFilter]);

  return {
    meetings, filteredMeetings, search, setSearch, statusFilter, setStatusFilter,
    showModal, setShowModal, showDetailModal, setShowDetailModal,
    selectedMeeting, setSelectedMeeting, form, setForm, saving, isKepsek,
    handleOpenAdd, handleOpenEdit, handleSubmit, handleDelete
  };
}
