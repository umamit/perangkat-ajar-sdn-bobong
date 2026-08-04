import { authState, setAuthState } from './authState.js';
import { getCookie } from '../helpers.js';
export function checkAuthSession() {
    const cookieAuth = typeof getCookie === 'function' && getCookie('sdn_bobong_auth') === 'true';
    const isLoggedIn = authState.isLoggedIn || cookieAuth;
    if (cookieAuth && !authState.isLoggedIn) {
        setAuthState(true);
    }
    const loginScreen = document.getElementById('loginScreen');
    const mainContent = document.getElementById('appMainContent');
    if (isLoggedIn) {
        if (loginScreen)
            loginScreen.style.display = 'none';
        if (mainContent)
            mainContent.style.display = 'flex';
    }
    else {
        if (loginScreen)
            loginScreen.style.display = 'flex';
        if (mainContent)
            mainContent.style.display = 'none';
    }
}
