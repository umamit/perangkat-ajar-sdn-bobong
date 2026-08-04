export function openModal(title, contentHtml) {
    const overlay = document.getElementById('modalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    if (overlay && titleEl && bodyEl) {
        titleEl.textContent = title;
        bodyEl.innerHTML = contentHtml;
        overlay.classList.add('active');
    }
}
