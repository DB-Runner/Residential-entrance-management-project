import { api } from '../config/api';
import type { Building } from '../types/database';

export interface CreateBuildingRequest {
  name: string;
  address: string;
}

export interface UpdateBuildingRequest {
  name?: string;
  address?: string;
}

export const buildingService = {
  // Вземи всички сгради (admin)
  getAllBuildings: () => api.get<Building[]>('/buildings'),

  // Вземи сграда по ID
  getBuildingById: (id: number) => api.get<Building>(`/buildings/${id}`),

  // Вземи сграда с всички апартаменти (admin)
  getBuildingWithUnits: (id: number) =>
    api.get<Building>(`/buildings/${id}?includeUnits=true`),

  // Създай нова сграда (admin)
  createBuilding: (data: CreateBuildingRequest) =>
    api.post<Building>('/buildings', data),

  // Обнови сграда (admin)
  updateBuilding: (id: number, data: UpdateBuildingRequest) =>
    api.put<Building>(`/buildings/${id}`, data),

  // Изтрий сграда (admin)
  deleteBuilding: (id: number) => api.delete<void>(`/buildings/${id}`),
};
