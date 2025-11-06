// lib/api/tasks.ts
import { apiClient } from './client';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  dueDate?: string | null;
};

export type TaskInput = {
  title: string;
  description?: string | null;
  dueDate?: string | null;
};

export const tasksApi = {
  list: (status?: 'all' | 'completed' | 'pending') =>
    apiClient.get<Task[]>(`/tasks${status && status !== 'all' ? `?status=${status}` : ''}`),
  create: (data: TaskInput) => apiClient.post<Task>('/tasks', data),
  update: (id: string, data: Partial<TaskInput & { completed: boolean }>) =>
    apiClient.put<Task>(`/tasks/${id}`, data),
  toggle: (id: string) => apiClient.patch<Task>(`/tasks/${id}/toggle`, {}),
  remove: (id: string) => apiClient.delete<{ success: boolean }>(`/tasks/${id}`),
};
