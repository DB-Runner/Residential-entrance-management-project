import { api } from '../config/api';
import type { User, UserRole } from '../types/database';

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Вземи всички потребители (admin)
  getAllUsers: () => api.get<User[]>('/users'),

  // Вземи потребители по роля (admin)
  getUsersByRole: (role: UserRole) => api.get<User[]>(`/users?role=${role}`),

  // Вземи всички жители (admin)
  getResidents: () => api.get<User[]>('/users?role=RESIDENT'),

  // Вземи всички администратори (admin)
  getAdmins: () => api.get<User[]>('/users?role=ADMIN'),

  // Вземи потребител по ID (admin)
  getUserById: (id: number) => api.get<User>(`/users/${id}`),

  // Вземи текущия профил
  getMyProfile: () => api.get<User>('/users/me'),

  // Обнови профил
  updateProfile: (data: UpdateProfileRequest) =>
    api.put<User>('/users/profile', data),

  // Промени парола
  changePassword: (data: ChangePasswordRequest) =>
    api.post<void>('/users/change-password', data),

  // Изтрий потребител (admin)
  deleteUser: (id: number) => api.delete<void>(`/users/${id}`),

  // Промени роля на потребител (admin)
  changeUserRole: (userId: number, role: UserRole) =>
    api.patch<User>(`/users/${userId}/role`, { role }),
};
