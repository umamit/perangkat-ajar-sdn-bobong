import { openModal } from './openModal';
import { appData } from '../helpers';

export function showEditStudentModal(nis: string): void {
  const s = (appData.students || []).find((st: any) => st.nis === nis || st.id === nis);
  if (!s) { alert('Data siswa tidak ditemukan.'); return; }

  const classOptions = (appData.classes || [])
    .map((c: any) => `<option value="${c.id}" ${c.id === s.classId ? 'selected' : ''}>${c.name}</option>`)
    .join('');

  const displayNisInput = (s.nis && !s.nis.startsWith('AUTO-') && !s.nis.startsWith('SISWA-')) ? s.nis : '';

  const form = `
    <form onsubmit="saveEditStudent(event, '${nis}')">
      <div class="form-group">
        <label>NISN / NIS Siswa (Opsional)</label>
        <input type="text" id="editStudentNis" value="${displayNisInput}" placeholder="Kosongkan jika belum ada NISN">
      </div>
      <div class="form-group">
        <label>Nama Lengkap Siswa</label>
        <input type="text" id="editStudentName" value="${s.name}" required>
      </div>
      <div class="form-group">
        <label>Kelas</label>
        <select id="editStudentClass" required>
          ${classOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Jenis Kelamin</label>
        <select id="editStudentGender" required>
          <option value="L" ${s.gender === 'L' ? 'selected' : ''}>Laki-laki</option>
          <option value="P" ${s.gender === 'P' ? 'selected' : ''}>Perempuan</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
        <i class="ri-save-line"></i> Simpan Perubahan
      </button>
    </form>
  `;
  openModal('Edit Data Siswa', form);
}
