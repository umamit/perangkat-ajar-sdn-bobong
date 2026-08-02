import { appData, saveStorage } from '../helpers';

export function switchRoleMode(mode: string, renderCallbacks: Array<() => void>): void {
  (appData as any).activeRoleMode = mode;
  saveStorage();
  const selectElem = document.getElementById('roleModeSelect') as HTMLSelectElement | null;
  if (selectElem) selectElem.value = mode;
  renderCallbacks.forEach(cb => cb());
}
