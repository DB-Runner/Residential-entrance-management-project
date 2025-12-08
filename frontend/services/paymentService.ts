import { api } from '../config/api';
import type { Payment, PaymentWithDetails, Receipt, PaymentStatus } from '../types/database';

export interface CreatePaymentRequest {
  unitFeeId: number;
  amount: number;
  bankReference: string;
}

export const paymentService = {
  // Вземи всички плащания (admin)
  getAllPayments: () => api.get<PaymentWithDetails[]>('/payments'),

  // Вземи моите плащания
  getMyPayments: () => api.get<PaymentWithDetails[]>('/payments/my'),

  // Вземи плащане по ID
  getPaymentById: (id: number) => api.get<PaymentWithDetails>(`/payments/${id}`),

  // Вземи плащанията за един апартамент (admin)
  getUnitPayments: (unitId: number) =>
    api.get<PaymentWithDetails[]>(`/units/${unitId}/payments`),

  // Създай ново плащане
  createPayment: (data: CreatePaymentRequest) =>
    api.post<Payment>('/payments', data),

  // Обнови статус на плащане (admin)
  updatePaymentStatus: (id: number, status: PaymentStatus) =>
    api.patch<Payment>(`/payments/${id}/status`, { status }),

  // Потвърди плащане (admin)
  confirmPayment: (id: number) =>
    api.patch<Payment>(`/payments/${id}/confirm`, {}),

  // Отмени плащане (admin)
  cancelPayment: (id: number) =>
    api.patch<Payment>(`/payments/${id}/cancel`, {}),

  // Изтрий плащане (admin)
  deletePayment: (id: number) => api.delete<void>(`/payments/${id}`),
};

export const receiptService = {
  // Вземи фактура по ID
  getReceipt: (receiptId: number) => api.get<Receipt>(`/receipts/${receiptId}`),

  // Генерирай фактура за плащане (admin)
  generateReceipt: (paymentId: number) =>
    api.post<Receipt>(`/payments/${paymentId}/receipt`, {}),

  // Изтегли PDF на фактура
  downloadReceiptPdf: (receiptId: number) => {
    const token = localStorage.getItem('authToken');
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    window.open(
      `${baseUrl}/receipts/${receiptId}/pdf${token ? `?token=${token}` : ''}`,
      '_blank'
    );
  },
};
