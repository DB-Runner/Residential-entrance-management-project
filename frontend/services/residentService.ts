import { api } from '../config/api';
import { type User, type Unit, type UnitBalance, UserRole } from '../types/database';

export interface ResidentWithUnit extends User {
  unit?: Unit & { balance?: UnitBalance };
  unitNumber?: string;
}

// Mock данни за демонстрация
const MOCK_RESIDENTS: ResidentWithUnit[] = [
  {
    id: 1,
    fullName: 'Иван Петров',
    email: 'resident@test.com',
    role: UserRole.RESIDENT,
    unitNumber: '12',
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id: 3,
    fullName: 'Георги Димитров',
    email: 'georgi@example.com',
    role: UserRole.RESIDENT,
    unitNumber: '8',
    createdAt: '2024-02-20T11:30:00',
  },
  {
    id: 4,
    fullName: 'Елена Иванова',
    email: 'elena@example.com',
    role: UserRole.RESIDENT,
    unitNumber: '15',
    createdAt: '2024-03-10T14:15:00',
  },
];

export const residentService = {
  // Получи всички жители (за администратори)
  getAll: async (): Promise<ResidentWithUnit[]> => {
    try {
      return await api.get<ResidentWithUnit[]>('/residents');
    } catch (error) {
      console.warn('Backend не е наличен, използват се mock данни за жители');
      return MOCK_RESIDENTS;
    }
  },

  // Получи информация за конкретен жител
  getById: async (id: number): Promise<ResidentWithUnit> => {
    try {
      return await api.get<ResidentWithUnit>(`/residents/${id}`);
    } catch (error) {
      console.warn('Backend не е наличен, използват се mock данни');
      const resident = MOCK_RESIDENTS.find(r => r.id === id);
      if (!resident) throw new Error('Жителят не е намерен');
      return resident;
    }
  },

  // Добави нов жител (за администратори)
  create: async (data: { fullName: string; email: string; unitNumber: string }): Promise<ResidentWithUnit> => {
    try {
      return await api.post<ResidentWithUnit>('/residents', data);
    } catch (error) {
      console.warn('Backend не е наличен, използва се mock отговор');
      const newResident: ResidentWithUnit = {
        id: Math.floor(Math.random() * 1000) + 100,
        ...data,
        role: UserRole.RESIDENT,
        createdAt: new Date().toISOString(),
      };
      return newResident;
    }
  },

  // Редактирай жител (за администратори)
  update: async (id: number, data: Partial<ResidentWithUnit>): Promise<ResidentWithUnit> => {
    try {
      return await api.put<ResidentWithUnit>(`/residents/${id}`, data);
    } catch (error) {
      console.warn('Backend не е наличен, използва се mock отговор');
      throw new Error('Жителят не може да бъде редактиран в момента');
    }
  },

  // Изтрий жител (за администратори)
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/residents/${id}`);
    } catch (error) {
      console.warn('Backend не е наличен');
      throw new Error('Жителят не може да бъде изтрит в момента');
    }
  },
};
