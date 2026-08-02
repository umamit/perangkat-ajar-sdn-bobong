// Navigation & Modal UI Handlers Module
import { appData, saveStorage } from '../helpers';
import { renderTeacherProfile } from './teacherModule';

export function openModal(title: string, contentHtml: string): void {
  if (document.getElementById('modalTitle')) document.getElementById('modalTitle')!.innerText = title;
  if (document.getElementById('modalBody')) document.getElementById('modalBody')!.innerHTML = contentHtml;
  if (document.getElementById('modalOverlay')) document.getElementById('modalOverlay')!.classList.add('active');
}

export function closeModal(): void {
  if (document.getElementById('modalOverlay')) document.getElementById('modalOverlay')!.classList.remove('active');
}

export function closeMobileSidebar(): void {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  const toggleBtn = document.getElementById('menuToggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    if (icon) icon.className = 'ri-menu-line';
  }
}

export function setupNavigation(): void {
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      viewSections.forEach(v => v.classList.remove('active'));
      const activeSection = document.getElementById(`view-${targetView}`);
      if (activeSection) {
        activeSection.classList.add('active');
        document.getElementById('currentViewTitle')!.innerText = (item as HTMLElement).innerText.trim();
      }

      closeMobileSidebar();
    });
  });
}

export function switchRoleMode(mode: string, renderCallbacks: Array<() => void>): void {
  (appData as any).activeRoleMode = mode;
  saveStorage();
  const selectElem = document.getElementById('roleModeSelect') as HTMLSelectElement | null;
  if (selectElem) selectElem.value = mode;
  renderCallbacks.forEach(cb => cb());
}
