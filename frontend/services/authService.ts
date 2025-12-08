import { api } from '../config/api';
import type { User, UserRole } from '../types/database';

export interface LoginRequest {
  email: string;
  password: string;
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
}

// Mock данни за демонстрация (използва се когато backend не е наличен)
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'resident@test.com': {
    password: 'password',
    user: {
      id: 1,
      email: 'resident@test.com',
      fullName: 'Иван Петров',
      role: 'RESIDENT' as UserRole,
    },
  },
  'admin@test.com': {
    password: 'password',
    user: {
      id: 2,
      email: 'admin@test.com',
      fullName: 'Мария Георгиева',
      role: 'ADMIN' as UserRole,
    },
  },
};

export const authService = {
  // Вход
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      // Backend връща директно User обект (UserResponse)
      const user = await api.post<User>('/auth/login', credentials);
      
      // Запазваме потребителя в localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      return { user };
    } catch (error: any) {
      // Ако грешката е ApiError, пропускаме я нагоре
      if (error.name === 'ApiError') {
        // Специфична обработка на 401 Unauthorized
        if (error.status === 401) {
          throw new Error('Грешен имейл или парола');
        }
        throw error;
      }
      
      // Fallback към mock данни само ако backend не е наличен (network error)
      console.warn('Backend не е наличен, използват се mock данни');
      
      const mockUser = MOCK_USERS[credentials.email];
      if (mockUser && mockUser.password === credentials.password) {
        const mockResponse: LoginResponse = {
          user: mockUser.user,
        };
        
        localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        return mockResponse;
      }
      
      throw new Error('Грешен имейл или парола');
    }
  },

  // Регистрация
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    try {
      // Backend връща директно User обект (UserResponse)
      const user = await api.post<User>('/auth/register', data);
      
      // Запазваме потребителя в localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      return { user };
    } catch (error: any) {
      // Ако грешката е ApiError, пропускаме я нагоре
      if (error.name === 'ApiError' || error instanceof Error) {
        throw error;
      }
      
      // Fallback към mock данни само ако backend не е наличен (network error)
      console.warn('Backend не е наличен, създава се mock потребител');
      
      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 100,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      };
      
      const mockResponse: LoginResponse = {
        user: newUser,
      };
      
      localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      return mockResponse;
    }
  },

  // Изход
  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    // Евентуално можете да добавите API заявка за logout към backend-а
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