import { closeMobileSidebar } from './closeMobileSidebar';

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
