import { api } from '../config/api';

export interface Message {
  id: number;
  senderId: number;
  senderName?: string;
  recipientId?: number;
  recipientName?: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock данни за демонстрация
const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    senderId: 2,
    senderName: 'Мария Георгиева',
    recipientId: 1,
    subject: 'Относно таксата за декември',
    content: 'Здравейте, напомняме ви че таксата за декември е до 31-ви.',
    isRead: false,
    createdAt: '2024-12-03T09:00:00',
    updatedAt: '2024-12-03T09:00:00',
  },
  {
    id: 2,
    senderId: 2,
    senderName: 'Мария Георгиева',
    recipientId: 1,
    subject: 'Покана за събрание',
    content: 'Каним ви на годишното общо събрание на 20-ти декември.',
    isRead: true,
    createdAt: '2024-11-28T14:30:00',
    updatedAt: '2024-11-29T10:15:00',
  },
];

export const messageService = {
  // Получи всички съобщения за текущия потребител
  getMyMessages: async (): Promise<Message[]> => {
    try {
      return await api.get<Message[]>('/messages/my');
    } catch (error) {
      return MOCK_MESSAGES;
    }
  },

  // Получи непрочетени съобщения
  getUnreadMessages: async (): Promise<Message[]> => {
    try {
      return await api.get<Message[]>('/messages/unread');
    } catch (error) {
      return MOCK_MESSAGES.filter(m => !m.isRead);
    }
  },

  // Маркирай съобщение като прочетено
  markAsRead: async (id: number): Promise<void> => {
    try {
      await api.patch(`/messages/${id}/read`, {});
    } catch (error) {
      // Silent fail
    }
  },

  // Изпрати съобщение
  send: async (data: { recipientId?: number; subject: string; content: string }): Promise<Message> => {
    try {
      return await api.post<Message>('/messages', data);
    } catch (error) {
      const newMessage: Message = {
        id: Math.floor(Math.random() * 1000) + 100,
        senderId: 1,
        senderName: 'Иван Петров',
        ...data,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newMessage;
    }
  },

  // Изтрий съобщение
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/messages/${id}`);
    } catch (error) {
      throw new Error('Съобщението не може да бъде изтрито в момента');
    }
  },
};