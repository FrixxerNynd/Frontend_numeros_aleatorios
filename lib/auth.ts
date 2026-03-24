/**
 * Minimal auth helper to call the backend login endpoint.
 * This is intentionally small: it wraps fetch and returns parsed JSON or throws an Error.
 */
export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text };
  }

  if (!res.ok) {
    // Expect backend to return { message } on errors; otherwise fallback to statusText
    throw new Error(data?.message || res.statusText || 'Login failed');
  }

  return data;
}

type JwtPayload = {
  sub?: string | number;
  id?: string | number;
  userId?: string | number;
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

export function decodeJwtPayload(token: string): JwtPayload | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const decoded = decodeBase64Url(parts[1]);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token);
  const rawId = payload?.id ?? payload?.userId ?? payload?.sub;
  return rawId != null ? String(rawId) : null;
}
