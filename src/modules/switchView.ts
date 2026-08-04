import { closeMobileSidebar } from './closeMobileSidebar';

export function switchView(targetView: string): void {
  const targetItem = document.querySelector(`.nav-item[data-view="${targetView}"]`);
  const activeSection = document.getElementById(`view-${targetView}`);
  if (!targetItem || !activeSection) return;

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  targetItem.classList.add('active');
  activeSection.classList.add('active');

  const titleEl = document.getElementById('currentViewTitle');
  if (titleEl) titleEl.innerText = (targetItem as HTMLElement).innerText.trim();
  window.location.hash = targetView;
  closeMobileSidebar();
}
