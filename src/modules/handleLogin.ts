import { appData } from '../helpers';
import { showToast } from './showToast';

export function handleLogin(event?: Event) {
  if (event) event.preventDefault();
  const nipInput = (document.getElementById('loginNip') as HTMLInputElement)?.value.trim();
  const passInput = (document.getElementById('loginPassword') as HTMLInputElement)?.value.trim();

  if (!nipInput || !passInput) {
    showToast('Silakan masukkan NIP dan Password!', 'error');
    return;
  }

  const teacherMap = new Map<string, any>();
  (appData.teachers || []).forEach((t: any) => teacherMap.set(t.nip, t));
  if (appData.teacher) teacherMap.set(appData.teacher.nip, appData.teacher);

  const matched = teacherMap.get(nipInput);
  if (matched && matched.password && matched.password === passInput) {
    (appData as any).currentTeacher = matched;
    document.cookie = 'sdn_bobong_auth=true; path=/; max-age=604800';
    showToast(`Selamat datang, ${matched.name}!`, 'success');
  } else {
    showToast('NIP atau Password salah!', 'error');
  }
}
