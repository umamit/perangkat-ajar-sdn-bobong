export function openModal(title: string, contentHtml: string): void {
  if (document.getElementById('modalTitle')) document.getElementById('modalTitle')!.innerText = title;
  if (document.getElementById('modalBody')) document.getElementById('modalBody')!.innerHTML = contentHtml;
  if (document.getElementById('modalOverlay')) document.getElementById('modalOverlay')!.classList.add('active');
}

export function closeModal(): void {
  if (document.getElementById('modalOverlay')) document.getElementById('modalOverlay')!.classList.remove('active');
}
