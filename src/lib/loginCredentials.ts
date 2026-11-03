/** Existing browser-side credentials. This does not authorize database access. */
export const DEFAULT_ADMIN_PASSWORD = 'admin2026';
export const DEFAULT_PRODUCER_PASSWORD = 'frs2026';

export function getLoginRole(username: string, password: string): 'admin' | 'producer' | null {
  const login = username.trim().toLowerCase();
  if (login === 'admin' && password.trim() === DEFAULT_ADMIN_PASSWORD) return 'admin';
  if (login === 'producer' && password.trim() === DEFAULT_PRODUCER_PASSWORD) return 'producer';
  return null;
}
