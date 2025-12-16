import { Search, UserPlus, Mail, Phone, MapPin, MoreVertical, Edit2, Trash2, Key, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { residentService, type ResidentWithUnit } from '../services/residentService';

export function ApartmentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<ResidentWithUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    loadResidents();
    // Провери за запазен код за достъп
    const savedCode = localStorage.getItem('buildingCode');
    if (savedCode) {
      setAccessCode(savedCode);
    }

    // Слушател за промени в localStorage (когато се генерира нов код)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'buildingCode' && e.newValue) {
        setAccessCode(e.newValue);
      }
    };

    // Слушател за custom event когато се генерира нов код
    const handleBuildingCodeUpdate = (e: CustomEvent) => {
      if (e.detail?.code) {
        setAccessCode(e.detail.code);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('buildingCodeUpdated', handleBuildingCodeUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('buildingCodeUpdated', handleBuildingCodeUpdate as EventListener);
    };
  }, []);

  // Затваряне на менюто при клик извън него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-menu')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const loadResidents = async () => {
    try {
      setLoading(true);
      const data = await residentService.getAll();
      setResidents(data);
    } catch (err) {
      console.error('Error loading residents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resident: ResidentWithUnit) => {
    console.log('Редактиране на:', resident);
    // TODO: Отваряне на модал за редактиране
    setOpenMenuId(null);
  };

  const handleDelete = async (resident: ResidentWithUnit) => {
    if (window.confirm(`Сигурни ли сте, че искате да изтриете жител ${resident.fullName}?`)) {
      try {
        await residentService.delete(resident.id);
        await loadResidents(); // Презареждане на данните
        console.log('Изтрит жител:', resident);
      } catch (err) {
        console.error('Грешка при изтриване:', err);
        alert('Грешка при изтриване на жителя');
      }
    }
    setOpenMenuId(null);
  };

  const filteredResidents = residents.filter(resident =>
    (resident.unitNumber && resident.unitNumber.includes(searchTerm)) ||
    resident.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600 text-center">Зареждане на апартаменти...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Код за достъп - показва се само ако има запазен код */}
      {accessCode && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 relative">
          <button
            onClick={() => setAccessCode(null)}
            className="absolute top-4 right-4 p-1 hover:bg-blue-100 rounded-lg transition-colors"
            title="Скрий кода"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">Код за достъп до входа</h3>
              <p className="text-gray-600 text-sm mb-4">
                Споделете този код с жителите, за да могат да се регистрират в системата
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-white px-6 py-3 rounded-lg border-2 border-blue-300 shadow-sm">
                  <span className="text-blue-600 tracking-widest text-2xl">
                    {accessCode}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(accessCode);
                    alert('Кодът е копиран!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Копирай
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Управление на апартаменти</h1>
          <p className="text-gray-600">Общо {residents.length} апартамента</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-5 h-5" />
          Добави жител
        </button>
      </div>

      {/* Търсене */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Търси по име или апартамент..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Таблица с апартаменти */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Апартамент</th>
                <th className="px-6 py-3 text-left text-gray-700">Име</th>
                <th className="px-6 py-3 text-left text-gray-700">Контакти</th>
                <th className="px-6 py-3 text-left text-gray-700">Баланс</th>
                <th className="px-6 py-3 text-left text-gray-700">Статус</th>
                <th className="px-6 py-3 text-right text-gray-700"> </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    {searchTerm ? 'Няма намерени апартаменти' : 'Няма апартаменти'}
                  </td>
                </tr>
              ) : (
                filteredResidents.map((resident) => {
                  const balance = resident.unit?.balance?.balance || 0;
                  return (
                    <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4" />
                          <span>№ {resident.unitNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600">
                              {resident.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-gray-900">{resident.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Mail className="w-4 h-4" />
                            <span>{resident.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`${
                          balance > 0
                            ? 'text-green-600'
                            : balance < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {balance > 0 ? '+' : ''}{balance.toFixed(2)} лв
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Активен
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative action-menu">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => setOpenMenuId(openMenuId === resident.id ? null : resident.id)}
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {openMenuId === resident.id && (
                          <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                onClick={() => handleEdit(resident)}
                              >
                                <Edit2 className="w-4 h-4" />
                                Редактирай
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                onClick={() => handleDelete(resident)}
                              >
                                <Trash2 className="w-4 h-4" />
                                Изтрий
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}