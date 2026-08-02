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
