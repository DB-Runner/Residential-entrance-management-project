import { Users, DollarSign, TrendingUp, AlertCircle, Building2, Archive, FileText, Vote, CalendarDays } from 'lucide-react';
import { useSelection } from '../contexts/SelectionContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { buildingService, type FinancialSummary } from '../services/buildingService';
import { unitService, type UnitResponseFromAPI } from '../services/unitService';
import { pollService, type Poll } from '../services/pollService';
import { eventService, type Notice } from '../services/eventService';
import type { Transaction, Document } from '../types/database';
import { TransactionType, TransactionStatus, DocumentType } from '../types/database';

export function AdminOverview() {
  const { selectedBuilding } = useSelection();
  const navigate = useNavigate();
  const [recentPayments, setRecentPayments] = useState<Transaction[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [units, setUnits] = useState<UnitResponseFromAPI[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [loadingFinancial, setLoadingFinancial] = useState(true);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    loadRecentPayments();
    loadRecentDocuments();
    loadUnits();
    loadFinancialSummary();
    loadPolls();
    loadNotices();
  }, [selectedBuilding]);

  const loadRecentPayments = async () => {
    if (!selectedBuilding) return;
    
    try {
      setLoadingPayments(true);
      const transactions = await buildingService.getTransactions(
        selectedBuilding.id,
        TransactionType.PAYMENT,
        TransactionStatus.CONFIRMED
      );
      // Вземи последните 4 плащания
      setRecentPayments(transactions.slice(0, 4));
    } catch (err) {
      console.error('Error loading recent payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const loadRecentDocuments = async () => {
    if (!selectedBuilding) return;
    
    try {
      setLoadingDocuments(true);
      const documents = await buildingService.getDocuments(selectedBuilding.id);
      // Вземи последните 4 документа
      setRecentDocuments(documents.slice(0, 4));
    } catch (err) {
      console.error('Error loading recent documents:', err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadUnits = async () => {
    if (!selectedBuilding) return;
    
    try {
      setLoadingUnits(true);
      const unitsData = await unitService.getAllByBuilding(selectedBuilding.id);
      setUnits(unitsData);
    } catch (err) {
      console.error('Error loading units:', err);
    } finally {
      setLoadingUnits(false);
    }
  };

  const loadFinancialSummary = async () => {
    if (!selectedBuilding) return;
    
    try {
      setLoadingFinancial(true);
      const summary = await buildingService.getFinancialSummary(selectedBuilding.id);
      setFinancialSummary(summary);
    } catch (err) {
      console.error('Error loading financial summary:', err);
    } finally {
      setLoadingFinancial(false);
    }
  };

  const loadPolls = async () => {
    if (!selectedBuilding) return;
    
    try {
      setLoadingPolls(true);
      const pollsData = await pollService.getAllPolls(selectedBuilding.id, 'ALL');
      setPolls(pollsData);
    } catch (err) {
      console.error('Error loading polls:', err);
    } finally {
      setLoadingPolls(false);
    }
  };

  const loadNotices = async () => {
    if (!selectedBuilding) return;
    
    try {
      setLoadingNotices(true);
      const noticesData = await eventService.getAll(selectedBuilding.id, 'ALL');
      setNotices(noticesData);
    } catch (err) {
      console.error('Error loading notices:', err);
    } finally {
      setLoadingNotices(false);
    }
  };

  // Сметни общо жители
  const totalResidents = units.reduce((sum, unit) => sum + unit.residents, 0);

  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PROTOCOL:
        return 'Протокол';
      case DocumentType.INVOICE:
        return 'Фактура';
      case DocumentType.CONTRACT:
        return 'Договор';
      case DocumentType.OTHER:
        return 'Друго';
      default:
        return 'Документ';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Преглед</h1>
        <p className="text-gray-600">Обобщена информация за входа</p>
      </div>

      {/* Статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Общо жители */}
        <div 
          onClick={() => navigate('/admin/dashboard/residents')}
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">
            {loadingUnits ? '...' : totalResidents}
          </div>
          <div className="text-gray-600 text-sm mb-1">Общо жители</div>
          <div className="text-gray-500 text-xs">
            {loadingUnits ? 'Зареждане...' : `${units.length} апартамента`}
          </div>
        </div>

        {/* Средства */}
        <div 
          onClick={() => navigate('/admin/dashboard/payments')}
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">
            {loadingFinancial ? '...' : financialSummary ? 
              `${financialSummary.totalBalance.toFixed(2)} EUR` : 
              '0.00 EUR'}
          </div>
          <div className="text-gray-600 text-sm mb-1">Общо средства</div>
          <div className="text-gray-500 text-xs">
            Поддръжка • Ремонти
          </div>
        </div>

        {/* Вотове */}
        <div 
          onClick={() => navigate('/admin/dashboard/voting')}
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <Vote className="w-6 h-6" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">
            {loadingPolls ? '...' : polls.length}
          </div>
          <div className="text-gray-600 text-sm mb-1">Общо вотове</div>
          <div className="text-gray-500 text-xs">
            {loadingPolls ? 'зареждане...' : `общо ${polls.length} гласувания`}
          </div>
        </div>

        {/* Събития */}
        <div 
          onClick={() => navigate('/admin/dashboard/events')}
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">
            {loadingNotices ? '...' : notices.length}
          </div>
          <div className="text-gray-600 text-sm mb-1">Общо събития</div>
          <div className="text-gray-500 text-xs">
            {loadingNotices ? 'зареждане...' : `общо ${notices.length} събития`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Последни плащания */}
        <div className="bg-white rounded-lg shadow flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-gray-900">Последни плащания</h2>
          </div>
          <div className="divide-y flex-1">
            {loadingPayments ? (
              <div className="p-4 text-gray-500">Зареждане...</div>
            ) : recentPayments.length > 0 ? (
              recentPayments.map((payment) => (
                <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-900">{payment.description || 'Плащане'}</div>
                      <div className="text-gray-600 text-sm">
                        {payment.paymentMethod === 'STRIPE' ? 'Карта' : 
                         payment.paymentMethod === 'CASH' ? 'Кеш' : 
                         'Банков превод'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900">{payment.amount.toFixed(2)} EUR</div>
                      <div className="text-gray-500 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString('bg-BG')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500">Няма последни плащания</div>
            )}
          </div>
          {!loadingPayments && (
            <div className="p-4 border-t mt-auto">
              <button
                onClick={() => navigate('/admin/dashboard/payments')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Виж всички транзакции
              </button>
            </div>
          )}
        </div>

        {/* Архив */}
        <div className="bg-white rounded-lg shadow flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-gray-900">Последни документи</h2>
            <Archive className="w-5 h-5 text-gray-400" />
          </div>
          <div className="divide-y flex-1">
            {loadingDocuments ? (
              <div className="p-4 text-gray-500">Зареждане...</div>
            ) : recentDocuments.length > 0 ? (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => window.open(doc.fileUrl, '_blank')}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 truncate">{doc.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-600 text-sm">{getDocumentTypeLabel(doc.type)}</span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(doc.createdAt).toLocaleDateString('bg-BG')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500">Няма документи</div>
            )}
          </div>
          {!loadingDocuments && (
            <div className="p-4 border-t mt-auto">
              <button
                onClick={() => navigate('/admin/dashboard/archive')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Виж всички документи
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}