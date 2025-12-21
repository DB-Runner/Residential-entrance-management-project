import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, Banknote, Building2 } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { useSelection } from '../contexts/SelectionContext';
import { FundType } from '../types/database';
import { StripePaymentForm } from './StripePaymentForm';

type PaymentMethod = 'stripe' | 'cash' | 'bank';

export function PaymentCheckout() {
  const navigate = useNavigate();
  const { selectedUnit } = useSelection();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [amount, setAmount] = useState('');
  const [fundType, setFundType] = useState<FundType>(FundType.GENERAL);
  const [note, setNote] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);

  if (!selectedUnit) {
    navigate('/dashboard/payments');
    return null;
  }

  const handleStripePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Моля, въведете валидна сума');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Създаване на Stripe Payment Intent
      const { clientSecret } = await paymentService.createStripePayment(
        selectedUnit.unitId,
        parseFloat(amount)
      );

      setStripeClientSecret(clientSecret);
      setShowStripeForm(true);
      setIsProcessing(false);
      
    } catch (err: any) {
      setError(err.message || 'Грешка при създаване на плащане');
      setIsProcessing(false);
    }
  };

  const handleStripeSuccess = () => {
    alert('Плащането е успешно обработено! ✓');
    navigate('/dashboard/payments');
  };

  const handleStripeCancel = () => {
    setShowStripeForm(false);
    setStripeClientSecret(null);
    setIsProcessing(false);
  };

  const handleCashPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Моля, въведете валидна сума');
      return;
    }

    if (!note.trim()) {
      setError('Моля, добавете бележка за плащането');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      await paymentService.createCashPayment(selectedUnit.unitId, {
        amount: parseFloat(amount),
        fundType,
        note
      });

      setIsProcessing(false);
      alert('Кеш плащането е регистрирано и чака одобрение от мениджъра');
      navigate('/dashboard/payments');
      
    } catch (err: any) {
      setError(err.message || 'Грешка при регистриране на плащане');
      setIsProcessing(false);
    }
  };

  const handleBankPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Моля, въведете валидна сума');
      return;
    }

    if (!bankReference.trim()) {
      setError('Моля, въведете референция на банковия превод');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      await paymentService.createBankPayment(selectedUnit.unitId, {
        amount: parseFloat(amount),
        transactionReference: bankReference,
        proofUrl: '' // Може да се добави upload на доказателство
      });

      setIsProcessing(false);
      alert('Банковото плащане е регистрирано и чака одобрение от мениджъра');
      navigate('/dashboard/payments');
      
    } catch (err: any) {
      setError(err.message || 'Грешка при регистриране на плащане');
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    } else if (paymentMethod === 'cash') {
      await handleCashPayment();
    } else if (paymentMethod === 'bank') {
      await handleBankPayment();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/payments')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад към плащания
          </button>
          <h1 className="text-gray-900 mb-2">Извърши плащане</h1>
          <p className="text-gray-600">Изберете метод на плащане и въведете сума</p>
        </div>

        {/* Stripe Form Overlay */}
        {showStripeForm && stripeClientSecret && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
              <StripePaymentForm
                clientSecret={stripeClientSecret}
                amount={parseFloat(amount)}
                unitId={selectedUnit.unitId}
                onSuccess={handleStripeSuccess}
                onCancel={handleStripeCancel}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Форма за плащане */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-gray-900 mb-6">Детайли на плащането</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Метод на плащане */}
                <div>
                  <label className="block text-gray-700 mb-3">
                    Метод на плащане *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                        paymentMethod === 'stripe' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm text-gray-700">Карта</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Banknote className={`w-6 h-6 mx-auto mb-2 ${
                        paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm text-gray-700">Кеш</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'bank'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className={`w-6 h-6 mx-auto mb-2 ${
                        paymentMethod === 'bank' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm text-gray-700">Банка</p>
                    </button>
                  </div>
                </div>

                {/* Сума */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Сума *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">лв</span>
                  </div>
                </div>

                {/* Тип фонд (само за cash и bank) */}
                {(paymentMethod === 'cash' || paymentMethod === 'bank') && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Тип фонд *
                    </label>
                    <select
                      value={fundType}
                      onChange={(e) => setFundType(e.target.value as FundType)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={FundType.GENERAL}>Фонд Поддръжка</option>
                      <option value={FundType.REPAIR}>Фонд Ремонти</option>
                    </select>
                  </div>
                )}

                {/* Допълнителна информация според метода */}
                {paymentMethod === 'stripe' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <Lock className="w-4 h-4 inline mr-1" />
                      След натискане на бутона ще бъдете пренасочени към защитена страница за въвеждане на данни на картата
                    </p>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Бележка *
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Добавете бележка за плащането (напр. 'Платено на каса')"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Плащането ще чака одобрение от мениджъра на входа
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Референция на превод *
                    </label>
                    <input
                      type="text"
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                      placeholder="Въведете референция или номер на превода"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Плащането ще чака одобрение от мениджъра на входа
                    </p>
                  </div>
                )}

                {/* Съобщение за грешка */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Бутон за плащане */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Обработка...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'stripe' && <CreditCard className="w-5 h-5" />}
                      {paymentMethod === 'cash' && <Banknote className="w-5 h-5" />}
                      {paymentMethod === 'bank' && <Building2 className="w-5 h-5" />}
                      {paymentMethod === 'stripe' ? 'Продължи към плащане' : 'Регистрирай плащане'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Обобщение */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-gray-900 mb-4">Обобщение</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Апартамент:</span>
                  <span>№ {selectedUnit.unitNumber}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Вход:</span>
                  <span className="text-right text-sm">{selectedUnit.buildingName}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Метод:</span>
                  <span>
                    {paymentMethod === 'stripe' ? 'Карта' :
                     paymentMethod === 'cash' ? 'Кеш' :
                     'Банков превод'}
                  </span>
                </div>
                {(paymentMethod === 'cash' || paymentMethod === 'bank') && (
                  <div className="flex justify-between text-gray-600">
                    <span>Фонд:</span>
                    <span className="text-sm text-right">
                      {fundType === FundType.REPAIR ? 'Ремонти' : 'Поддръжка'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-900">Сума:</span>
                <span className="text-blue-600">
                  {amount ? parseFloat(amount).toFixed(2) : '0.00'} лв
                </span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Сигурно плащане
                </p>
                <p className="text-green-700 text-xs mt-1">
                  {paymentMethod === 'stripe' 
                    ? 'Данните на вашата карта са напълно защитени'
                    : 'Плащането ще бъде потвърдено от мениджъра'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}