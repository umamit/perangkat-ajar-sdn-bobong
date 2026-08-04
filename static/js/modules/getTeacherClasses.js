import { appData } from '../helpers.js';
export function getTeacherClasses() {
    const activeMode = appData.activeRoleMode || 'guru_inggris';
    const selectElem = document.getElementById('roleModeSelect');
    if (selectElem && selectElem.value !== activeMode) {
        selectElem.value = activeMode;
    }
    if (activeMode === 'guru_inggris') {
        return appData.classes.filter(c => !c.id.startsWith('1') && !c.id.startsWith('2'));
    }
    return appData.classes;
}
