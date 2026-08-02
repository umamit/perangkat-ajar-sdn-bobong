import { openModal, closeModal } from './openModal';
import { appData } from '../helpers';

// Helper: render daftar kelas sebagai option
function classOptions(selectedId?: string): string {
  return (appData.classes || [])
    .map((c: any) => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name}</option>`)
    .join('');
}

export function showAddModulModal(): void {
  const subject = appData.teacher?.subject || 'Bahasa Inggris';
  const form = `
    <form onsubmit="saveModul(event)" style="display:flex; flex-direction:column; gap:14px;">
      <div class="form-group">
        <label>Judul Modul Ajar</label>
        <input type="text" id="modulTitle" placeholder="Contoh: Unit 1 - Greetings" required>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="form-group">
          <label>Kelas</label>
          <select id="modulClass" required>
            <option value="">-- Pilih Kelas --</option>
            ${classOptions()}
          </select>
        </div>
        <div class="form-group">
          <label>Alokasi Waktu</label>
          <input type="text" id="modulDuration" value="2 x 35 Menit" required>
        </div>
      </div>
      <div class="form-group">
        <label>Tujuan Pembelajaran (TP)</label>
        <textarea id="modulTP" rows="2" placeholder="Peserta didik dapat..." style="width:100%; padding:9px 12px; border-radius:var(--radius-sm); border:1px solid #cbd5e1; font-size:13px; resize:vertical;"></textarea>
      </div>
      <div class="form-group">
        <label>Capaian Pembelajaran (CP)</label>
        <textarea id="modulCP" rows="2" placeholder="Memahami teks sederhana..." style="width:100%; padding:9px 12px; border-radius:var(--radius-sm); border:1px solid #cbd5e1; font-size:13px; resize:vertical;"></textarea>
      </div>
      <div class="form-group">
        <label>Langkah Pembelajaran (pisahkan dengan titik koma ;)</label>
        <textarea id="modulSteps" rows="3" placeholder="Apersepsi: salam pembuka; Inti: diskusi kosakata; Penutup: evaluasi" style="width:100%; padding:9px 12px; border-radius:var(--radius-sm); border:1px solid #cbd5e1; font-size:13px; resize:vertical;"></textarea>
      </div>
      <div class="form-group">
        <label>Mata Pelajaran</label>
        <input type="text" id="modulSubject" value="${subject}" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">
        <i class="ri-add-circle-line"></i> Simpan Modul Ajar
      </button>
    </form>
  `;
  openModal('Buat Modul Ajar Baru', form);
}

export function saveModul(e: Event): void {
  e.preventDefault();
  const title    = (document.getElementById('modulTitle') as HTMLInputElement).value.trim();
  const classId  = (document.getElementById('modulClass') as HTMLSelectElement).value;
  const duration = (document.getElementById('modulDuration') as HTMLInputElement).value.trim();
  const tp       = (document.getElementById('modulTP') as HTMLTextAreaElement).value.trim();
  const cp       = (document.getElementById('modulCP') as HTMLTextAreaElement).value.trim();
  const stepsRaw = (document.getElementById('modulSteps') as HTMLTextAreaElement).value.trim();
  const subject  = (document.getElementById('modulSubject') as HTMLInputElement).value.trim();

  if (!title || !classId) { alert('Judul dan Kelas wajib diisi!'); return; }

  const kelas = (appData.classes || []).find((c: any) => c.id === classId);
  const newMod = {
    id: `modul-${Date.now()}`,
    title,
    grade: kelas ? kelas.name : classId,
    phase: kelas ? (kelas.phase || '') : '',
    tp,
    atp: tp,
    cp,
    target: tp,
    duration,
    subject,
    steps: stepsRaw ? stepsRaw.split(';').map((s: string) => s.trim()).filter(Boolean) : ['Apersepsi', 'Inti', 'Penutup'],
    materials: [],
    assessment: 'Tes Tertulis',
    fileUrl: ''
  };

  if (!appData.modules) appData.modules = [];
  appData.modules.unshift(newMod as any);

  closeModal();
  if (typeof (window as any).renderModulAjar === 'function') (window as any).renderModulAjar();
  alert(`✅ Modul Ajar "${title}" berhasil dibuat!`);
}
