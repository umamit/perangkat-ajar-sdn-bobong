'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ri-grid-fill' },
  { id: 'siswa', label: 'Data Siswa', icon: 'ri-group-line' },
  { id: 'kelas', label: 'Data Kelas', icon: 'ri-community-line' },
  { id: 'absensi', label: 'Absensi', icon: 'ri-checkbox-line' },
  { id: 'nilai', label: 'Daftar Nilai', icon: 'ri-graduation-cap-line' },
  { id: 'jurnal', label: 'Jurnal Mengajar', icon: 'ri-book-read-line' },
  { id: 'modul', label: 'Modul Ajar', icon: 'ri-file-list-3-line' },
  { id: 'ai_assistant', label: 'AI Asisten Guru', icon: 'ri-magic-line' },
  { id: 'materi', label: 'Media Flashcard', icon: 'ri-folder-open-line' },
  { id: 'tugas', label: 'Tugas & Bank Soal', icon: 'ri-clipboard-line' },
  { id: 'laporan', label: 'Laporan', icon: 'ri-bar-chart-box-line' },
  { id: 'guru', label: 'Kelola Data Guru', icon: 'ri-user-star-line' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'ri-settings-4-line' },
];

export function Sidebar() {
  const { activeView, setActiveView, currentTeacher, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`} id="sidebar">
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="sidebar-header shrink-0">
            <img
              src="/assets/logo-sdn-bobong.png"
              alt="Logo SD Negeri Bobong"
              style={{ width: '42px', height: '42px', objectFit: 'contain' }}
            />
            <div className="school-info">
              <h3 id="schoolNameHeader">SD Negeri Bobong</h3>
              <p id="schoolKecamatanHeader">Kab. Pulau Taliabu</p>
            </div>
          </div>

          <nav className="sidebar-nav flex-1 overflow-y-auto pr-1">
            {navItems.map(item => (
              <a
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
              >
                <i className={item.icon}></i> {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="teacher-profile-card shrink-0 mt-3">
          <img
            id="teacherAvatarSidebar"
            src={currentTeacher.avatar || '/assets/logo-sdn-bobong.png'}
            alt="Guru"
            className="teacher-avatar shrink-0"
          />
          <div className="teacher-details min-w-0 flex-1 overflow-hidden">
            <h4 id="teacherNameSidebar" className="truncate leading-tight text-xs font-extrabold text-white" title={currentTeacher.name}>{currentTeacher.name || 'Guru'}</h4>
            <p id="teacherNipSidebar" className="truncate text-[10px] text-slate-300">NIP: {currentTeacher.nip || '199610272019032006'}</p>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-backdrop active"
          id="sidebarBackdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
