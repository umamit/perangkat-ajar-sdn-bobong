import { showToast } from './showToast.js';
import { appData, saveStorage } from '../helpers.js';
import { closeModal } from './closeModal.js';
import { renderTimetable } from './renderTimetable.js';
export function saveSchedule(e) {
    e.preventDefault();
    const day = document.getElementById('scheduleDay').value;
    const time = document.getElementById('scheduleTime').value.trim();
    const classId = document.getElementById('scheduleClass').value;
    const topic = document.getElementById('scheduleTopic').value.trim();
    if (!appData.timetable)
        appData.timetable = [];
    const newSlot = { day, time, classId, topic };
    appData.timetable.push(newSlot);
    saveStorage();
    renderTimetable();
    closeModal();
    showToast(`Jadwal ${day} kelas ${classId} berhasil ditambahkan!`, 'success');
}
