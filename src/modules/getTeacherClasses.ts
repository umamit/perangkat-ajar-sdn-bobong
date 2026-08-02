import { appData } from '../helpers';

export function getTeacherClasses(): any[] {
  const activeMode = (appData as any).activeRoleMode || 'guru_inggris';
  const selectElem = document.getElementById('roleModeSelect') as HTMLSelectElement | null;
  if (selectElem && selectElem.value !== activeMode) {
    selectElem.value = activeMode;
  }
  
  if (activeMode === 'guru_inggris') {
    return appData.classes.filter(c => !c.id.startsWith('1') && !c.id.startsWith('2'));
  }
  return appData.classes;
}
