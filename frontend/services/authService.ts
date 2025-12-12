import { api } from '../config/api';
import { UserRole, type User } from '../types/database';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  unitNumber?: string;
  buildingCode?: string;
  buildingName?: string;
  buildingAddress?: string;
  totalUnits?: number;
}

export interface AuthResponse {
  user: User;
  buildingCode?: string;
}

export const authService = {
  // Вход
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const user = await api.post<User>('/auth/login', credentials);
    
    // Запазваме потребителя в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    return { user };
  },

  // Регистрация
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Регистрираме потребителя
    await api.post<User>('/auth/register', data);
    
    // След успешна регистрация, вземаме пълните user данни
    const user = await api.get<User>('/auth/me');
    
    // Генерираме код за домоуправител (временно - докато backend не го върне)
    let buildingCode: string | undefined = undefined;
    if (user.role === UserRole.BUILDING_MANAGER) {
      buildingCode = Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    // Запази потребителя в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    return {
      user: user,
      buildingCode: buildingCode,
    };
  },

  // Изход
  logout: async () => {
    try {
      // Опит за извикване на backend logout endpoint
      await api.post('/auth/logout', {});
    } catch (error) {
      console.warn('Backend logout failed, clearing local session');
    } finally {
      // Винаги изчистваме локалната сесия
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('newBuildingCode');
    }
  },

  // Вземи текущия потребител от backend
  me: async (): Promise<User> => {
    try {
      const user = await api.get<User>('/auth/me');
      // Актуализираме localStorage с актуалните данни
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      // Ако заявката не успее, изчистваме сесията
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      throw error;
    }
  },

  // Вземи текущия потребител от localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Проверка дали има активна сесия
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Обнови текущия потребител в localStorage
  updateCurrentUser: (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
};