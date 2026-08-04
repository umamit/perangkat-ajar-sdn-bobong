import { eraseCookie } from '../helpers.js';
import { checkAuthSession } from './checkAuthSession.js';
import { setAuthState } from './authState.js';
export function handleLogout() {
    setAuthState(false);
    if (typeof eraseCookie === 'function') {
        eraseCookie('sdn_bobong_auth');
    }
    checkAuthSession();
    const nipEl = document.getElementById('loginNip');
    const passEl = document.getElementById('loginPassword');
    if (nipEl)
        nipEl.value = '';
    if (passEl)
        passEl.value = '';
}
