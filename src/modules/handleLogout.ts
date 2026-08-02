import { eraseCookie } from '../helpers';
import { checkAuthSession } from './checkAuthSession';
import { inMemoryAuth } from './handleLogin';

export function handleLogout(): void {
  (window as any).inMemoryAuth = false;
  if (typeof eraseCookie === 'function') {
    eraseCookie('sdn_bobong_auth');
  }
  checkAuthSession();
  const nipEl = document.getElementById('loginNip') as HTMLInputElement | null;
  const passEl = document.getElementById('loginPassword') as HTMLInputElement | null;
  if (nipEl) nipEl.value = '';
  if (passEl) passEl.value = '';
}
