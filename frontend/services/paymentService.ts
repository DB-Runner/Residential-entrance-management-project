import { api } from '../config/api';
import type { Payment, PaymentWithDetails, UnitFee, UnitFeeWithDetails } from '../types/database';

export interface PaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalAmount: number;
  paidCount: number;
  pendingCount: number;
}

// Mock данни за демонстрация (използва се когато backend не е наличен)
const MOCK_FEES: UnitFeeWithDetails[] = [
  {
    id: 1,
    unitId: 1,
    month: '2024-12-01',
    amount: 120.50,
    dueFrom: '2024-12-01',
    dueTo: '2024-12-31',
    isPaid: false,
    createdAt: '2024-11-25T10:00:00',
    updatedAt: '2024-11-25T10:00:00',
  },
  {
    id: 2,
    unitId: 1,
    month: '2024-11-01',
    amount: 115.00,
    dueFrom: '2024-11-01',
    dueTo: '2024-11-30',
    isPaid: true,
    createdAt: '2024-10-25T10:00:00',
    updatedAt: '2024-11-15T14:30:00',
  },
  {
    id: 3,
    unitId: 1,
    month: '2024-10-01',
    amount: 118.75,
    dueFrom: '2024-10-01',
    dueTo: '2024-10-31',
    isPaid: true,
    createdAt: '2024-09-25T10:00:00',
    updatedAt: '2024-10-12T09:20:00',
  },
];

export const paymentService = {
  // Получи всички такси за текущия потребител
  getMyFees: async (): Promise<UnitFeeWithDetails[]> => {
    try {
      return await api.get<UnitFeeWithDetails[]>('/payments/my-fees');
    } catch (error) {
      console.warn('Backend не е наличен, използват се mock данни за такси');
      return MOCK_FEES;
    }
  },

  // Получи такси за конкретна единица (за администратори)
  getUnitFees: async (unitId: number): Promise<UnitFeeWithDetails[]> => {
    try {
      return await api.get<UnitFeeWithDetails[]>(`/payments/units/${unitId}/fees`);
    } catch (error) {
      console.warn('Backend не е наличен, използват се mock данни');
      return MOCK_FEES;
    }
  },

  // Получи всички такси (за администратори)
  getAllFees: async (): Promise<UnitFeeWithDetails[]> => {
    try {
      return await api.get<UnitFeeWithDetails[]>('/payments/fees');
    } catch (error) {
      console.warn('Backend не е наличен, използват се mock данни');
      return MOCK_FEES;
    }
  },

  // Получи обобщение на плащанията
  getPaymentSummary: async (): Promise<PaymentSummary> => {
    try {
      return await api.get<PaymentSummary>('/payments/summary');
    } catch (error) {
      console.warn('Backend не е наличен, използват се mock данни');
      const paid = MOCK_FEES.filter(f => f.isPaid);
      const pending = MOCK_FEES.filter(f => !f.isPaid);
      return {
        totalPaid: paid.reduce((sum, f) => sum + f.amount, 0),
        totalPending: pending.reduce((sum, f) => sum + f.amount, 0),
        totalAmount: MOCK_FEES.reduce((sum, f) => sum + f.amount, 0),
        paidCount: paid.length,
        pendingCount: pending.length,
      };
    }
  },

  // Плати такса
  payFee: async (feeId: number, bankReference: string): Promise<Payment> => {
    try {
      return await api.post<Payment>(`/payments/fees/${feeId}/pay`, { bankReference });
    } catch (error) {
      console.warn('Backend не е наличен, използва се mock отговор');
      throw new Error('Плащането не може да бъде обработено в момента');
    }
  },
};
