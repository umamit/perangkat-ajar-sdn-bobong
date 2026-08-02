// Interactive Views & Printable Modules for Perangkat Ajar SD Negeri Bobong
import { appData } from './helpers';

// Ekspor Data Siswa ke CSV
export function exportSiswaToCSV(): void {
  let csv = 'No,NIS,Nama Siswa,Kelas,Jenis Kelamin,Nilai Formatif,Nilai Sumatif\n';
  appData.students.forEach((s, idx) => {
    csv += `${idx + 1},"${s.nis}","${s.name}","${s.classId}","${s.gender}",${s.scoreFormatif || 80},${s.scoreSumatif || 80}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Data_Siswa_SDN_Bobong_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Ekspor Rekap Nilai ke CSV
export function exportNilaiToCSV(): void {
  let csv = 'No,Nama Siswa,Kelas,Rata-rata Formatif,Nilai Sumatif,Nilai Akhir,Predikat\n';
  appData.students.forEach((s, idx) => {
    const formatif = s.scoreFormatif || 80;
    const sumatif = s.scoreSumatif || 80;
    const finalScore = Math.round((formatif * 0.4) + (sumatif * 0.6));
    const grade = finalScore >= 90 ? 'A (Sangat Baik)' : finalScore >= 80 ? 'B (Baik)' : 'C (Cukup)';
    csv += `${idx + 1},"${s.name}","${s.classId}",${formatif},${sumatif},${finalScore},"${grade}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Daftar_Nilai_SDN_Bobong_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Kuis Game Interaktif Bahasa Inggris
export let quizState = { currentIndex: 0, score: 0 };

export function startEnglishQuiz(): void {
  quizState.currentIndex = 0;
  quizState.score = 0;
  const quizBox = document.getElementById('quizContainer');
  if (quizBox) {
    quizBox.style.display = 'block';
    renderQuizQuestion();
  }
}

export function renderQuizQuestion(): void {
  const quizBox = document.getElementById('quizContainer');
  if (!quizBox) return;
  const q = appData.quizQuestions[quizState.currentIndex];

  if (!q) {
    quizBox.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <h2 style="color:var(--primary-dark); font-size:22px; margin-bottom:8px;">Selamat! Kuis Selesai!</h2>
        <p style="font-size:16px; margin-bottom:16px;">Skor Akhir: <strong>${quizState.score} / ${appData.quizQuestions.length * 25} Point</strong></p>
        <button class="btn btn-primary" onclick="startEnglishQuiz()">Mainkan Lagi</button>
      </div>
    `;
    return;
  }

  quizBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <strong style="font-size:13px; color:var(--primary-dark);">Soal Nomor ${quizState.currentIndex + 1} dari ${appData.quizQuestions.length}</strong>
      <span class="badge badge-success">Skor: ${quizState.score}</span>
    </div>
    <h3 style="font-size:16px; margin-bottom:16px; color:#1e293b;">${q.question}</h3>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
      ${q.options.map(opt => `
        <button class="btn btn-secondary" onclick="checkQuizAnswer('${opt}')" style="justify-content:flex-start; text-align:left; padding:12px;">
          ${opt}
        </button>
      `).join('')}
    </div>
  `;
}

export function checkQuizAnswer(selectedOption: string): void {
  const q = appData.quizQuestions[quizState.currentIndex];
  if (selectedOption === q.answer) {
    quizState.score += 25;
    alert('Benar Sekali! Great Job!');
  } else {
    alert(`Kurang Tepat. Jawaban yang benar: "${q.answer}"`);
  }
  quizState.currentIndex++;
  renderQuizQuestion();
}

// Modul Ajar View & Print
export function renderModulAjar(): void {
  const container = document.getElementById('modulAjarList');
  if (!container) return;
  container.innerHTML = appData.modules.map(m => `
    <div class="module-card">
      <div class="module-header">
        <div>
          <span class="badge badge-info" style="margin-bottom:6px;">${m.grade} - ${m.phase}</span>
          <h3>${m.title}</h3>
          <p style="font-size:13px; color:var(--text-muted);"><i class="ri-time-line"></i> Alokasi Waktu: ${m.duration}</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="printWorksheet('${m.id}')">
            <i class="ri-file-text-line"></i> Cetak LKPD Siswa
          </button>
          <button class="btn btn-primary" onclick="printModule('${m.id}')">
            <i class="ri-printer-line"></i> Cetak Modul Ajar
          </button>
        </div>
      </div>
      <hr style="margin: 12px 0; border:0; border-top:1px solid #e2e8f0;">
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; font-size:13.5px;">
        <div>
          <strong style="color:var(--primary-dark);">Target Capaian Pembelajaran (CP):</strong>
          <p style="margin-top:4px; color:#334155;">${m.cp}</p>
        </div>
        <div>
          <strong style="color:var(--primary-dark);">Tujuan Pembelajaran:</strong>
          <p style="margin-top:4px; color:#334155;">${m.target}</p>
        </div>
      </div>
      <div style="margin-top:14px; background:#f8fafc; padding:12px; border-radius:8px;">
        <strong style="font-size:13px;">Langkah-Langkah Aktivitas Pembelajaran:</strong>
        <ol style="margin-left:20px; margin-top:6px; font-size:13px; color:#475569;">
          ${m.steps.map(step => `<li style="margin-bottom:4px;">${step}</li>`).join('')}
        </ol>
      </div>
    </div>
  `).join('');
}

// Cetak LKPD
export function printWorksheet(moduleId: string): void {
  const mod = appData.modules.find(m => m.id === moduleId);
  if (!mod) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>LKPD Siswa - ${mod.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #111; line-height:1.5; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom:20px; }
          .student-box { border: 1px solid #000; padding: 10px; margin-bottom: 20px; font-size:14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin:0;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
          <h3 style="margin:5px 0 0 0;">SD NEGERI BOBONG - KECAMATAN TALIABU BARAT</h3>
          <p style="margin:2px 0 0 0; font-size:13px;">Mata Pelajaran: Bahasa Inggris | ${mod.grade} (${mod.phase})</p>
        </div>
        <div class="student-box">
          <p style="margin:0;">Nama Siswa: ___________________________</p>
          <p style="margin:5px 0 0 0;">Kelas / Nomor Absen: ___________________</p>
        </div>
        <h4>Topik: ${mod.title}</h4>
        <p><strong>Tujuan Pembelajaran:</strong> ${mod.target}</p>
        <div style="border: 1px dashed #666; padding: 15px; margin-top: 15px;">
          <p style="margin:0; font-weight:bold;">Instruksi Tugas:</p>
          <p style="margin-top:5px;">${mod.cp}</p>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Global Browser Window State Attachment
if (typeof window !== 'undefined') {
  (window as any).exportSiswaToCSV = exportSiswaToCSV;
  (window as any).exportNilaiToCSV = exportNilaiToCSV;
  (window as any).startEnglishQuiz = startEnglishQuiz;
  (window as any).renderQuizQuestion = renderQuizQuestion;
  (window as any).checkQuizAnswer = checkQuizAnswer;
  (window as any).renderModulAjar = renderModulAjar;
  (window as any).printWorksheet = printWorksheet;
}
