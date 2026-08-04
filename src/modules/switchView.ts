import { closeMobileSidebar } from './closeMobileSidebar';

export function switchView(targetView: string): void {
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');
  const targetItem = document.querySelector(`.nav-item[data-view="${targetView}"]`);

  if (!targetItem) return;

  navItems.forEach(n => n.classList.remove('active'));
  targetItem.classList.add('active');

  viewSections.forEach(v => v.classList.remove('active'));
  const activeSection = document.getElementById(`view-${targetView}`);
  if (activeSection) {
    activeSection.classList.add('active');
    const titleEl = document.getElementById('currentViewTitle');
    if (titleEl) titleEl.innerText = (targetItem as HTMLElement).innerText.trim();
  }

  // Simpan ke URL Hash agar saat refresh tidak kembali ke Dashboard
  window.location.hash = targetView;
  closeMobileSidebar();
}
