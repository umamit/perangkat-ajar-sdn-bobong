import { openModal } from './openModal.js';
export function showAddTeacherModal() {
    const form = `
    <form onsubmit="saveTeacher(event)">
      <div class="form-group">
        <label>Nama Lengkap</label>
        <input type="text" id="teacherName" required>
      </div>
      <div class="form-group">
        <label>NIP</label>
        <input type="text" id="teacherNip" required>
      </div>
      <div class="form-group">
        <label>Jabatan</label>
        <select id="teacherRole">
          <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
          <option value="Guru Kelas">Guru Kelas</option>
          <option value="Kepala Sekolah">Kepala Sekolah</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Simpan</button>
    </form>
  `;
    openModal('Tambah Data Guru', form);
}
