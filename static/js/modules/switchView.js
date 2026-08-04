import { closeMobileSidebar } from './closeMobileSidebar.js';
export function switchView(targetView) {
    const targetItem = document.querySelector(`.nav-item[data-view="${targetView}"]`);
    const activeSection = document.getElementById(`view-${targetView}`);
    if (!targetItem || !activeSection)
        return;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    targetItem.classList.add('active');
    activeSection.classList.add('active');
    const titleEl = document.getElementById('currentViewTitle');
    if (titleEl)
        titleEl.innerText = targetItem.innerText.trim();
    window.location.hash = targetView;
    closeMobileSidebar();
}
