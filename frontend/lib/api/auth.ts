import { apiClient } from './client';

export type User = { id: string; name: string | null; email: string };
export type AuthResponse = { user: User; token: string };

export const authApi = {
  register: (payload: { name?: string; email: string; password: string }) =>
    apiClient.post<{ user: User }>('/auth/register', payload, null),
  login: (payload: { email: string; password: string }) =>
    apiClient.post<{ user: User }>('/auth/login', payload, null),
  validate: () => apiClient.get<{ valid: boolean; user: User }>('/auth/validate'),
  me: () => apiClient.get<User>('/auth/me'),
  logout: () => apiClient.post<{ success: boolean }>('/auth/logout', {}),
};
