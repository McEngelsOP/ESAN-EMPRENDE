export const INSTITUTIONAL_DOMAIN = 'ue.edu.pe';
export const BUSINESS_WORKSPACE_PATH = '/#/mi-emprendimiento';
export function postAuthDestination(value: string | null | undefined): string {
  return value === BUSINESS_WORKSPACE_PATH ? BUSINESS_WORKSPACE_PATH : '/';
}
export function institutionalEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@ue\.edu\.pe$/.test(email) && email.length <= 254 ? email : null;
}
export function allowedUser(user: {email?: string; email_confirmed_at?: string | null} | null): boolean {
  return !!(user?.email && user.email_confirmed_at && institutionalEmail(user.email));
}
