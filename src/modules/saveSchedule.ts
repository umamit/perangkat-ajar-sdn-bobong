import { appData, saveStorage } from '../helpers';
import { closeModal } from './closeModal';
import { renderTimetable } from './renderTimetable';

export function saveSchedule(e: Event): void {
  e.preventDefault();
  const day = (document.getElementById('scheduleDay') as HTMLSelectElement).value;
  const time = (document.getElementById('scheduleTime') as HTMLInputElement).value.trim();
  const classId = (document.getElementById('scheduleClass') as HTMLSelectElement).value;
  const topic = (document.getElementById('scheduleTopic') as HTMLInputElement).value.trim();

  if (!appData.timetable) appData.timetable = [];

  const newSlot = { day, time, classId, topic };
  appData.timetable.push(newSlot);

  saveStorage();
  renderTimetable();
  closeModal();
  alert(`✅ Jadwal ${day} kelas ${classId} berhasil ditambahkan!`);
}
