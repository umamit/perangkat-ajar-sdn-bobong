import { openModal } from './openModal.js';
import { appData } from '../helpers.js';
export function showAddScheduleModal() {
    const classOptions = (appData.classes || [])
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join('');
    const form = `
    <form onsubmit="saveSchedule(event)">
      <div class="form-group">
        <label>Hari Mengajar</label>
        <select id="scheduleDay" required>
          <option value="Senin">Senin</option>
          <option value="Selasa">Selasa</option>
          <option value="Rabu">Rabu</option>
          <option value="Kamis">Kamis</option>
          <option value="Jumat">Jumat</option>
          <option value="Sabtu">Sabtu</option>
        </select>
      </div>
      <div class="form-group">
        <label>Jam Pelajaran</label>
        <input type="text" id="scheduleTime" placeholder="Contoh: 07.30 - 08.40" value="07.30 - 08.40" required>
      </div>
      <div class="form-group">
        <label>Kelas</label>
        <select id="scheduleClass" required>
          ${classOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Materi / Topik Pelajaran</label>
        <input type="text" id="scheduleTopic" placeholder="Contoh: Unit 1: Greetings" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
        <i class="ri-save-line"></i> Simpan Jadwal Pelajaran
      </button>
    </form>
  `;
    openModal('Tambah Jadwal Pelajaran Baru', form);
}
