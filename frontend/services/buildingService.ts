import { api } from '../config/api';
import type { Building } from '../types/database';

export interface BuildingRegistrationRequest {
  name: string;
  address: string;
  totalUnits: number;
}

export interface BuildingWithCode extends Building {
  accessCode?: string;
}

export const buildingService = {
  // Регистрирай нова сграда и генерирай код
  register: async (data: BuildingRegistrationRequest): Promise<BuildingWithCode> => {
    try {
      return await api.post<BuildingWithCode>('/buildings/register', data);
    } catch (error) {
      // Генерирай 6-цифрен код
      const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
      const mockBuilding: BuildingWithCode = {
        id: Math.floor(Math.random() * 1000) + 100,
        name: data.name,
        address: data.address,
        accessCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Запази в localStorage за демонстрация
      localStorage.setItem('buildingCode', accessCode);
      localStorage.setItem('buildingData', JSON.stringify(mockBuilding));
      return mockBuilding;
    }
  },

  // Намери сграда по код
  findByCode: async (code: string): Promise<BuildingWithCode | null> => {
    try {
      return await api.get<BuildingWithCode>(`/buildings/by-code/${code}`);
    } catch (error) {
      const storedCode = localStorage.getItem('buildingCode');
      const buildingData = localStorage.getItem('buildingData');
      
      if (storedCode === code && buildingData) {
        return JSON.parse(buildingData);
      }
      return null;
    }
  },

  // Провери дали домоуправителят има регистрирана сграда
  hasBuilding: async (): Promise<boolean> => {
    try {
      const response = await api.get<{ hasBuilding: boolean }>('/buildings/my-building/status');
      return response.hasBuilding;
    } catch (error) {
      const buildingCode = localStorage.getItem('buildingCode');
      return !!buildingCode;
    }
  },

  // Получи сградата на текущия домоуправител
  getMyBuilding: async (): Promise<BuildingWithCode | null> => {
    try {
      return await api.get<BuildingWithCode>('/buildings/my-building');
    } catch (error) {
      const buildingData = localStorage.getItem('buildingData');
      return buildingData ? JSON.parse(buildingData) : null;
    }
  },
};