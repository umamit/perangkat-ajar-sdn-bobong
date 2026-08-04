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

export function setupNavigation(): void {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      if (targetView) switchView(targetView);
    });
  });

  // Pulihkan tampilan aktif dari URL hash jika ada saat dimuat/refresh
  const currentHash = window.location.hash.replace('#', '').trim();
  if (currentHash) {
    switchView(currentHash);
  }
}
