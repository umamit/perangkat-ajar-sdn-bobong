import { appData } from '../helpers';

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
          ${(m.steps || []).map(step => `<li style="margin-bottom:4px;">${step}</li>`).join('')}
        </ol>
      </div>
    </div>
  `).join('');
}
