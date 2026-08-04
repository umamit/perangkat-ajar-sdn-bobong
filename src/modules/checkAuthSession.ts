import { authState, setAuthState } from './authState';
import { getCookie } from '../helpers';

export function checkAuthSession(): void {
  const cookieAuth = typeof getCookie === 'function' && getCookie('sdn_bobong_auth') === 'true';
  const isLoggedIn = authState.isLoggedIn || cookieAuth;

  if (cookieAuth && !authState.isLoggedIn) {
    setAuthState(true);
  }

  const loginScreen = document.getElementById('loginScreen');
  const mainContent = document.getElementById('appMainContent');

  if (isLoggedIn) {
    if (loginScreen) loginScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'flex';
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
  }
}
