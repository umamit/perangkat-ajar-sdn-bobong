export function renderTugas(): void {
  const container = document.getElementById('tugasGrid');
  if (!container) return;
  container.innerHTML = `
    <div class="card" style="padding:20px; border-left:4px solid var(--primary);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="badge badge-info">Formatik</span>
        <span class="badge badge-success">Aktif</span>
      </div>
      <h3 style="font-size:16px; margin-bottom:6px;">Kuis Kosakata Action Verbs</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Kelas: 4A | Tenggat: 2025-08-10</p>
      <p style="font-size:13.5px; color:#334155; background:#f8fafc; padding:10px; border-radius:6px;">Jodohkan gambar aksi dengan kata bahasa Inggris yang tepat di lembar kerja.</p>
    </div>
  `;
}
