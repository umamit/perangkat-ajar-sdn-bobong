import { showToast } from './showToast';
import { appData, saveStorage } from '../helpers';
import { closeModal } from './closeModal';
import { renderTugas } from './renderTugas';

export function saveTugas(e: Event): void {
  e.preventDefault();
  const title = (document.getElementById('tugasTitle') as HTMLInputElement).value.trim();
  const classId = (document.getElementById('tugasClass') as HTMLSelectElement).value;
  const type = (document.getElementById('tugasType') as HTMLSelectElement).value;
  const dueDate = (document.getElementById('tugasDueDate') as HTMLInputElement).value;
  const description = (document.getElementById('tugasDescription') as HTMLTextAreaElement).value.trim();

  if (!appData.tasks) appData.tasks = [];

  const newTask = {
    id: `TSK-0${appData.tasks.length + 1}`,
    title,
    classId,
    dueDate,
    type,
    status: 'Aktif',
    description
  };

  appData.tasks.unshift(newTask);
  saveStorage();
  renderTugas();
  closeModal();
  alert(`✅ Penugasan "${title}" berhasil ditambahkan!`);
}
