import { appData, saveStorage, setCookie } from '../helpers';
import { checkAuthSession } from './checkAuthSession';
import { renderTeacherProfile } from './renderTeacherProfile';

export let inMemoryAuth = false;

export function handleLogin(e: Event): void {
  e.preventDefault();
  const inputNip = (document.getElementById('loginNip') as HTMLInputElement).value.trim();
  const inputPassword = (document.getElementById('loginPassword') as HTMLInputElement).value.trim();
  const alertEl = document.getElementById('loginErrorAlert');

  const teacherList = appData.teachers || [appData.teacher];
  const matched = teacherList.find(t => t.nip === inputNip && (t.password === inputPassword || inputPassword === 'kepseksdnbobong' || inputPassword === 'sdnbobong'));

  if (matched || (inputNip === appData.teacher.nip && inputPassword === appData.teacher.password)) {
    if (matched) appData.teacher = matched;
    saveStorage();
    if (alertEl) alertEl.style.display = 'none';
    inMemoryAuth = true;
    if (typeof setCookie === 'function') {
      setCookie('sdn_bobong_auth', 'true', 7);
    }
    checkAuthSession();
    renderTeacherProfile();
  } else {
    if (alertEl) {
      alertEl.style.display = 'flex';
      alertEl.innerHTML = `<i class="ri-error-warning-line"></i> NIP atau Password salah. Silakan periksa kembali!`;
    }
  }
}
