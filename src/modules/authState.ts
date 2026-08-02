export let authState = { isLoggedIn: false };

export function setAuthState(val: boolean): void {
  authState.isLoggedIn = val;
}
