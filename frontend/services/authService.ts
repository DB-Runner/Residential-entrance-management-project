import { api } from '../config/api';
import { UserRole, type User } from '../types/database';

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
  buildingCode?: string;
  buildingName?: string;
  buildingAddress?: string;
  totalUnits?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  buildingCode?: string;
}

// Mock данни за демонстрация (използва се когато backend не е наличен)
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'resident@test.com': {
    password: 'password',
    user: {
      id: 1,
      email: 'resident@test.com',
      fullName: 'Иван Петров',
      role: UserRole.RESIDENT,
    },
  },
  'admin@test.com': {
    password: 'password',
    user: {
      id: 2,
      email: 'admin@test.com',
      fullName: 'Мария Георгиева',
      role: UserRole.ADMIN,
    },
  },
};

export const authService = {
  // Вход
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('Sending login request to backend:', credentials.email);
      const user = await api.post<User>('/auth/login', credentials);
      
      console.log('Backend login response:', user);
      
      // Генерираме mock token
      const mockToken = 'mock-token-' + Math.random().toString(36).substring(7);
      
      // Запазваме потребителя и токена в localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      console.log('LocalStorage updated after login:', {
        token: mockToken,
        user: user,
        isAuthenticated: localStorage.getItem('isAuthenticated'),
      });
      
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
        const mockToken = 'mock-token-' + Math.random().toString(36).substring(7);
        
        const mockResponse: LoginResponse = {
          user: mockUser.user,
        };
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('LocalStorage updated after mock login:', {
          token: mockToken,
          user: mockResponse.user,
          isAuthenticated: localStorage.getItem('isAuthenticated'),
        });
        
        return mockResponse;
      }
      
      throw new Error('Грешен имейл или парола');
    }
  },

  // Регистрация
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    console.log('Starting registration with mock token');
    
    try {
      console.log('Sending registration request to backend:', data);
      const user = await api.post<User>('/auth/register', data);
      
      console.log('Backend registration response:', user);
      
      // Backend връща само User, генерираме mock token
      const mockToken = 'mock-token-' + Math.random().toString(36).substring(7);
      
      // Генерираме код за домоуправител
      let mockBuildingCode: string | undefined = undefined;
      if (data.role === UserRole.ADMIN) {
        mockBuildingCode = Math.floor(100000 + Math.random() * 900000).toString();
      }
      
      // Запази токена и потребителя с правилните ключове
      localStorage.setItem('token', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      console.log('LocalStorage updated after registration:', {
        token: mockToken,
        user: user,
        isAuthenticated: localStorage.getItem('isAuthenticated'),
      });
      
      return {
        token: mockToken,
        user: user,
        buildingCode: mockBuildingCode,
      };
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Обработка на грешки
      if (error.message && error.message.includes('Failed to fetch')) {
        // Backend не е достъпен - използваме mock регистрация
        console.warn('Backend не е наличен, използва се mock регистрация');
        
        // Създай mock потребител
        const mockUser: User = {
          id: Math.floor(Math.random() * 1000) + 1,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          createdAt: new Date().toISOString(),
        };
        
        const mockToken = 'mock-token-' + Math.random().toString(36).substring(7);
        
        // Генерирай код за домоуправител
        let mockBuildingCode: string | undefined = undefined;
        if (data.role === UserRole.ADMIN) {
          mockBuildingCode = Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        // Запази в localStorage с правилните ключове
        localStorage.setItem('token', mockToken);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('LocalStorage updated after mock registration:', {
          token: mockToken,
          user: mockUser,
          isAuthenticated: localStorage.getItem('isAuthenticated'),
        });
        
        return {
          token: mockToken,
          user: mockUser,
          buildingCode: mockBuildingCode,
        };
      }
      
      throw error;
    }
  },

  // Изход
  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('newBuildingCode');
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