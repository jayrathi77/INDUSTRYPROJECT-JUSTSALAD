const apiRoot = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiRoot}/api${path}`, { ...init, credentials: 'include', headers: { 'Content-Type': 'application/json', ...init.headers } });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
