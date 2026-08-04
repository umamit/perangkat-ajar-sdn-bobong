import { appData } from '../helpers';

export function renderDataKelas(targetClasses?: any[]) {
  const container = document.getElementById('kelasGridContainer');
  if (!container) return;

  const classesToRender = targetClasses && targetClasses.length > 0 ? targetClasses : (appData.classes || []);
  if (classesToRender.length === 0) {
    container.innerHTML = `<div className="col-span-full text-center py-6 text-slate-400">Belum ada data kelas</div>`;
    return;
  }

  container.innerHTML = classesToRender.map(c => `
    <div className="p-4 rounded-xl bg-white border border-slate-200">
      <h4 className="font-bold text-slate-800">${c.name}</h4>
      <p className="text-xs text-slate-500">${c.phase || 'Fase A'} - ${c.room || 'Ruang'}</p>
    </div>
  `).join('');
}
