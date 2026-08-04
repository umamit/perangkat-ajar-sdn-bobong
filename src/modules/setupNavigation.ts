import { switchView } from './switchView';

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
