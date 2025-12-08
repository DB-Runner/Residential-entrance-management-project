import { Receipt, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface PaymentsPanelProps {
  expanded?: boolean;
}

const payments = [
  {
    id: 1,
    title: 'Такса поддръжка',
    amount: 85.00,
    dueDate: '2025-12-10',
    status: 'pending' as const,
    description: 'Месечна такса за декември'
  },
  {
    id: 2,
    title: 'Ток общи части',
    amount: 12.50,
    dueDate: '2025-12-10',
    status: 'pending' as const,
    description: 'Електричество ноември'
  },
  {
    id: 3,
    title: 'Такса поддръжка',
    amount: 85.00,
    paidDate: '2025-11-08',
    status: 'paid' as const,
    description: 'Месечна такса за ноември'
  },
  {
    id: 4,
    title: 'Ремонт асансьор',
    amount: 45.00,
    paidDate: '2025-10-15',
    status: 'paid' as const,
    description: 'Спешен ремонт'
  },
  {
    id: 5,
    title: 'Такса поддръжка',
    amount: 85.00,
    dueDate: '2025-10-01',
    status: 'overdue' as const,
    description: 'Месечна такса за октомври'
  }
];

export function PaymentsPanel({ expanded = false }: PaymentsPanelProps) {
  const displayPayments = expanded ? payments : payments.slice(0, 4);
  const pendingTotal = payments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Плащания</h2>
              <p className="text-gray-600 text-sm">Текущи и минали такси</p>
            </div>
          </div>
        </div>
      </div>

      {/* Обобщение */}
      <div className="p-6 bg-blue-50 border-b">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Общо за плащане:</span>
          <span className="text-blue-600">{pendingTotal.toFixed(2)} лв</span>
        </div>
      </div>

      {/* Списък с плащания */}
      <div className="divide-y">
        {displayPayments.map((payment) => (
          <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-gray-900">{payment.title}</h3>
                  {payment.status === 'paid' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {payment.status === 'overdue' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  {payment.status === 'pending' && (
                    <Clock className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{payment.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  {payment.status === 'paid' ? (
                    <span className="text-green-600">
                      Платено на {new Date(payment.paidDate!).toLocaleDateString('bg-BG')}
                    </span>
                  ) : payment.status === 'overdue' ? (
                    <span className="text-red-600">
                      Просрочено от {new Date(payment.dueDate!).toLocaleDateString('bg-BG')}
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      Падеж: {new Date(payment.dueDate!).toLocaleDateString('bg-BG')}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`${
                  payment.status === 'paid' ? 'text-gray-600' : 'text-gray-900'
                }`}>
                  {payment.amount.toFixed(2)} лв
                </div>
                {payment.status !== 'paid' && (
                  <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    Плати
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!expanded && payments.length > 4 && (
        <div className="p-4 border-t">
          <button className="w-full text-center text-blue-600 hover:text-blue-700">
            Виж всички плащания
          </button>
        </div>
      )}
    </div>
  );
}
