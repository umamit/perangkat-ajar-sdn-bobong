import { openModal } from './openModal';
import { appData } from '../helpers';

export function showAddModulModal(): void {
  const classOptions = (appData.classes || [])
    .map((c: any) => `<option value="${c.name}">${c.name}</option>`)
    .join('');

  const form = `
    <form onsubmit="saveModul(event)">
      <div class="form-group">
        <label>Judul Modul / Topik</label>
        <input type="text" id="modulTitle" placeholder="Contoh: Unit 3 - My Family" required>
      </div>
      <div class="form-group">
        <label>Target Kelas</label>
        <select id="modulGrade" required>
          ${classOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Alokasi Waktu</label>
        <input type="text" id="modulDuration" value="2 x 35 Menit" required>
      </div>
      <div class="form-group">
        <label>Tujuan Pembelajaran (TP)</label>
        <textarea id="modulTarget" rows="2" placeholder="Tujuan pembelajaran yang ingin dicapai..." required></textarea>
      </div>
      <div class="form-group">
        <label>Capaian Pembelajaran (CP)</label>
        <textarea id="modulCP" rows="2" placeholder="Ringkasan CP / instruksi materi..." required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
        <i class="ri-save-line"></i> Simpan Modul Ajar
      </button>
    </form>
  `;
  openModal('Buat Modul Ajar / RPP Baru', form);
}
