import { openModal } from './openModal';
import { appData } from '../helpers';

export function showAddStudentModal(): void {
  const classOptions = (appData.classes || [])
    .map((c: any) => `<option value="${c.id}">${c.name}</option>`)
    .join('');

  const form = `
    <form onsubmit="saveStudent(event)">
      <div class="form-group">
        <label>NISN / NIS Siswa</label>
        <input type="text" id="studentNis" placeholder="Contoh: 3182096289" required>
      </div>
      <div class="form-group">
        <label>Nama Lengkap Siswa</label>
        <input type="text" id="studentName" placeholder="Contoh: Ahmad Fauzi" required>
      </div>
      <div class="form-group">
        <label>Kelas</label>
        <select id="studentClass" required>
          <option value="">-- Pilih Kelas --</option>
          ${classOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Jenis Kelamin</label>
        <select id="studentGender" required>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
        <i class="ri-user-add-line"></i> Tambah Siswa
      </button>
    </form>
  `;
  openModal('Tambah Siswa Baru', form);
}

export function showEditStudentModal(nis: string): void {
  const s = (appData.students || []).find((st: any) => st.nis === nis || st.id === nis);
  if (!s) { alert('Data siswa tidak ditemukan.'); return; }

  const classOptions = (appData.classes || [])
    .map((c: any) => `<option value="${c.id}" ${c.id === s.classId ? 'selected' : ''}>${c.name}</option>`)
    .join('');

  const form = `
    <form onsubmit="saveEditStudent(event, '${nis}')">
      <div class="form-group">
        <label>NISN / NIS Siswa</label>
        <input type="text" id="editStudentNis" value="${s.nis || s.id}" required>
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
