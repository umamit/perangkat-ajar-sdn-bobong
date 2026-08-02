import { openModal, closeModal } from './openModal';

export function showAddTeacherModal(): void {
  const form = `
    <form onsubmit="saveTeacher(event)">
      <div class="form-group">
        <label>NIP Guru</label>
        <input type="text" id="teacherNip" placeholder="Contoh: 199105122018021001" required>
      </div>
      <div class="form-group">
        <label>Nama Lengkap Guru (dengan Gelar)</label>
        <input type="text" id="teacherName" placeholder="Contoh: Nurhalisa, S.Pd." required>
      </div>
      <div class="form-group">
        <label>Mata Pelajaran / Jabatan</label>
        <input type="text" id="teacherSubject" placeholder="Contoh: Guru Kelas 1A / Bahasa Inggris" required>
      </div>
      <div class="form-group">
        <label>Peran / Role</label>
        <select id="teacherRole">
          <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
          <option value="Guru Kelas">Guru Kelas</option>
          <option value="Kepala Sekolah / Admin">Kepala Sekolah / Admin</option>
        </select>
      </div>
      <div class="form-group">
        <label>Password Awal</label>
        <input type="text" id="teacherPassword" value="sdnbobong" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Tambah Akun Guru</button>
    </form>
  `;
  openModal('Tambah Akun Guru Baru', form);
}
