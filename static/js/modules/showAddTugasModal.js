import { openModal } from './openModal.js';
import { appData } from '../helpers.js';
export function showAddTugasModal() {
    const classOptions = (appData.classes || [])
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join('');
    const form = `
    <form onsubmit="saveTugas(event)">
      <div class="form-group">
        <label>Judul Penugasan</label>
        <input type="text" id="tugasTitle" placeholder="Contoh: Kuis Kosakata Family Members" required>
      </div>
      <div class="form-group">
        <label>Target Kelas</label>
        <select id="tugasClass" required>
          ${classOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Jenis Penugasan</label>
        <select id="tugasType" required>
          <option value="Formatif">Formatif (LM)</option>
          <option value="Sumatif">Sumatif (STS/SAS)</option>
          <option value="Proyek">Proyek P5</option>
        </select>
      </div>
      <div class="form-group">
        <label>Tenggat Waktu (Deadline)</label>
        <input type="date" id="tugasDueDate" required value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label>Deskripsi / Instruksi Tugas</label>
        <textarea id="tugasDescription" rows="3" placeholder="Tuliskan petunjuk pengerjaan tugas untuk siswa..." required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
        <i class="ri-save-line"></i> Simpan Penugasan Baru
      </button>
    </form>
  `;
    openModal('Tambah Penugasan Baru', form);
}
