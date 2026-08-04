export function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed bottom-5 right-5 z-[3000] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const bgStyles = type === 'success'
        ? 'bg-emerald-900/90 text-white border-emerald-700/50 shadow-emerald-900/20'
        : type === 'error'
            ? 'bg-rose-900/90 text-white border-rose-700/50 shadow-rose-900/20'
            : 'bg-slate-900/90 text-white border-slate-700/50 shadow-slate-900/20';
    const icon = type === 'success'
        ? '<i class="ri-checkbox-circle-fill text-emerald-400 text-lg"></i>'
        : type === 'error'
            ? '<i class="ri-error-warning-fill text-rose-400 text-lg"></i>'
            : '<i class="ri-information-fill text-sky-400 text-lg"></i>';
    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-apple-md border backdrop-blur-md shadow-lg text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 ${bgStyles}`;
    toast.innerHTML = `${icon} <span class="flex-1">${message}</span>`;
    container.appendChild(toast);
    // Trigger Animation
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });
    // Auto Remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}
