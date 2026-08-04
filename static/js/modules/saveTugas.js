import { appData, saveStorage } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderTugas } from './renderTugas.js';
export function saveTugas(e) {
    e.preventDefault();
    const title = document.getElementById('tugasTitle').value.trim();
    const classId = document.getElementById('tugasClass').value;
    const type = document.getElementById('tugasType').value;
    const dueDate = document.getElementById('tugasDueDate').value;
    const description = document.getElementById('tugasDescription').value.trim();
    if (!appData.tasks)
        appData.tasks = [];
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
