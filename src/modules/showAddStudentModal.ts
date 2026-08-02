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
        <input type="text" id="studentNis" placeholder="Masukkan NISN/NIS" required>
      </div>
      <div class="form-group">
        <label>Nama Lengkap Siswa</label>
        <input type="text" id="studentName" placeholder="Masukkan nama siswa" required>
      </div>
      <div class="form-group">
        <label>Kelas</label>
        <select id="studentClass" required>
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
        <i class="ri-user-add-line"></i> Simpan Data Siswa
      </button>
    </form>
  `;
  openModal('Tambah Data Siswa Baru', form);
}
