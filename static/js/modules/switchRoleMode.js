import { appData, saveStorage } from '../helpers.js';
export function switchRoleMode(mode, renderCallbacks) {
    appData.activeRoleMode = mode;
    saveStorage();
    const selectElem = document.getElementById('roleModeSelect');
    if (selectElem)
        selectElem.value = mode;
    renderCallbacks.forEach(cb => cb());
}
