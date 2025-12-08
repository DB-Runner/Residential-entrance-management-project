import { api } from '../config/api';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  isImportant: boolean;
}

// Mock данни за демонстрация
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Планирана поддръжка на асансьора',
    content: 'На 15-ти декември ще бъде извършена поддръжка на асансьора от 9:00 до 15:00 часа.',
    createdBy: 2,
    createdByName: 'Мария Георгиева',
    createdAt: '2024-12-03T10:00:00',
    updatedAt: '2024-12-03T10:00:00',
    isImportant: true,
  },
  {
    id: 2,
    title: 'Зимно почистване',
    content: 'Напомняме ви, че зимното почистване на общите части ще започне от следващата седмица.',
    createdBy: 2,
    createdByName: 'Мария Георгиева',
    createdAt: '2024-12-01T14:30:00',
    updatedAt: '2024-12-01T14:30:00',
    isImportant: false,
  },
  {
    id: 3,
    title: 'Нови правила за паркиране',
    content: 'Моля спазвайте новите правила за паркиране в гаража. Детайли са поставени на таблото.',
    createdBy: 2,
    createdByName: 'Мария Георгиева',
    createdAt: '2024-11-28T09:15:00',
    updatedAt: '2024-11-28T09:15:00',
    isImportant: false,
  },
];

export const announcementService = {
  // Получи всички обяви
  getAll: async (): Promise<Announcement[]> => {
    try {
      return await api.get<Announcement[]>('/announcements');
    } catch (error) {
      console.warn('Backend не е наличен, използват се mock данни за обяви');
      return MOCK_ANNOUNCEMENTS;
    }
  },

  // Създай нова обява (за администратори)
  create: async (data: Omit<Announcement, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Announcement> => {
    try {
      return await api.post<Announcement>('/announcements', data);
    } catch (error) {
      console.warn('Backend не е наличен, използва се mock отговор');
      const newAnnouncement: Announcement = {
        id: Math.floor(Math.random() * 1000) + 100,
        ...data,
        createdBy: 2,
        createdByName: 'Мария Георгиева',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newAnnouncement;
    }
  },

  // Редактирай обява (за администратори)
  update: async (id: number, data: Partial<Announcement>): Promise<Announcement> => {
    try {
      return await api.put<Announcement>(`/announcements/${id}`, data);
    } catch (error) {
      console.warn('Backend не е наличен, използва се mock отговор');
      throw new Error('Обявата не може да бъде редактирана в момента');
    }
  },

  // Изтрий обява (за администратори)
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/announcements/${id}`);
    } catch (error) {
      console.warn('Backend не е наличен');
      throw new Error('Обявата не може да бъде изтрита в момента');
    }
  },
};
