import { appData } from '../helpers';

export function getTeacherClasses() {
  const classes = appData.classes || [];
  if ((appData as any).activeRoleMode === 'guru_inggris') {
    return classes;
  }
  return classes.filter(c => c.id === '1A' || c.id === '4A');
}
