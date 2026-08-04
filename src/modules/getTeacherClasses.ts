import { appData } from '../helpers';
import { INITIAL_DATA } from '../data';

export function getTeacherClasses(): any[] {
  const classes = (appData.classes && appData.classes.length > 0) ? appData.classes : INITIAL_DATA.classes;
  return classes;
}
