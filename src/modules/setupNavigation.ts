import { switchView } from './switchView';

export function setupNavigation(): void {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      if (targetView) switchView(targetView);
    });
  });
  const currentHash = window.location.hash.replace('#', '').trim();
  if (currentHash) switchView(currentHash);
}
