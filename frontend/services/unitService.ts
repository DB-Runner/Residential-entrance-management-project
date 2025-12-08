import { api } from '../config/api';
import type { Unit, UnitFee, UnitFeeWithDetails, UnitBalance } from '../types/database';

export interface CreateUnitRequest {
  buildingId: number;
  unitNumber: string;
  area: number;
  residents: number;
  floor?: number;
}

export interface UpdateUnitRequest {
  unitNumber?: string;
  area?: number;
  residents?: number;
  floor?: number;
}

export interface CreateUnitFeeRequest {
  unitId: number;
  month: string; // ISO date string (YYYY-MM-DD)
  amount: number;
  dueFrom: string; // ISO date string
  dueTo: string; // ISO date string
}

export interface CreateBulkFeesRequest {
  month: string; // ISO date string (YYYY-MM-DD)
  amount: number;
  dueFrom: string;
  dueTo: string;
}

export const unitService = {
  // Вземи всички апартаменти
  getAllUnits: () => api.get<Unit[]>('/units'),

  // Вземи апартамент по ID
  getUnitById: (id: number) => api.get<Unit>(`/units/${id}`),

  // Вземи апартамента на текущия потребител
  getMyUnit: () => api.get<Unit>('/units/my'),

  // Създай нов апартамент (само admin)
  createUnit: (data: CreateUnitRequest) =>
    api.post<Unit>('/units', data),

  // Обнови апартамент (само admin)
  updateUnit: (id: number, data: UpdateUnitRequest) =>
    api.put<Unit>(`/units/${id}`, data),

  // Изтрий апартамент (само admin)
  deleteUnit: (id: number) => api.delete<void>(`/units/${id}`),

  // Вземи баланса на апартамент
  getUnitBalance: (unitId: number) => api.get<UnitBalance>(`/units/${unitId}/balance`),
};

export const unitFeeService = {
  // Вземи всички такси (admin)
  getAllFees: () => api.get<UnitFeeWithDetails[]>('/unit-fees'),

  // Вземи таксите на един апартамент
  getUnitFees: (unitId: number) =>
    api.get<UnitFeeWithDetails[]>(`/units/${unitId}/fees`),

  // Вземи моите такси
  getMyFees: () => api.get<UnitFeeWithDetails[]>('/unit-fees/my'),

  // Вземи непла��ени такси (admin)
  getUnpaidFees: () => api.get<UnitFeeWithDetails[]>('/unit-fees/unpaid'),

  // Създай нова такса (само admin)
  createFee: (data: CreateUnitFeeRequest) =>
    api.post<UnitFee>('/unit-fees', data),

  // Създай такси за всички апартаменти (само admin)
  createFeesForAll: (data: CreateBulkFeesRequest) =>
    api.post<UnitFee[]>('/unit-fees/bulk', data),

  // Маркирай такса като платена (admin)
  markAsPaid: (feeId: number) =>
    api.patch<UnitFee>(`/unit-fees/${feeId}/mark-paid`, {}),

  // Изтрий такса (admin)
  deleteFee: (feeId: number) => api.delete<void>(`/unit-fees/${feeId}`),
};
