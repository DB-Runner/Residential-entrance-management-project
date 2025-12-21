import { api } from '../config/api';
import type { 
  Transaction, 
  ReceiptDetails,
  StripePaymentRequest,
  StripePaymentResponse,
  CashPaymentRequest,
  BankPaymentRequest,
  TransactionType
} from '../types/database';

export const paymentService = {
  // Създай Stripe плащане и получи clientSecret
  // Backend автоматично създава транзакция която ще се финализира след успешно плащане
  createStripePayment: async (unitId: number, amount: number): Promise<StripePaymentResponse> => {
    const request: StripePaymentRequest = { amount };
    return await api.post<StripePaymentResponse>(`/units/${unitId}/payments/stripe`, request);
  },

  // Регистрирай кеш плащане
  createCashPayment: async (unitId: number, request: CashPaymentRequest): Promise<void> => {
    await api.post<void>(`/units/${unitId}/payments/cash`, request);
  },

  // Регистрирай банково плащане
  createBankPayment: async (unitId: number, request: BankPaymentRequest): Promise<void> => {
    await api.post<void>(`/units/${unitId}/payments/bank`, request);
  },

  // Получи всички транзакции за unit (плащания или такси)
  getUnitTransactions: async (unitId: number, type?: TransactionType): Promise<Transaction[]> => {
    const params = type ? `?type=${type}` : '';
    return await api.get<Transaction[]>(`/units/${unitId}/transactions${params}`);
  },

  // Получи баланса на unit
  getUnitBalance: async (unitId: number): Promise<number> => {
    return await api.get<number>(`/units/${unitId}/balance`);
  },

  // Получи детайли за разписка
  getReceiptDetails: async (transactionId: number): Promise<ReceiptDetails> => {
    return await api.get<ReceiptDetails>(`/transactions/${transactionId}/receipt-details`);
  },

  // Одобри транзакция (само за мениджъри)
  approveTransaction: async (transactionId: number): Promise<void> => {
    await api.post<void>(`/transactions/${transactionId}/approve`);
  },

  // Отхвърли транзакция (само за мениджъри)
  rejectTransaction: async (transactionId: number): Promise<void> => {
    await api.post<void>(`/transactions/${transactionId}/reject`);
  },

  // Помощна функция: Получи само плащанията за unit
  getUnitPayments: async (unitId: number): Promise<Transaction[]> => {
    return await paymentService.getUnitTransactions(unitId, 'PAYMENT' as TransactionType);
  },

  // Помощна функция: Получи само таксите за unit
  getUnitFees: async (unitId: number): Promise<Transaction[]> => {
    return await paymentService.getUnitTransactions(unitId, 'FEE' as TransactionType);
  },
};