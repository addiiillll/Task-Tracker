// lib/api/client.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: any;
  token?: string | null;
  headers?: Record<string, string>;
  // when using cookie-based auth
  credentials?: RequestCredentials;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, headers = {}, credentials } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: credentials ?? 'include', // allow httpOnly cookie auth
  });

  if (!res.ok) {
    let errMsg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      errMsg = data?.message || errMsg;
    } catch {}
    const error = new Error(errMsg) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  // 204 no content
  if (res.status === 204) return undefined as unknown as T;

  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: 'GET', token }),
  post: <T>(path: string, body?: any, token?: string | null) => request<T>(path, { method: 'POST', body, token }),
  put: <T>(path: string, body?: any, token?: string | null) => request<T>(path, { method: 'PUT', body, token }),
  patch: <T>(path: string, body?: any, token?: string | null) => request<T>(path, { method: 'PATCH', body, token }),
  delete: <T>(path: string, token?: string | null) => request<T>(path, { method: 'DELETE', token }),
};
