export function downloadStudentTemplate() {
  const templateData = [
    { "Nama Lengkap": "Ahmad Rizky Pratama", Kelas: "3B", "Jenis Kelamin": "L" },
    { "Nama Lengkap": "Siti Nurhaliza", Kelas: "3B", "Jenis Kelamin": "P" }
  ];
  if (typeof XLSX !== 'undefined') {
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");
    XLSX.writeFile(workbook, "Template_Impor_Siswa_SDN_Bobong.xlsx");
  }
}
