import { eraseCookie } from '../helpers';
import { checkAuthSession } from './checkAuthSession';
import { setAuthState } from './authState';

export function handleLogout(): void {
  setAuthState(false);
  if (typeof eraseCookie === 'function') {
    eraseCookie('sdn_bobong_auth');
  }
  checkAuthSession();
  const nipEl = document.getElementById('loginNip') as HTMLInputElement | null;
  const passEl = document.getElementById('loginPassword') as HTMLInputElement | null;
  if (nipEl) nipEl.value = '';
  if (passEl) passEl.value = '';
}
