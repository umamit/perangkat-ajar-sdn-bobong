import * as XLSX from 'xlsx';
import { FormFieldModel, FormResponseModel } from '@/types/form';

export function exportFormResponsesToExcel(
  formTitle: string,
  fields: FormFieldModel[],
  responses: FormResponseModel[]
) {
  // Susun header kolom
  const headers = ['No', 'Tanggal Submisi', 'Nama Responden', 'Skor', 'Skor Maksimal'];
  fields.forEach((f) => headers.push(f.label));

  // Susun baris data
  const rows = responses.map((resp, idx) => {
    const formattedDate = new Date(resp.created_at).toLocaleString('id-ID');
    const rowData: any[] = [
      idx + 1,
      formattedDate,
      resp.respondent_name || 'Anonim',
      resp.score ?? '-',
      resp.max_score ?? '-',
    ];

    fields.forEach((f) => {
      const val = resp.answers[f.id];
      if (val === undefined || val === null) {
        rowData.push('');
      } else if (Array.isArray(val)) {
        rowData.push(val.join(', '));
      } else {
        rowData.push(String(val));
      }
    });

    return rowData;
  });

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tanggapan');

  const cleanFilename = formTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  XLSX.writeFile(workbook, `respon_${cleanFilename}.xlsx`);
}
